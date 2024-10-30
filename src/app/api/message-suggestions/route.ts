import { OpenAI } from 'openai'; // Import OpenAI client
import { z } from 'zod';
import connectDB from "@/lib/dbConnect";

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Initialize OpenAI client with API key
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY, // Use the API key from environment variables
    });

    // Generate the object using OpenAI
    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are given a task to create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by "||". These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?|| If you could have dinner with any historical figure, who would it be?|| What’s a simple thing that makes you happy?' Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`,
        },
      ],
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message generated successfully',
        result: result.choices[0].message.content, // Extract the generated message
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
