import OpenAI from 'openai';
import { Film } from '@/types/film';

export const aiOverview = {
  async generateOverview(film: Film): Promise<string> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://genai.rcac.purdue.edu/api", 
    });

    try {
      const prompt = `Generate a compelling and concise 2-3 sentence overview for the following film. Include a breakdown of the specifications included in the api:

Title: ${film.title}
Year: ${film.year}
Director: ${film.director}
Description: ${film.description || 'No description provided'}
Rating: ${film.rating ? `${film.rating}/10` : 'No rating'}

Create an engaging overview that captures the essence of the film.`;

      const message = await openai.chat.completions.create({
        model: 'gpt-oss:120b',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.choices[0]?.message?.content || 'Unable to generate overview';

    } catch (error) {
      console.error('Error generating overview:', error);
      throw error;
    }
  },
};