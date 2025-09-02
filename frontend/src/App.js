import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    audience: 'general',
    length: 'medium',
    numberOfPosts: 3
  });
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(null); // ⏱ state for latency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      setError('Topic is required');
      return;
    }

    setLoading(true);
    setError('');
    setPosts([]);
    setLatency(null);

    const startTime = performance.now(); // start timer

    try {
      const response = await fetch('https://nugget-ai01-backend.onrender.com/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      const endTime = performance.now(); // end timer
      setLatency(((endTime - startTime) / 1000).toFixed(2)); // store seconds

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate posts');
      }

      // ✅ Use the posts directly from backend response (already properly formatted)
      const splitPosts = data.posts || [];
      
      setPosts(splitPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>LinkedIn Post Generator</h1>
        <p>AI-powered content creation for professional networking</p>
      </header>

      <main className="App-main">
        <form onSubmit={handleSubmit} className="generator-form">
          <div className="form-group">
            <label htmlFor="topic">Topic *</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter your post topic..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tone">Tone</label>
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="audience">Audience</label>
              <select
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
              >
                <option value="general">General</option>
                <option value="professionals">Professionals</option>
                <option value="entrepreneurs">Entrepreneurs</option>
                <option value="students">Students</option>
                <option value="managers">Managers</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="length">Length</label>
              <select
                id="length"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numberOfPosts">Number of Posts</label>
              <select
                id="numberOfPosts"
                name="numberOfPosts"
                value={formData.numberOfPosts}
                onChange={handleInputChange}
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="generate-btn"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Posts'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Generating your LinkedIn posts...</p>
          </div>
        )}

        {latency && (
          <div className="latency-info">
            ⏱ Response Time: {latency} seconds
          </div>
        )}

        {posts.length > 0 && (
          <div className="posts-container">
            <h2>Generated Posts</h2>
            <div className="posts-grid">
              {posts.map((post, index) => (
                <div key={index} className="post-card">
                  <div className="post-content">
                    {post.content}
                  </div>
                  <div className="post-hashtags">
                    {post.hashtags && post.hashtags.map((hashtag, hashtagIndex) => (
                      <span key={hashtagIndex} className="hashtag">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(`${post.content}\n\n${post.hashtags ? post.hashtags.join(' ') : ''}`)}
                  >
                    Copy Post
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;