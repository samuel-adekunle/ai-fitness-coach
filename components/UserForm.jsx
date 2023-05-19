import useMe from '@/hooks/useMe';
import {
  Box, Button, ButtonGroup,
  FormControl, FormErrorMessage, FormHelperText, FormLabel,
  Heading,
  Input,
  NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Skeleton, Stack,
  Switch
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const MIN_AGE = 0;
const MAX_AGE = 150;
const MIN_WEIGHT = 0;
const MAX_WEIGHT = 1000;
const MIN_HEIGHT = 0;
const MAX_HEIGHT = 500;
const SEXES = ["Male", "Female"]
const ACTIVITY_LEVELS = {
  "Sedentary": {
    "label": "Sedentary",
    "description": "Little to no exercise"
  },
  "Lightly Active": {
    "label": "Lightly Active",
    "description": "Light exercise (1–3 days per week)"
  },
  "Moderately Active": {
    "label": "Moderately Active",
    "description": "Moderate exercise (3–5 days per week)"
  },
  "Very Active": {
    "label": "Very Active",
    "description": "Heavy exercise (6–7 days per week)"
  },
}
const GOALS = {
  "Lose Weight": {
    "goal": "Lose Weight",
    "active": false,
  },
  "Maintain Weight": {
    "goal": "Maintain Weight",
    "active": false,
  },
  "Gain Weight": {
    "goal": "Gain Weight",
    "active": false,
  },
  "Gain Muscle": {
    "goal": "Gain Muscle",
    "active": false,
  },
  "Modify My Diet": {
    "goal": "Modify My Diet",
    "active": false,
  },
  "Manage Stress": {
    "goal": "Manage Stress",
    "active": false,
  },
  "Improve Sleep": {
    "goal": "Improve Sleep",
    "active": false,
  },
  "Increase Energy": {
    "goal": "Increase Energy",
    "active": false,
  },
}

export default function UserForm() {
  const router = useRouter();
  const { me, isLoading, mutate } = useMe();
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [sex, setSex] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goals, setGoals] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (me) {
      console.log(me);
      setEmail(me.email);
      setAge(me.age);
      setWeight(me.weight);
      setHeight(me.height);
      setSex(me.sex);
      setActivityLevel(me.activityLevel);
      setGoals(me.goals);
    }
  }, [me]);

  const isAgeValid = () => age > 0;
  const onChangeAge = (valueAsNumber) => {
    setAge(valueAsNumber);
  }

  const isWeightValid = () => weight > 0;
  const onChangeWeight = (valueAsNumber) => {
    setWeight(valueAsNumber);
  }

  const isHeightValid = () => height > 0;
  const onChangeHeight = (valueAsNumber) => {
    setHeight(valueAsNumber);
  }

  const isSexValid = () => SEXES.includes(sex)
  const onChangeSex = (value) => {
    setSex(value);
  }

  const isActivityLevelValid = () => Object.keys(ACTIVITY_LEVELS).includes(activityLevel);
  const onChangeActivityLevel = (e) => {
    e.preventDefault();
    setActivityLevel(e.target.value);
  }

  const onChangeGoal = (e) => {
    e.preventDefault();
    const goal = e.target.id;
    const active = e.target.checked;
    const isGoalActive = goals.includes(goal);
    if (active && !isGoalActive) {
      setGoals([...goals, goal]);
    }
    else if (!active && isGoalActive) {
      setGoals(goals.filter(g => g !== goal));
    }
  }

  const onClickReset = (e) => {
    e.preventDefault();
    setAge(me.age);
    setWeight(me.weight);
    setHeight(me.height);
    setSex(me.sex);
    setActivityLevel(me.activityLevel);
    setGoals(me.goals);
  }

  const onClickSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    let updatedUser = null;
    try {
      const res = await axios.put('/api/me', {
        age,
        weight,
        height,
        sex,
        activityLevel,
        goals,
      })
      if (!res.data.success) throw new Error(res.data.error);
      updatedUser = res.data.data;
    }
    catch (error) {
      console.log(error);
      window.alert('Failed to save user information');
    }

    if (updatedUser) {
      mutate(updatedUser);
    }

    setIsSaving(false);
  }

  const onClickSignOut = (e) => {
    e.preventDefault();
    router.push('/api/auth/logout');
  }

  return <Box>
    <Stack spacing='4'>
      <Box>
        <Heading size='lg' as='h2'>User Information</Heading>
      </Box>
      <Skeleton isLoaded={!isLoading}>
        <Stack spacing='4'>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input type='email' isReadOnly value={email} />
            <FormHelperText>We will never share your email.</FormHelperText>
          </FormControl>
          <FormControl isRequired isInvalid={!isSexValid()}>
            <FormLabel>Sex</FormLabel>
            <RadioGroup onChange={onChangeSex} value={sex}>
              <Stack direction='row'>
                {SEXES.map(_sex => <Radio key={_sex} value={_sex}>{_sex}</Radio>)}
              </Stack>
            </RadioGroup>
            {
              isSexValid()
                ? <FormHelperText>Which sex should be used to calculate your calorie needs?</FormHelperText>
                : <FormErrorMessage>Sex is required.</FormErrorMessage>
            }
          </FormControl>
          <FormControl isRequired isInvalid={!isAgeValid()}>
            <FormLabel>Age</FormLabel>
            <NumberInput value={age} min={MIN_AGE} max={MAX_AGE} onChange={onChangeAge}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {
              isAgeValid()
                ? <FormHelperText>How old are you?</FormHelperText>
                : <FormErrorMessage>Age must be greater than 0</FormErrorMessage>
            }

          </FormControl>
          <FormControl isRequired isInvalid={!isWeightValid()}>
            <FormLabel>Weight (kg)</FormLabel>
            <NumberInput value={weight} min={MIN_WEIGHT} max={MAX_WEIGHT} onChange={onChangeWeight}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {
              isWeightValid()
                ? <FormHelperText>How much do you weigh?</FormHelperText>
                : <FormErrorMessage>Weight must be greater than 0</FormErrorMessage>
            }
          </FormControl>
          <FormControl isRequired isInvalid={!isHeightValid()}>
            <FormLabel>Height (cm)</FormLabel>
            <NumberInput value={height} min={MIN_HEIGHT} max={MAX_HEIGHT} onChange={onChangeHeight}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {
              isHeightValid()
                ? <FormHelperText>How tall are you?</FormHelperText>
                : <FormErrorMessage>Height must be greater than 0</FormErrorMessage>
            }
          </FormControl>
          <FormControl isRequired isInvalid={!isActivityLevelValid()}>
            <FormLabel>Activity Level</FormLabel>
            <Select value={activityLevel} onChange={onChangeActivityLevel} placeholder="What is your baseline activity level?">
              {Object.keys(ACTIVITY_LEVELS).map(level => <option key={level} value={level}>{`${level}: ${ACTIVITY_LEVELS[level].description}`}</option>)}
            </Select>
          </FormControl>
          <FormControl as={SimpleGrid} columns={{ base: 6 }}>
            {Object.keys(GOALS).map(goal => <Fragment key={goal}>
              <FormLabel htmlFor={goal}>{goal}</FormLabel>
              <Switch id={goal} onChange={onChangeGoal} isChecked={goals.includes(goal)}/>
            </Fragment>)}
          </FormControl>
          <FormControl textAlign='center'>
            <Stack spacing='2'>
              <Button
                colorScheme='gray'
                onClick={onClickReset}
              >
                Reset Changes
              </Button>
              <Button
                colorScheme='teal'
                isDisabled={!isAgeValid() || !isWeightValid() || !isHeightValid() || !isSexValid() || !isActivityLevelValid()}
                loadingText='Saving...'
                isLoading={isSaving}
                onClick={onClickSave}
              >
                Save Changes
              </Button>
              <Button
                colorScheme='red'
                onClick={onClickSignOut}
              >
                Sign Out
              </Button>
            </Stack>
          </FormControl>
        </Stack>
      </Skeleton>
    </Stack>
  </Box>
}