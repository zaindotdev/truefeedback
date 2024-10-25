import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { OpenAIError } from 'openai';
import { z } from 'zod';
import connectDB from "@/lib/dbConnect"

export async function POST() {
  connectDB();
  try {
    const result = await generateObject({
      model: openai('gpt-3.5-turbo', {
        structuredOutputs: true,
      }),
      schemaName: 'Messages',
      schemaDescription: 'Message schema',
      schema: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          })
        ),
        steps: z.array(z.string()),
      }),
      prompt: `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by "||". These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?|| If you could have dinner with any historical figure, who would it be?|| What’s a simple thing that makes you happy?' Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message generated successfully',
        result,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return Response.json({
        success: false,
        message: error.message,
      }, {
        status: 500,
      });
    }

  }
}
