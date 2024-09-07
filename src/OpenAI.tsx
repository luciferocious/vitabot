import axios from 'axios';
import {OPENAI_APIKEY} from './ENV';
import React from 'react';

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions',
});

export const getChatReply = async (message: string): Promise<string> => {
  const apiKey = OPENAI_APIKEY;

  const instructions = `Limit responses to basic diagnostics, general health tips, and blood chemistry results. 
  Explain briefly. For other topics, remind users you're restricted to basic health advice and blood chemistry explanations. 
  Always advise seeking professional guidance. 
  When asked about another blood chemistry results, compare them to indicate improvement or worsening.`;

  const prompt = `${instructions}\n \n ${message}`;

  const data = {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    messages: [{role: 'user', content: prompt}],
  };

  try {
    const response = await openai.post('', data, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    let reply = response.data.choices[0].message.content.trim();

    if (message.toLowerCase().includes('health')) {
      reply +=
        '\n\nPlease remember to consult with a healthcare professional for accurate information.';
    }

    return reply;
  } catch (error) {
    console.error('Error fetching AI reply:', error);
    return 'Error fetching AI reply.';
  }
};
