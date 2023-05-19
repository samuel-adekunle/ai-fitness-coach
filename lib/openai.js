import axios from 'axios';

const exampleResponse = JSON.stringify({
  "Meal Plan": [
    {
      "Day": "1",
      "Breakfast": {"Meal": "Scrambled eggs", "Protein": "20g", "Calories": "350", "Fats": "25g", "Carbs": "150g"},
      "Lunch": {"Meal": "Turkey wrap", "Protein": "25g", "Calories": "400", "Fats": "25g", "Carbs": "150g"},
      "Snack": {"Meal": "Greek yoghurt", "Protein": "15g", "Calories": "200", "Fats": "25g", "Carbs": "150g"},
      "Dinner": {"Meal": "Grilled salmon", "Protein": "30g", "Calories": "450", "Fats": "25g", "Carbs": "150g"}
    },
  ]
});

const generatePrompt = (user) => {
  const userDetails = JSON.stringify({
    age: user.age,
    weight: user.weight,
    height: user.height,
    sex: user.sex,
    activityLevel: user.activityLevel,
  })
  const userGoals = JSON.stringify(user.goals);
  return process.env.OPENAI_PROMPT_TEMPLATE
    .replace(/<user_details>/g, userDetails)
    .replace(/<user_goals>/g, userGoals)
    .replace(/<example_response>/g, exampleResponse);
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
