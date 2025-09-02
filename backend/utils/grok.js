



const OpenAI = require("openai");

// Initialize Grok client (API key stored in .env)
const grok = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1" // Grok endpoint (OpenAI-compatible)
});
const model = "llama-3.1-8b-instant";

// Multi-step reasoning for LinkedIn post generation
async function generatePosts({ topic, tone, audience, length, numberOfPosts }) {
  try {
    // Step 1: Plan the post structure
    const planningPrompt = `You are an expert LinkedIn content strategist. Plan ${numberOfPosts} LinkedIn posts about "${topic}".

Requirements:
- Tone: ${tone}
- Target audience: ${audience}
- Length: ${length}
- Number of posts(match the number of posts accurately, neither less nor more): ${numberOfPosts}

For each post, provide:
1. A brief outline of the key points
2. The intended message/insight
3. The hook/opening strategy

#Important: number of posts generated should be equal to number of posts
Format your response as a structured plan that can be used to generate the actual posts.`;

    const planningResponse = await grok.chat.completions.create({
      model : model, // Grok model name
      messages: [{ role: "user", content: planningPrompt }],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const plan = planningResponse.choices[0].message.content;

    // Step 2: Generate the actual posts
    const generationPrompt = `Based on this plan, generate ${numberOfPosts} LinkedIn posts about "${topic}":

PLAN:
${plan}

Requirements:
- Tone: ${tone}
- Target audience: ${audience}
- Length: ${length === 'short' ? '100-150 words' : length === 'medium' ? '200-300 words' : '400-500 words'}
- Make each post engaging and professional
- Include line breaks for readability
- Write in a way that encourages engagement

Generate ${numberOfPosts} posts, each separated by "---POST_SEPARATOR---"`;

    const generationResponse = await grok.chat.completions.create({
      model : model,
      messages: [{ role: "user", content: generationPrompt }],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const generatedContent = generationResponse.choices[0].message.content;
    const posts = generatedContent
      .split('---POST_SEPARATOR---')
      .map(post => post.trim())
      .filter(post => post.length > 0);

    // Step 3: Extract hashtags
    const postsWithHashtags = [];
    for (const post of posts) {
      const hashtagPrompt = `Extract 8-10 relevant hashtags for this LinkedIn post. Focus on professional, industry-specific hashtags and engaging hashtage that would help with discoverability.

Post content:
${post}

Return only the hashtags, separated by spaces, starting with #. Example: #LinkedIn #ProfessionalDevelopment #Networking`;

      const hashtagResponse = await grok.chat.completions.create({
        model : model,
        messages: [{ role: "user", content: hashtagPrompt }],
        max_tokens: 2000,
        temperature: 0.3,
      });

      const hashtagsText = hashtagResponse.choices[0].message.content;
      const hashtags = hashtagsText.match(/#\w+/g) || [];

      postsWithHashtags.push({
        content: post,
        hashtags
      });
    }

    return postsWithHashtags;

  } catch (error) {
    console.error("Grok API Error:", error);

    if (error.message?.includes("API key")) {
      throw new Error("Invalid Grok API key");
    }

    if (error.message?.includes("rate limit")) {
      throw new Error("Grok rate limit exceeded");
    }

    throw new Error("Failed to generate posts with Grok");
  }
}

module.exports = {
  generatePosts
};