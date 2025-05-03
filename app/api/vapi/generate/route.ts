import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

export async function GET() {
    return Response.json({ success: true, data: 'THANK YOU' }, { status: 200 });
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();

    // Validate required fields
    if (!type || !role || !level || !techstack || !amount || !userid) {
        return Response.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    try {
        const prompt = `
Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]
Thank you!
    `.trim();

        const { text: responseText } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt,
        });

        // Try parsing the result safely
        let questions: string[];
        try {
            questions = JSON.parse(responseText);
            if (!Array.isArray(questions)) throw new Error('Questions is not an array');
        } catch (parseErr) {
            console.error('Failed to parse Gemini response:', responseText);
            throw new Error('Malformed AI response. Could not parse questions.');
        }

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(',').map((t: string) => t.trim()),
            questions,
            userID: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection('interviews').add(interview);

        return Response.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('Interview generation error:', error.message || error);
        return Response.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
