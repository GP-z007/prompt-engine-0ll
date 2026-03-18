import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Your n8n webhook URL
    const n8nWebhookUrl = 'http://localhost:5678/webhook-test/a37d6591-3360-4969-9297-73c1e9c9b915'; 
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), 
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // The AI text answer from n8n is in the output property
    return NextResponse.json({ reply: data.output || "Response generated but output field was empty." });
    
  } catch (error) {
    console.error("n8n Connection Failed:", error);
    // Returning 503 triggers the red warning box on the frontend
    return NextResponse.json(
      { error: 'n8n is unreachable' }, 
      { status: 503 }
    );
  }
}
