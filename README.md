# LinkedIn Post Generator

A complete web application that generates professional LinkedIn posts using AI. Built with React frontend and Node.js backend, powered by OpenAI's GPT model.

## Features

- **AI-Powered Content Generation**: Uses OpenAI GPT-3.5-turbo for intelligent post creation
- **Multi-Step Reasoning**: Plans post structure, generates content, and extracts relevant hashtags
- **Customizable Parameters**: 
  - Topic (required)
  - Tone (professional, casual, friendly, authoritative, inspirational)
  - Audience (general, professionals, entrepreneurs, students, managers)
  - Length (short, medium, long)
  - Number of posts (3-6)
- **Content Moderation**: Built-in profanity filter using regex patterns and OpenAI moderation API
- **Professional UI**: Clean, responsive design with modern styling
- **Copy Functionality**: One-click copy for generated posts
- **Rate Limiting**: API protection against abuse

## Tech Stack

### Frontend
- React 18 (functional components, hooks)
- CSS3 with modern styling
- Responsive design

### Backend
- Node.js with Express
- OpenAI API integration
- CORS enabled
- Rate limiting
- Input validation

## Project Structure

```
/
├── frontend/                 # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           # Main component
│   │   ├── App.css          # Styling
│   │   └── index.js         # Entry point
│   └── package.json
├── backend/                  # Node.js API
│   ├── routes/
│   │   └── generate.js      # API endpoints
│   ├── utils/
│   │   ├── openai.js        # OpenAI integration
│   │   ├── moderation.js    # Content filtering
│   │   └── hashtags.js      # Hashtag utilities
│   ├── server.js            # Express server
│   ├── package.json
│   └── env.example          # Environment variables template
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST /api/generate
Generates LinkedIn posts based on input parameters.

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

## Deployment

### Backend Deployment (Heroku/Netlify Functions/Vercel)

1. **Heroku:**
   ```bash
   cd backend
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=your_api_key
   git push heroku main
   ```

2. **Vercel:**
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically

3. **Netlify Functions:**
   - Convert Express routes to Netlify functions
   - Set environment variables in Netlify dashboard

### Frontend Deployment

1. **Build the application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to any static hosting:**
   - Netlify (drag and drop build folder)
   - Vercel (connect repository)
   - GitHub Pages
   - AWS S3 + CloudFront

### Environment Variables

**Backend (.env):**
```
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=production
```

**Frontend (update API URL in production):**
- Update the proxy in `package.json` or API calls in `App.js` to point to your deployed backend URL

## Configuration

### Rate Limiting
Modify rate limiting in `backend/server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
});
```

### Content Moderation
The app uses a two-tier moderation system:
1. Regex-based filtering for common profanity
2. OpenAI moderation API for comprehensive content checking

To disable OpenAI moderation (faster, less comprehensive):
```javascript
// In backend/utils/moderation.js, comment out:
// return await checkProfanityOpenAI(text);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## Security

- API keys are stored in environment variables
- Input validation on all endpoints
- Rate limiting to prevent abuse
- Content moderation to ensure appropriate output
- CORS configured for security
