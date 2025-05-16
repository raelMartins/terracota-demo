import {Box, Flex, Link, Stack, Text, useToast} from '@chakra-ui/react';
import {Button, FormInput} from '@/ui-lib';
import {AttemptLogin, storeDetails} from '@/api/auth';
import {useMutation, useQuery} from 'react-query';
import {store_name} from '@/constants/routes';
import {useFormik} from 'formik';

const GetStarted = ({setPage, setEmail, ...rest}) => {
  const toast = useToast();
  const STOREINFO = useQuery(['storeInfo'], storeDetails);

  const agentActive =
    STOREINFO?.data?.data?.data?.agent_active && STOREINFO?.data?.data?.data?.agent_status;

  const validateForm = values => {
    const errors = {};

    if (!values.email) errors.email = 'Please enter the email address';
    else if (!values.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      errors.email = 'Please enter valid email address';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: values => {
      mutate({
        email: values?.email,
        store_name: store_name(),
      });
    },
    validateOnChange: true,
    validate: validateForm,
  });

  const {mutate, isLoading} = useMutation(formData => AttemptLogin(formData), {
    onSuccess: res => {
      if (
        res?.response?.data?.action == 'signup' ||
        res?.response?.data?.action == 'not_customer'
      ) {
        setPage('register');
        setEmail(formik.values.email);
      } else if (res?.data?.action == 'login') {
        setPage('successLink');
        setEmail(formik.values.email);
      } else {
        return toast({
          title: `Oops...`,
          description: `${
            res?.response?.data?.message ??
            res?.response?.message ??
            res?.message ??
            'Something went wrong,we are working to resolve it'
          }`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
    onError: err => {
      const data = err?.response?.data;
      if (data?.action == 'signup' || data?.action == 'not_customer') {
        setPage('register');
        setEmail(formik.values.email);
      } else if (data?.action == 'login') {
        setPage('successLink');
        setEmail(formik.values.email);
      } else {
        return toast({
          title: `Oops...`,
          description: `${data?.message || 'Something went wrong,we are working to resolve it'}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    },
  });

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
      <Flex h="full" direction="column" justify={'center'} align="center">
        <Text fontSize={'23px'} fontWeight={600} color="text" className="heading-text-regular">
          Get Started
        </Text>
        <Stack
          w={`100%`}
          gap={{base: `24px`, md: `16px`}}
          mt={`8px`}
          textAlign={`center`}
          align={`center`}
        >
          <Text color="matador_text.500" fontSize={{base: '13px', lg: '16px'}} lineHeight={`140%`}>
            Enter your email address
          </Text>
          <FormInput
            type="email"
            name="email"
            id="email"
            lable={'Email address'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
            placeholder="Email Address"
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
            onClick={formik.handleSubmit}
            isLoading={isLoading}
            p="26px"
          >
            <Text lineHeight={'28px'} fontWeight={'500'} fontSize={'18px'}>
              Proceed
            </Text>
          </Button>
          {agentActive && (
            <Link href="/agents" fontSize={`16px`} lineHeight={`22px`}>
              Sign in as Realtor
            </Link>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default GetStarted;
