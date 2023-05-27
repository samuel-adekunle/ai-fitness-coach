import axios from 'axios';

const exampleResponse = JSON.stringify({
  "Meal Plan": [
    {
      "Day": "1",
      "Breakfast": { "Meal": "Scrambled eggs", "Protein": "20g", "Calories": "350", "Fats": "25g", "Carbs": "150g" },
      "Lunch": { "Meal": "Turkey wrap", "Protein": "25g", "Calories": "400", "Fats": "25g", "Carbs": "150g" },
      "Snack": { "Meal": "Greek yoghurt", "Protein": "15g", "Calories": "200", "Fats": "25g", "Carbs": "150g" },
      "Dinner": { "Meal": "Grilled salmon", "Protein": "30g", "Calories": "450", "Fats": "25g", "Carbs": "150g" }
    },
    { "Day": "2", "Breakfast": {}, "Lunch": {}, "Snack": {}, "Dinner": {} },
    { "Day": "3", "Breakfast": {}, "Lunch": {}, "Snack": {}, "Dinner": {} },
    { "Day": "4", "Breakfast": {}, "Lunch": {}, "Snack": {}, "Dinner": {} },
    { "Day": "5", "Breakfast": {}, "Lunch": {}, "Snack": {}, "Dinner": {} },
    { "Day": "6", "Breakfast": {}, "Lunch": {}, "Snack": {}, "Dinner": {} },
    { "Day": "7", "Breakfast": {}, "Lunch": {}, "Snack": {}, "Dinner": {} },
  ],
  "Workout Plan": [
    {
      "Day": "1",
      "Workout": "Strength training",
      "Exercises": [
        { "name": "Barbell Squat", "sets": "3", "reps": "10", "rest": "60s" },
      ]
    },
    { "Day": "2", "Workout": "", "Exercises": [] },
    { "Day": "3", "Workout": "", "Exercises": [] },
    { "Day": "4", "Workout": "", "Exercises": [] },
    { "Day": "5", "Workout": "", "Exercises": [] },
    { "Day": "6", "Workout": "", "Exercises": [] },
    { "Day": "7", "Workout": "", "Exercises": [] },
  ],
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
    .replace(/<example_response>/g, exampleResponse)
    .replace(/<user_details>/g, userDetails)
    .replace(/<user_goals>/g, userGoals)
};

export async function generatePlans(user) {
  const prompt = generatePrompt(user);
  const data = JSON.stringify({
    "model": process.env.OPENAI_MODEL,
    "prompt": prompt,
    "temperature": Number(process.env.OPENAI_TEMPERATURE),
    "max_tokens": Number(process.env.OPENAI_MAX_TOKENS) - prompt.length,
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
