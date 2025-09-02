# LinkedIn Post Generator - Backend

Node.js Express API for the LinkedIn Post Generator. This backend handles AI-powered content generation using OpenAI's GPT model.

## Features

- **OpenAI Integration**: Multi-step reasoning for post generation
- **Content Moderation**: Profanity filtering with regex and OpenAI moderation
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error responses
- **CORS Support**: Cross-origin resource sharing enabled

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### Production

1. Set environment variables:
```bash
export NODE_ENV=production
export PORT=5000
export OPENAI_API_KEY=your_api_key
```

2. Start the server:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Generate Posts
```
POST /api/generate
```

**Request Body:**
```json
{
  "topic": "string (required)",
  "tone": "professional|casual|friendly|authoritative|inspirational",
  "audience": "general|professionals|entrepreneurs|students|managers",
  "length": "short|medium|long",
  "numberOfPosts": 3-6
}
```

**Response:**
```json
{
  "posts": [
    {
      "content": "Post content here...",
      "hashtags": ["#LinkedIn", "#ProfessionalDevelopment"]
    }
  ]
}
```

**Error Responses:**
```json
{
  "message": "Error description"
}
```

## Deployment Options

### Heroku

1. **Create Heroku app:**
```bash
heroku create your-app-name
```

2. **Set environment variables:**
```bash
heroku config:set OPENAI_API_KEY=your_api_key
heroku config:set NODE_ENV=production
```

3. **Deploy:**
```bash
git push heroku main
```

### Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**

### Railway

1. **Connect GitHub repository**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically**

### DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Configure build settings**

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | No | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | 100 |

## Configuration

### Rate Limiting
Modify in `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
});
```

### CORS
Configure in `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

### Content Moderation
The app uses a two-tier moderation system:

1. **Regex-based filtering** (fast)
2. **OpenAI moderation API** (comprehensive)

To disable OpenAI moderation for faster performance:
```javascript
// In utils/moderation.js, comment out:
// return await checkProfanityOpenAI(text);
```

## AI Generation Process

### Multi-Step Reasoning

1. **Planning Phase:**
   - Analyzes topic and requirements
   - Creates structured outline
   - Determines key points and messaging

2. **Generation Phase:**
   - Creates actual post content
   - Applies tone and style
   - Ensures professional quality

3. **Hashtag Extraction:**
   - Analyzes content for relevant hashtags
   - Focuses on professional and industry-specific tags
   - Optimizes for discoverability

### Prompt Engineering

The system uses carefully crafted prompts to ensure:
- Professional tone and content
- Engaging and shareable posts
- Appropriate hashtag selection
- Consistent quality across generations

## Error Handling

### Common Errors

1. **Invalid API Key:**
   - Check OpenAI API key configuration
   - Verify key has sufficient credits

2. **Rate Limit Exceeded:**
   - Implement exponential backoff
   - Consider upgrading OpenAI plan

3. **Content Moderation:**
   - Generated content flagged as inappropriate
   - Try different topic or parameters

### Error Response Format
```json
{
  "message": "Human-readable error message",
  "error": "Technical error details (development only)"
}
```

## Security

### Input Validation
- Topic length limits
- Parameter validation
- SQL injection prevention
- XSS protection

### API Protection
- Rate limiting
- CORS configuration
- Request size limits
- Content moderation

### Environment Security
- API keys in environment variables
- No sensitive data in code
- Secure deployment practices

## Monitoring

### Health Check
Monitor `/health` endpoint for:
- Server status
- Response time
- Error rates

### Logging
- Request/response logging
- Error tracking
- Performance metrics

### Performance
- Response time monitoring
- Memory usage tracking
- API call optimization

## Troubleshooting

### Common Issues

1. **OpenAI API Errors:**
   - Check API key validity
   - Verify account has credits
   - Check rate limits

2. **CORS Issues:**
   - Verify frontend domain in CORS config
   - Check request headers

3. **Memory Issues:**
   - Monitor memory usage
   - Implement request timeouts
   - Optimize API calls

## Development

### Adding New Features

1. **New API Endpoints:**
   - Add routes in `routes/` directory
   - Update server.js with new routes
   - Add validation and error handling

2. **AI Enhancements:**
   - Modify prompts in `utils/openai.js`
   - Add new generation parameters
   - Implement additional AI features

3. **Content Moderation:**
   - Update patterns in `utils/moderation.js`
   - Add new filtering rules
   - Implement custom moderation logic

### Testing

1. **API Testing:**
   - Use Postman or similar tools
   - Test all endpoints
   - Verify error handling

2. **Load Testing:**
   - Test rate limiting
   - Monitor performance
   - Check memory usage

## Support

For issues and questions:
1. Check error logs
2. Verify environment configuration
3. Test with minimal requests
4. Contact support with detailed error information
