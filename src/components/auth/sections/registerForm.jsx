import React, {useState} from 'react';
import {Box, Flex, Stack, Text, useToast} from '@chakra-ui/react';
import {Button, Checkbox2, FormInput, PhoneInput, TitleInput} from '@/ui-lib';
import {themeStyles} from '@/theme';
import {useMutation, useQuery} from 'react-query';
import {AttemptLogin, registerUser, storeDetails} from '@/api/auth';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {store_name} from '@/constants/routes';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {setSession} from '@/utils/sessionmanagers';
import {getSettingsData} from '@/api/Settings';

const formSchema = Yup.object().shape({
  first_name: Yup.string().required('Please enter your First Name'),
  last_name: Yup.string().required('Please enter your Last Name'),
  phone: Yup.string()
    .min(5, 'Please enter a valid phone number')
    .max(15, 'Please enter a valid phone number')
    // .matches(
    //   /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[456789]\d{9}|(\d[ -]?){10}\d$/,
    //   'Please enter a valid phone number'
    // )
    .required('Please enter a valid phone number'),
});

const RegisterForm = ({email, setPage, setEmail, otpLogin, ...rest}) => {
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  const TERMS = store_data?.customer_document;
  const PRIVACY_POLICY = store_data?.customer_privacy_policy;

  const toast = useToast();
  const router = useRouter();
  const {ref_id} = router.query;
  const [ischecked, setChecked] = useState(false);
  const [countryCode, setCountryCode] = useState('+234');
  const [token, setToken] = useState('');

  const profileQuery = useQuery(
    ['getSettingsData', token, otpLogin],
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
        setPage('thankYou');
        setEmail(email);
      },
      onError: err => {
        console.log(err);
      },
      enabled: Boolean(token) && Boolean(otpLogin),
    }
  );

  // const storeName = STORENAMEFROMDOMAIN;
  const storeName = store_name();

  const loginForRegister = useMutation(formData => AttemptLogin(formData), {
    onSuccess: res => {
      if (res?.response?.data?.action == 'signup') {
      } else if (res?.data?.action == 'login') {
        setPage('successLink');
        setEmail(email);
        // return
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
      toast({
        title: `${err.response.data.resolve ?? 'Oops...'}`,
        description: `${err.message ?? err.response.data.message ?? err}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const {mutate, isLoading} = useMutation(
    formData => {
      const data = ref_id
        ? {
            ref_id: ref_id,
            store_name: storeName,
            email: email,
            ...formData,
          }
        : {
            store_name: storeName,
            email: email,
            ...formData,
          };
      return registerUser(data, otpLogin);
    },
    {
      onSuccess: res => {
        if (otpLogin) {
          const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
          setSession(res?.data?.token, 'token', expires);
          setTimeout(() => {
            setToken(res?.data?.token);
          }, 1000);
        } else if (res?.status == 200) {
          formik.resetForm();
          if (ref_id) {
            return loginForRegister.mutate({
              email: email,
              store_name: storeName,
            });
          } else {
            setPage('thankYou');
            setEmail(email);
          }
        } else {
          toast({
            title: 'Oops ...',
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
        toast({
          title: 'Oops ...',
          description: `${
            err?.response?.data?.message ??
            err?.response?.message ??
            err?.message ??
            'Something went wrong,we are working to resolve it'
          }`,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return formik.resetForm();
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      gender: 'male',
    },
    validateOnChange: true,
    validateOnBlur: false,
    validateOnMount: true,
    onSubmit: values => {
      mutate(values);
    },
    validationSchema: formSchema,
  });

  const isDisabled = !ischecked || !formik.isValid;

  return (
    <Box
      bg="card_bg"
      maxW="440px"
      w={{base: `100%`, lg: `440px`}}
      px={{base: `24px`, md: '40px'}}
      py="32px"
      borderRadius={'0px'}
      {...rest}
    >
      <Flex h="full" direction="column" justify={'center'} align="center" gap={`16px`}>
        <Stack textAlign={`center`} align={`center`} gap={`8px`}>
          <Text
            color="text"
            fontSize={'23px'}
            fontWeight={600}
            mt="0px"
            lineHeight={`140%`}
            className="heading-text-regular"
          >
            Let’s get to know you more
          </Text>
          <Text
            {...themeStyles.textStyles.sl5}
            fontSize={'13px'}
            fontWeight={'300'}
            mt="0px !important"
            lineHeight={`140%`}
            color={`matador_text.500`}
          >
            Enter your personal details
          </Text>
        </Stack>
        <TitleInput
          px="14px"
          error={formik.errors.first_name && formik.touched.first_name}
          onChange={formik.handleChange('first_name')}
          value={formik.values.first_name}
          placeholder="First Name"
          formik={formik}
        />
        <FormInput
          h="44px"
          w="full"
          px="14px"
          type="text"
          error={formik.errors.last_name && formik.touched.last_name}
          onChange={formik.handleChange('last_name')}
          value={formik.values.last_name}
          placeholder="Last Name"
        />

        <Box w="full">
          <Flex h={'44px'} w="full" align={'center'} gap={`12px`}>
            {/* <Select
              height="44px"
              w="25%"
              borderRadius={0}
              defaultValue={PHONEPREFIX[0].code}
              color="custom_color.color"
              _focus={{color: 'custom_color.color'}}
              onChange={e => setCountryCode(e.target.value)}
            >
              {PHONEPREFIX.map(phone => (
                <option value={'+234'} key={phone.id}>
                  {phone.code}
                </option>
              ))}
            </Select> */}

            <PhoneInput
              value={formik.values.phone}
              // onChange={formik.handleChange('phone')}
              formik={formik}
              placeholder={'Phone number'}
              error={formik.errors.phone && formik.touched.phone}
            />
          </Flex>
          <Text color={themeStyles.color.matador__red} my={'5px'} fontSize={'14px'}>
            {formik.errors.phone && formik.touched.phone}
          </Text>
        </Box>

        <Checkbox2
          isChecked={ischecked}
          onClick={() => setChecked(!ischecked)}
          background={`matador_background.100`}
        >
          <Text
            fontSize={{base: '11px', md: `13px`}}
            fontWeight={500}
            color="matador_text.300"
            display={'inline'}
            ml={`0px !important`}
          >
            By Creating an account you agree to accept our{' '}
            <Link
              onClick={!PRIVACY_POLICY ? e => e.preventDefault() : null}
              href={PRIVACY_POLICY ? PRIVACY_POLICY : '#'}
              target={PRIVACY_POLICY ? '_blank' : ''}
            >
              <Text cursor="pointer" color={'custom_color.color'} display={'inline'}>
                Privacy Policy
              </Text>
            </Link>{' '}
            and{' '}
            <Link
              onClick={!TERMS ? e => e.preventDefault() : null}
              href={TERMS ? TERMS : '#'}
              target={TERMS ? '_blank' : ''}
            >
              <Text cursor="pointer" color="custom_color.color" display={'inline'}>
                {' '}
                Terms of Service
              </Text>
            </Link>
          </Text>
        </Checkbox2>
        <Button
          h="48px"
          mt="16px"
          type="submit"
          onClick={formik.handleSubmit}
          isLoading={isLoading}
          isDisabled={isDisabled}
          bg="custom_color.color"
          w="full"
          color="custom_color.contrast"
        >
          <Text lineHeight={'140%'} fontWeight={'500'} fontSize={'16px'}>
            Proceed
          </Text>
        </Button>
      </Flex>
    </Box>
  );
};

export default RegisterForm;
