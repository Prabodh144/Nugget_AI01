const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Basic profanity filter using regex patterns
const profanityPatterns = [
  /\b(fuck|shit|bitch|asshole|dick|pussy|cunt|cock|whore|slut)\b/gi,
  /\b(damn|hell|goddamn|jesus christ)\b/gi,
  /\b(racist|sexist|homophobic|transphobic)\b/gi,
  /\b(kill|murder|suicide|death)\b/gi,
  /\b(drugs|cocaine|heroin|meth)\b/gi,
  /\b(terrorist|bomb|explosion)\b/gi,
];

// Professional context words that should be flagged
const unprofessionalPatterns = [
  /\b(stupid|idiot|moron|dumbass)\b/gi,
  /\b(fat|ugly|stupid|worthless)\b/gi,
  /\b(hate|despise|loathe)\b/gi,
];

// Check for profanity using regex patterns
function checkProfanityRegex(text) {
  const lowerText = text.toLowerCase();
  
  // Check for profanity patterns
  for (const pattern of profanityPatterns) {
    if (pattern.test(lowerText)) {
      return false;
    }
  }
  
  // Check for unprofessional patterns
  for (const pattern of unprofessionalPatterns) {
    if (pattern.test(lowerText)) {
      return false;
    }
  }
  
  return true;
}

// Check for profanity using Gemini API (more comprehensive)
async function checkProfanityGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const moderationPrompt = `Analyze the following text for inappropriate content. Check for:
- Hate speech or discriminatory language
- Violence or threats
- Sexual content
- Self-harm content
- Unprofessional or offensive language

Text to analyze: "${text}"

Respond with only "APPROPRIATE" if the content is suitable for a professional LinkedIn post, or "INAPPROPRIATE" if it contains any of the above issues.`;

    const result = await model.generateContent(moderationPrompt);
    const response = result.response.text().trim().toUpperCase();
    
    return response === 'APPROPRIATE';
  } catch (error) {
    console.error('Gemini moderation API error:', error);
    // Fallback to regex check if API fails
    return checkProfanityRegex(text);
  }
}

// Main profanity check function
async function checkProfanity(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // First, do a quick regex check
  if (!checkProfanityRegex(text)) {
    return false;
  }
  
  // If regex passes, do a more comprehensive check with Gemini
  // Note: You can comment out this line to use only regex checking for faster performance
  return await checkProfanityGemini(text);
}

module.exports = {
  checkProfanity,
  checkProfanityRegex,
  checkProfanityGemini
};
