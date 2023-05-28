import axios from 'axios';

const exampleMealPlan = JSON.stringify([
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
]);

const exampleWorkoutPlan = JSON.stringify([
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
]);


const generatePrompt = (promptTemplate, exampleResponse, user) => {
  const userDetails = JSON.stringify({
    age: user.age,
    weight: user.weight,
    height: user.height,
    sex: user.sex,
    activityLevel: user.activityLevel,
  })
  const userGoals = JSON.stringify(user.goals);
  return promptTemplate
    .replace(/<example_response>/g, exampleResponse)
    .replace(/<user_details>/g, userDetails)
    .replace(/<user_goals>/g, userGoals)
};

async function generatePlan(prompt) {
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

export async function generateWorkoutPlan(user) {
  const prompt = generatePrompt(process.env.WORKOUT_PROMPT_TEMPLATE, exampleWorkoutPlan, user);
  return await generatePlan(prompt);
}

export async function generateMealPlan(user) {
  const prompt = generatePrompt(process.env.MEAL_PROMPT_TEMPLATE, exampleMealPlan, user);
  return await generatePlan(prompt);
}
