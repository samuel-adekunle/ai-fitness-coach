import { useUser } from '@auth0/nextjs-auth0/client';
import { Box, Button, FormControl, FormErrorMessage, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

function MealPlan({ plan }) {
  function Meal({ meal }) {
    return <Box>
      <ul>
        {
          Object.keys(meal)?.map((key) => <li key={key}>{key}: {meal[key]}</li>)
        }
      </ul>
    </Box>
  }

  function MealPlanDay({ dayPlan }) {
    return <Stack spacing='2'>
      <Heading size='sm' as='h3'>Day {dayPlan["Day"]}</Heading>
      <Stack spacing='2'>
        <Box>
          <Heading size='xs' as='h4'>Breakfast</Heading>
          <Meal meal={dayPlan["Breakfast"]} />
        </Box>
        <Box>
          <Heading size='xs' as='h4'>Lunch</Heading>
          <Meal meal={dayPlan["Lunch"]} />
        </Box>
        <Box>
          <Heading size='xs' as='h4'>Snack</Heading>
          <Meal meal={dayPlan["Snack"]} />
        </Box>
        <Box>
          <Heading size='xs' as='h4'>Dinner</Heading>
          <Meal meal={dayPlan["Dinner"]} />
        </Box>
      </Stack>
    </Stack>
  }

  return <Stack spacing='2'>
    {
      plan?.map((dayPlan) => <MealPlanDay key={dayPlan["Day"]} dayPlan={dayPlan} />)
    }
  </Stack>
}

function WorkoutPlan({ plan }) {
  function Exercise({ exercise }) {
    return <Box>
      <Stack spacing='2'>
        <Heading size='xs' as='h4'>{exercise["name"]}</Heading>
        <ul>
          <li>Sets: {exercise["sets"]}</li>
          <li>Reps: {exercise["reps"]}</li>
          <li>Rest: {exercise["rest"]}</li>
        </ul>
      </Stack>
    </Box>
  }

  function WorkoutPlanDay({ dayPlan }) {
    return <Stack spacing='2'>
      <Heading size='sm' as='h3'>Day {dayPlan["Day"]} - {dayPlan["Workout"]} </Heading>
      <Stack spacing='2'>
        {
          dayPlan["Exercises"]?.map((exercise) => <Exercise key={exercise["name"]} exercise={exercise} />)
        }
      </Stack>
    </Stack>
  }

  return <Stack spacing='2'>
    {
      plan?.map((dayPlan) => <WorkoutPlanDay key={dayPlan["Day"]} dayPlan={dayPlan} />)
    }
  </Stack>
}

export default function Plans() {
  const [mealPlan, setMealPlan] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [isGeneratingWorkoutPlan, setIsGeneratingWorkoutPlan] = useState(false);
  const { user: auth0User } = useUser();

  const isVerified = auth0User?.email_verified ?? false;

  const onClickGenerateMealPlan = async (e) => {
    e.preventDefault();
    setIsGeneratingMealPlan(true);
    try {
      const res = await axios.post('/api/mealPlan');
      if (!res.data.success) throw new Error(res.data.error);
      setMealPlan(JSON.parse(res.data.data));
    }
    catch (error) {
      console.log(error);
      window.alert('Failed to generate meal plan.');
    }
    setIsGeneratingMealPlan(false);
  }

  const onClickGenerateWorkoutPlan = async (e) => {
    e.preventDefault();
    setIsGeneratingWorkoutPlan(true);
    try {
      const res = await axios.post('/api/workoutPlan');
      if (!res.data.success) throw new Error(res.data.error);
      setWorkoutPlan(JSON.parse(res.data.data));
    }
    catch (error) {
      console.log(error);
      window.alert('Failed to generate workout plan.');
    }
    setIsGeneratingWorkoutPlan(false);
  }

  return <Stack spacing='4'>
    <Stack spacing='3'>
      <Box>
        <Heading size='lg' as='h2'>Meal Plan</Heading>
      </Box>
      <MealPlan plan={mealPlan} />
      <Stack spacing='3'>
        <FormControl isInvalid={!isVerified}>
          <Stack spacing='2'>
            <Button
              colorScheme="blue" size="md"
              isLoading={isGeneratingMealPlan}
              loadingText="Generating Meal Plan..."
              onClick={onClickGenerateMealPlan}
              isDisabled={!isVerified}
            >
              Generate Meal Plan
            </Button>
            <Button
              colorScheme="teal" size="md"
            >
              Save Meal Plan
            </Button>
          </Stack>
          {
            !isVerified && <FormErrorMessage>Please verify your email address to generate personalised plans.</FormErrorMessage>
          }
        </FormControl>
      </Stack>
    </Stack>
    <Stack spacing='3'>
      <Box>
        <Heading size='lg' as='h2'>Workout Plan</Heading>
      </Box>
      <WorkoutPlan plan={workoutPlan} />
      <Stack spacing='3'>
        <FormControl isInvalid={!isVerified}>
          <Stack>
            <Button
              colorScheme="blue" size="md"
              isLoading={isGeneratingWorkoutPlan}
              loadingText="Generating Workout Plan..."
              onClick={onClickGenerateWorkoutPlan}
              isDisabled={!isVerified}
            >
              Generate Workout Plan
            </Button>
            <Button
              colorScheme="teal" size="md"
            >
              Save Workout Plan
            </Button>
          </Stack>
          {
            !isVerified && <FormErrorMessage>Please verify your email address to generate personalised plans.</FormErrorMessage>
          }
        </FormControl>
      </Stack>
    </Stack>
  </Stack>
}