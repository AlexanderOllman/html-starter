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

    const { imageData } = req.body;

    if (!imageData) {
        return res.status(400).json({ error: 'Image data is required' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        const base64Data = imageData.split(',')[1];
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Describe what you see in this image in 10 words or less. Focus on the main subject and key visual elements."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/png;base64,${base64Data}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 50
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenAI API Error:', errorData);
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const description = data.choices[0].message.content.trim();
        
        return res.status(200).json({ description });

    } catch (error) {
        console.error('Error describing image:', error);
        return res.status(500).json({ 
            error: 'Failed to describe image',
            description: "A beautiful captured moment transformed into art"
        });
    }
}
