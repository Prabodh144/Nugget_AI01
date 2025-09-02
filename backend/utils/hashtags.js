// Utility functions for hashtag processing
// This is a backup utility - main hashtag extraction is done in openai.js

// Extract hashtags from text using regex
function extractHashtags(text) {
  const hashtagRegex = /#\w+/g;
  return text.match(hashtagRegex) || [];
}

// Validate hashtag format
function validateHashtag(hashtag) {
  // Hashtag should start with # and contain only letters, numbers, and underscores
  const hashtagRegex = /^#[a-zA-Z0-9_]+$/;
  return hashtagRegex.test(hashtag);
}

// Clean and format hashtags
function cleanHashtags(hashtags) {
  return hashtags
    .map(tag => tag.trim())
    .filter(tag => validateHashtag(tag))
    .map(tag => tag.toLowerCase())
    .filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
}

// Common LinkedIn hashtags by category
const commonHashtags = {
  professional: [
    '#LinkedIn', '#ProfessionalDevelopment', '#Networking', '#CareerGrowth',
    '#Business', '#Leadership', '#Management', '#Innovation'
  ],
  entrepreneurship: [
    '#Entrepreneurship', '#Startup', '#Business', '#Innovation', '#Growth',
    '#Success', '#Motivation', '#Leadership'
  ],
  technology: [
    '#Technology', '#Innovation', '#DigitalTransformation', '#AI', '#Tech',
    '#Software', '#Programming', '#DataScience'
  ],
  marketing: [
    '#Marketing', '#DigitalMarketing', '#ContentMarketing', '#SocialMedia',
    '#Branding', '#Growth', '#Strategy'
  ]
};

// Get relevant hashtags based on topic keywords
function getRelevantHashtags(topic, category = 'professional') {
  const topicLower = topic.toLowerCase();
  let relevantHashtags = [...commonHashtags.professional];
  
  // Add category-specific hashtags
  if (category in commonHashtags) {
    relevantHashtags = [...relevantHashtags, ...commonHashtags[category]];
  }
  
  // Add topic-specific hashtags based on keywords
  if (topicLower.includes('tech') || topicLower.includes('software') || topicLower.includes('ai')) {
    relevantHashtags = [...relevantHashtags, ...commonHashtags.technology];
  }
  
  if (topicLower.includes('business') || topicLower.includes('startup') || topicLower.includes('entrepreneur')) {
    relevantHashtags = [...relevantHashtags, ...commonHashtags.entrepreneurship];
  }
  
  if (topicLower.includes('marketing') || topicLower.includes('brand') || topicLower.includes('social')) {
    relevantHashtags = [...relevantHashtags, ...commonHashtags.marketing];
  }
  
  // Remove duplicates and return top 8
  return [...new Set(relevantHashtags)].slice(0, 8);
}

module.exports = {
  extractHashtags,
  validateHashtag,
  cleanHashtags,
  getRelevantHashtags,
  commonHashtags
};
