import React, {useState} from 'react';
import {Box, Flex, HStack, PinInput, PinInputField, Stack, Text, useToast} from '@chakra-ui/react';
import {Button, FormInput} from '@/ui-lib/ui-lib.components';
import {loginWithOTP, requestOTPforEmailVerification, verifyMagicToken} from '@/api/auth';
import {useMutation, useQuery} from 'react-query';

import {deleteCookies, setSession} from '@/utils/sessionmanagers';
import {getSettingsData} from '@/api/Settings';

export const OTPLogin = ({
  email,
  setEmail,
  setPage,
  directLogin,
  listing,
  unit,
  nextStep = () => {},
  ...rest
}) => {
  const toast = useToast();
  const [emailOTP, setEmailOTP] = useState(``);
  const [token, setToken] = useState(``);
  const [otpSent, setOTPSent] = useState(false);

  const profileQuery = useQuery(
    ['getSettingsData', token],
    () => getSettingsData({profile: true}),
    {
      onSuccess: res => {
        console.log({res});

        const user_data = res.data?.data;

        const obj = {
          avatar: user_data?.avatar,
          first_name: user_data?.first_name,
          middle_name: user_data?.middle_name,
          last_name: user_data?.last_name,
          id: user_data?.id,
          email: user_data?.email,
          date_of_birth: user_data?.date_of_birth,
          customer_ref: user_data?.customer_ref,
          user: {id: user_data?.user?.id},
        };
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        setSession(obj, 'loggedIn', expires);
        nextStep();
      },
      onError: err => {
        console.log(err);
      },
      enabled: Boolean(token) && Boolean(directLogin),
    }
  );

  const {mutate: request_mutation, isLoading: request_loading} = useMutation(
    formData => requestOTPforEmailVerification(formData),
    {
      onSuccess: res => {
        setOTPSent(true);
      },
      onError: err => {
        return toast({
          title: `Oops...`,
          description: `${err?.message || 'Something went wrong,we are working to resolve it'}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      },
    }
  );

  const {mutate: confirm_otp_mutation, isLoading: confirm_otp_loading} = useMutation(
    formData => loginWithOTP(formData),
    {
      onSuccess: res => {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const my_token = res?.data?.token;

        setSession(my_token, 'token', expires);
        setTimeout(() => {
          setToken(my_token);
        }, 1000);
      },
      onError: err => {
        console.log({error: err?.response});
        if (err?.response?.status === 404) {
          console.log(`No customer`);
          setPage('register');
        } else {
          return toast({
            title: `Oops...`,
            description: `${err?.message || 'Something went wrong,we are working to resolve it'}`,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
      },
    }
  );

  const requestOTP = () => {
    const payload = {
      email,
      verify: true,
    };

    request_mutation(payload);
  };
  const continueWithOTP = () => {
    const payload = {
      code: emailOTP,
      unit_id: unit?.id,
      email,
    };
    confirm_otp_mutation(payload);
  };

  const inputStyles = {
    fontSize: '28px',
    color: 'text',
    fontWeight: '400',
    border: '1px solid',
    borderColor: `matador_border_color.100 !important`,
    background: `matador_background.100`,
    borderRadius: '12px',
    w: {base: '48px'},
    h: {base: '48px'},
    textAlign: 'center',
    _focusVisible: {
      outline: 'none',
    },
    _placeholder: {
      opacity: '.24',
      color: `text`,
    },
    lineHeight: `130%`,
    letterSpacing: `0%`,
  };

  return (
    <Box
      maxW="440px"
      w={{base: `100%`, lg: `440px`}}
      bg="matador_background.200"
      color={`text`}
      maxH={'358px'}
      px={{base: `24px`, md: '40px'}}
      py="32px"
      borderRadius={5}
      {...rest}
      boxShadow={'0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)'}
    >
      {!otpSent ? (
        <Flex h="full" direction="column" justify={'center'} align="center">
          <Text fontSize={'23px'} fontWeight={600} color="text" className="heading-text-regular">
            Enter Email Address
          </Text>
          <Stack
            w={`100%`}
            gap={{base: `24px`, md: `16px`}}
            mt={`8px`}
            textAlign={`center`}
            align={`center`}
          >
            <FormInput
              type="email"
              name="email"
              id="email"
              lable={'Email address'}
              onChange={e => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email Address"
              _placeholder={{fontSize: '13px'}}
              fontSize="16px"
              padding={{base: `12px 14px`, md: '14px 15px'}}
              height="100%"
              lineHeight="140%"
              bg={`matador_background.100`}
            />
            <Button
              type="submit"
              color="custom_color.contrast"
              bg="custom_color.color"
              w="full"
              fontSize={'18px'}
              onClick={requestOTP}
              isLoading={request_loading}
              p="26px"
            >
              <Text lineHeight={'28px'} fontWeight={'500'} fontSize={'18px'}>
                Proceed
              </Text>
            </Button>
          </Stack>
        </Flex>
      ) : (
        <Flex h="full" direction="column" justify={'center'} align="center">
          <Text fontSize={'23px'} fontWeight={600} color="text" className="heading-text-regular">
            Enter OTP
          </Text>
          <Stack
            w={`100%`}
            gap={{base: `24px`, md: `16px`}}
            mt={`8px`}
            textAlign={`center`}
            align={`center`}
          >
            <Text
              color="matador_text.500"
              // mt="8px"
              fontSize={{base: '13px', lg: '16px'}}
              lineHeight={`140%`}
              textAlign={`center`}
            >
              Please enter the verification code we sent to {email}
            </Text>
            <HStack spacing="10px">
              <PinInput value={emailOTP} onChange={value => setEmailOTP(value)} placeholder="0">
                <PinInputField {...inputStyles} />
                <PinInputField {...inputStyles} />
                <PinInputField {...inputStyles} />
                <PinInputField {...inputStyles} />
                <PinInputField {...inputStyles} />
                <PinInputField {...inputStyles} />
              </PinInput>
            </HStack>
            <Button
              type="submit"
              color="custom_color.contrast"
              bg="custom_color.color"
              w="full"
              fontSize={'18px'}
              onClick={continueWithOTP}
              isLoading={confirm_otp_loading || profileQuery?.isLoading}
              // isLoading={loading}
              p="26px"
            >
              <Text lineHeight={'28px'} fontWeight={'500'} fontSize={'18px'}>
                Proceed
              </Text>
            </Button>
            <Text color={`custom_color.color_pop`} onClick={() => setOTPSent(false)}>
              Change Email
            </Text>
          </Stack>
        </Flex>
      )}
    </Box>
  );
};
