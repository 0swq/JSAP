// @ts-nocheck
export const iaServicio = {
    async completar(sistema: string, texto: string): Promise<string> {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        console.log('[IA] DEEPSEEK_API_KEY configurada:', !!apiKey, `(${apiKey ? apiKey.substring(0, 6) + '...' : 'FALTA'})`);

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: sistema },
                    { role: 'user', content: texto },
                ],
            }),
        });

        console.log('[IA] Status:', response.status, response.statusText);

        const raw = await response.text();
        console.log('[IA] Respuesta cruda (primeros 300 chars):', raw.substring(0, 300));

        if (!response.ok) {
            throw new Error(`DeepSeek API error ${response.status}: ${raw.substring(0, 200)}`);
        }

        const data = JSON.parse(raw);
        if (!data.choices?.[0]?.message?.content) {
            console.log('[IA] Estructura inesperada:', JSON.stringify(Object.keys(data)));
            throw new Error('DeepSeek response sin choices[0].message.content');
        }

        return data.choices[0].message.content;
    },
};