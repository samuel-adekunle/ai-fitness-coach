import { Box, Button, Heading, Stack, FormControl, FormHelperText, FormErrorMessage, Skeleton } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useUser } from '@auth0/nextjs-auth0/client';

function MealPlan({ plan }) {
  function Meal({ meal }) {
    return <Box>
      <ul>
        {
          Object.keys(meal).map((key) => <li key={key}>{key}: {meal[key]}</li>)
        }
      </ul>
    </Box>
  }

  function MealPlanDay({ dayPlan }) {
    return <Stack spacing='2'>
      <Heading size='sm' as='h4'>Day {dayPlan["Day"]}</Heading>
      <Stack spacing='2'>
        <Box>
          <Heading size='xs' as='h5'>Breakfast</Heading>
          <Meal meal={dayPlan["Breakfast"]} />
        </Box>
        <Box>
          <Heading size='xs' as='h5'>Lunch</Heading>
          <Meal meal={dayPlan["Lunch"]} />
        </Box>
        <Box>
          <Heading size='xs' as='h5'>Snack</Heading>
          <Meal meal={dayPlan["Snack"]} />
        </Box>
        <Box>
          <Heading size='xs' as='h5'>Dinner</Heading>
          <Meal meal={dayPlan["Dinner"]} />
        </Box>

      </Stack>
    </Stack>
  }

  return <Stack spacing='2'>
    <Heading size='md' as='h3'>Meal Plan</Heading>
    <Stack spacing='3'>
      {
        plan.map((dayPlan) => <MealPlanDay key={dayPlan["Day"]} dayPlan={dayPlan} />)
      }
    </Stack>
  </Stack>
}

export default function Plans() {
  const [plans, setPlans] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user: auth0User, isLoading } = useUser();

  const isVerified = auth0User?.email_verified ?? false;

  const onClickGeneratePlans = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/plans');
      if (!res.data.success) throw new Error(res.data.error);
      setPlans(JSON.parse(res.data.data));
    }
    catch (error) {
      console.log(error);
      window.alert('Failed to generate plans');
    }
    setIsGenerating(false);
  }

  return <Box>
    <Stack spacing='4'>
      <Box>
        <Heading size='lg' as='h2'>Personalised Plans</Heading>
      </Box>
      <Skeleton isLoaded={!isLoading}>
        <FormControl isInvalid={!isVerified}>
          <Stack>
            <Button
              colorScheme="blue" size="lg"
              isLoading={isGenerating}
              loadingText="Generating Plans..."
              onClick={onClickGeneratePlans}
              isDisabled={!isVerified}
            >
              Generate Plans
            </Button>
          </Stack>

          {
            isVerified
              ? <FormHelperText>Click the button to generate personalised workout and meal plans.</FormHelperText>
              : <FormErrorMessage>Please verify your email address to generate personalised plans.</FormErrorMessage>
          }
        </FormControl>
      </Skeleton>
      <Skeleton isLoaded={!isGenerating}>
        <Stack>
          {
            plans && <MealPlan plan={plans["Meal Plan"]} />
          }
          {/* TODO(samuel-adekunle): Create Workout Plan*/}
        </Stack>
      </Skeleton>
    </Stack>
  </Box>
}