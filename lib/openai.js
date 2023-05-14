import axios from 'axios';

const generatePrompt = (user) => {
  return process.env.OPENAI_PROMPT_TEMPLATE
    .replace(/<age>/g, user.age)
    .replace(/<weight>/g, user.weight)
    .replace(/<height>/g, user.height)
};

export async function generatePlans(user) {
  const data = JSON.stringify({
    "model": process.env.OPENAI_MODEL,
    "prompt": generatePrompt(user),
    "temperature": Number(process.env.OPENAI_TEMPERATURE),
    "max_tokens": Number(process.env.OPENAI_MAX_TOKENS),
  });

  const config = {
    method: 'post',
    url: process.env.OPENAI_URL,
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    data: data,
  }

  const res = await axios.request(config);
  return res.data.choices[0].text;
}
