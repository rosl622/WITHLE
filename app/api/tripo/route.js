import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const apiKey = process.env.TRIPO_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server Config Error: TRIPO_API_KEY missing' },
                { status: 500 }
            );
        }

        const { action, payload } = await request.json();
        let result;

        if (action === 'upload') {
            // Step 1: Upload file to Tripo
            // Payload: { filename, content (base64), type }
            const { filename, content, type } = payload;

            // Convert Base64 to Blob/Buffer
            const buffer = Buffer.from(content, 'base64');
            const blob = new Blob([buffer], { type: `image/${type === 'jpg' ? 'jpeg' : type}` });

            const formData = new FormData();
            formData.append('file', blob, filename);

            const uploadRes = await fetch('https://api.tripo3d.ai/v2/openapi/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    // fetch with FormData automatically sets Content-Type with boundary
                },
                body: formData
            });

            result = await uploadRes.json();

            if (result.code !== 0) throw new Error('Tripo Upload Failed: ' + JSON.stringify(result));

        } else if (action === 'create_task') {
            // Step 2: Create Generation Task
            // Payload: { file_token }
            const createRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'image_to_model',
                    file: {
                        type: 'jpg', // Defaulting to jpg or utilize payload info if needed
                        file_token: payload.file_token
                    }
                })
            });
            result = await createRes.json();
            if (result.code !== 0) throw new Error('Tripo Task Create Failed: ' + JSON.stringify(result));

        } else if (action === 'get_task') {
            // Step 3: Check Status
            // Payload: { task_id }
            const taskRes = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${payload.task_id}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            result = await taskRes.json();
        } else {
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Tripo API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
