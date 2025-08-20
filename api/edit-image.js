export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { imageData, prompt } = req.body;

    if (!imageData || !prompt) {
        return res.status(400).json({ error: 'Image data and prompt are required' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        // Convert base64 to blob
        const base64Data = imageData.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // Check image size (must be < 4MB)
        if (imageBuffer.length > 4 * 1024 * 1024) {
            throw new Error('Image too large. Must be less than 4MB.');
        }

        // Create FormData for the API call
        const FormData = require('form-data');
        const formData = new FormData();
        
        formData.append('model', 'dall-e-2');
        formData.append('image', imageBuffer, {
            filename: 'input.png',
            contentType: 'image/png'
        });
        formData.append('prompt', prompt);
        formData.append('n', '1');
        formData.append('size', '1024x1024');
        formData.append('response_format', 'b64_json');

        const response = await fetch('https://api.openai.com/v1/images/edits', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API Error:', errorData);
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const imageBase64 = data.data[0].b64_json;
        
        return res.status(200).json({ 
            imageBase64: `data:image/png;base64,${imageBase64}` 
        });

    } catch (error) {
        console.error('Error editing image:', error);
        return res.status(500).json({ 
            error: 'Failed to edit image',
            message: error.message
        });
    }
}
