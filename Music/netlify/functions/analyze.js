// netlify/functions/analyze.js

export async function handler(event) {

    // Allow only POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: "Method Not Allowed"
            })
        };
    }

    try {

        const { prompt } = JSON.parse(event.body);

        if (!prompt || prompt.trim() === "") {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "No input provided."
                })
            };
        }

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
You are CyberGuard AI, an expert cybersecurity analyst.

Analyze the user's input.

Return ONLY in this format:

Threat Level: (Safe / Low / Medium / High / Critical)

Risk Score: (0-100)

Summary:

Indicators Found:
- Bullet
- Bullet

Recommendations:
- Bullet
- Bullet

User Input:
${prompt}
                                    `
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await geminiResponse.json();

        if (!data.candidates) {

            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Gemini returned an unexpected response.",
                    details: data
                })
            };

        }

        const result =
            data.candidates[0].content.parts[0].text;

        return {

            statusCode: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                result
            })

        };

    }

    catch (err) {

        console.error(err);

        return {

            statusCode: 500,

            body: JSON.stringify({

                error: "Internal Server Error",
                message: err.message

            })

        };

    }

}