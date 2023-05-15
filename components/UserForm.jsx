import useMe from '@/hooks/useMe';
import {
  Box, Button, ButtonGroup,
  FormControl, FormErrorMessage, FormHelperText, FormLabel,
  Input,
  NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Skeleton, Stack
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MIN_AGE = 0;
const MAX_AGE = 150;
const MIN_WEIGHT = 0;
const MAX_WEIGHT = 1000;
const MIN_HEIGHT = 0;
const MAX_HEIGHT = 500;

export default function UserForm() {
  const router = useRouter();
  const { me, isLoading, isError, mutate } = useMe();
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (me) {
      setEmail(me.email);
      setAge(me.age);
      setWeight(me.weight);
      setHeight(me.height);
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


  const onClickReset = (e) => {
    e.preventDefault();
    setAge(me.age);
    setWeight(me.weight);
    setHeight(me.height);
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
    <Skeleton isLoaded={!isLoading}>
      <Stack spacing='4'>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type='email' isReadOnly value={email} />
          <FormHelperText>We will never share your email.</FormHelperText>
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
              isDisabled={!isAgeValid() || !isWeightValid() || !isHeightValid()}
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
  </Box>
}