


const express = require('express');
const router = express.Router();
const { generatePosts } = require('../utils/grok');
const { checkProfanity } = require('../utils/moderation');

// POST /api/generate
router.post('/generate', async (req, res) => {
  try {
    const { topic, tone, audience, length, numberOfPosts } = req.body;

    // Input validation
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    if (numberOfPosts && (numberOfPosts < 3 || numberOfPosts > 6)) {
      return res.status(400).json({ message: 'Number of posts must be between 3 and 6' });
    }

    // Validate other inputs
    const validTones = ['professional', 'casual', 'friendly', 'authoritative', 'inspirational'];
    const validAudiences = ['general', 'professionals', 'entrepreneurs', 'students', 'managers'];
    const validLengths = ['short', 'medium', 'long'];

    if (tone && !validTones.includes(tone)) {
      return res.status(400).json({ message: 'Invalid tone specified' });
    }

    if (audience && !validAudiences.includes(audience)) {
      return res.status(400).json({ message: 'Invalid audience specified' });
    }

    if (length && !validLengths.includes(length)) {
      return res.status(400).json({ message: 'Invalid length specified' });
    }

    // Generate posts using Grok
    const posts = await generatePosts({
      topic: topic.trim(),
      tone: tone || 'professional',
      audience: audience || 'general',
      length: length || 'medium',
      numberOfPosts: numberOfPosts || 3
    });

    // Check for profanity in generated content
    const filteredPosts = [];
    for (const post of posts) {
      const isClean = await checkProfanity(post.content);
      if (isClean) {
        filteredPosts.push(post);
      }
    }

    if (filteredPosts.length === 0) {
      return res.status(500).json({ 
        message: 'Unable to generate appropriate content. Please try again with a different topic.' 
      });
    }

    res.json({ posts: filteredPosts });

  } catch (error) {
    console.error('Error generating posts:', error);
    
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        message: 'Grok API configuration error. Please check your API key.'
      });
    }
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ 
        message: 'Grok Rate limit exceeded. Please try again later.' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to generate posts. Please try again.' 
    });
  }
});

module.exports = router;