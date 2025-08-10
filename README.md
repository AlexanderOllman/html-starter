# Ghibli Image Generator

Transform your photos into beautiful Studio Ghibli style illustrations using OpenAI's image generation APIs.

## Features

- 📷 **Webcam Capture**: Take photos directly from your camera
- 🎨 **Ghibli Style Transform**: Convert photos to Studio Ghibli aesthetic
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile
- ⚡ **Serverless**: Powered by Vercel serverless functions
- 🔒 **Secure**: API keys are stored server-side

## Deployment on Vercel

### 1. Set Up Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environment**: Select all (Production, Preview, Development)

### 2. Deploy

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### 3. Verify Deployment

1. Check that your environment variables are properly set
2. Test the camera functionality
3. Try generating a Ghibli-style image

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
vercel dev
```

Make sure to create a `.env.local` file with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## API Endpoints

The application uses three serverless functions:

- `/api/describe-image` - Gets a description of the captured image
- `/api/edit-image` - Transforms the image to Ghibli style
- `/api/variations` - Fallback using image variations

## Troubleshooting

### Environment Variable Issues

If your OpenAI API key isn't working:

1. **Verify the key is set correctly** in Vercel dashboard
2. **Redeploy your application** after setting environment variables
3. **Check the environment** (Production/Preview/Development)
4. **Clear build cache** in Vercel settings if needed

### Image Size Limits

- Images must be under 4MB
- Images are automatically converted to PNG format
- Large images are automatically rejected with an error message

## Technologies Used

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: OpenAI GPT-4o (vision), DALL-E 2 (image editing/variations)
- **Deployment**: Vercel

## License

MIT License