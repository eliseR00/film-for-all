import { OpenAI } from 'openai';
import { Film } from '@/types/film';

export const aiOverview = {
  async generateOverview(film: Film): Promise<string> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const prompt = `Generate a compelling and concise 2-3 sentence overview for the following film:
      
Title: ${film.title}
Year: ${film.year}
Director: ${film.director}
Description: ${film.description || 'No description provided'}
Rating: ${film.rating ? `${film.rating}/10` : 'No rating'}

Create an engaging overview that captures the essence of the film.`;

      const message = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.choices[0].message.content;
      if (content) {
        return content;
      }

      return 'Unable to generate overview';
    } catch (error) {
      console.error('Error generating overview:', error);
      throw error;
    }
  },
};
