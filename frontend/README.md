# LinkedIn Post Generator - Frontend

React application for the LinkedIn Post Generator. This is the client-side application that provides the user interface for generating LinkedIn posts.

## Features

- Clean, modern UI with responsive design
- Form validation and error handling
- Loading states and user feedback
- Copy-to-clipboard functionality
- Professional styling with LinkedIn-inspired colors

## Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build

1. Build the application:
```bash
npm run build
```

2. The build folder will be created in `build/` directory

## Deployment Options

### Netlify (Recommended)

1. **Drag & Drop:**
   - Run `npm run build`
   - Drag the `build` folder to Netlify dashboard

2. **Git Integration:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### GitHub Pages

1. Add homepage to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name"
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

### AWS S3 + CloudFront

1. Upload build folder to S3 bucket
2. Configure CloudFront distribution
3. Set up custom domain (optional)

## Environment Configuration

### Development
The app uses a proxy configuration in `package.json` to forward API requests to the backend:
```json
{
  "proxy": "http://localhost:5000"
}
```

### Production
For production deployment, you need to update the API endpoint. You can:

1. **Set environment variable:**
   Create `.env` file:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

2. **Update App.js:**
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || '/api';
   const response = await fetch(`${API_URL}/generate`, {
     // ... rest of the code
   });
   ```

## Customization

### Styling
- Main styles are in `src/App.css`
- LinkedIn blue color: `#0077b5`
- Responsive breakpoints: 768px for mobile

### Adding Features
- New form fields can be added to the `formData` state in `App.js`
- Additional validation can be added to `handleSubmit`
- New UI components can be created as separate components

## Troubleshooting

### Common Issues

1. **API Connection Error:**
   - Check if backend is running
   - Verify proxy configuration
   - Check CORS settings on backend

2. **Build Errors:**
   - Clear node_modules and reinstall
   - Check for syntax errors
   - Verify all imports are correct

3. **Deployment Issues:**
   - Ensure build folder is generated
   - Check environment variables
   - Verify API endpoint configuration

## Performance

- Lazy loading for better performance
- Optimized bundle size
- Responsive images and assets
- Efficient state management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
