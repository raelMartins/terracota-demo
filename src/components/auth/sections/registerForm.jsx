import React, {useState} from 'react';
import {Box, Flex, Stack, Text, useToast} from '@chakra-ui/react';
import {Button, Checkbox2, FormInput, PhoneInput, TitleInput} from '@/ui-lib/ui-lib.components';
import {themeStyles} from '@/theme';
import {useMutation, useQuery} from 'react-query';
import {AttemptLogin, registerUser, storeDetails} from '@/api/auth';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {store_name} from '@/constants/routes';
import {useFormik} from 'formik';
import * as Yup from 'yup';

const formSchema = Yup.object().shape({
  // account_type: Yup.string().required('Please select an account type'),
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

const RegisterForm = ({onAuthClose, email, setPage, setEmail, ...rest}) => {
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  const TERMS = store_data?.customer_document;
  const PRIVACY_POLICY = store_data?.customer_privacy_policy;

  const toast = useToast();
  const router = useRouter();
  const {ref_id} = router.query;
  const [ischecked, setChecked] = useState(false);
  const [countryCode, setCountryCode] = useState('+234');

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
      return registerUser(data);
    },
    {
      onSuccess: res => {
        if (res?.status == 200) {
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
        return formik.resetForm();
      },
    }
  );

  const PHONEPREFIX = [
    {
      id: '1',
      code: '+234',
      name: 'Nigeria',
    },
    {
      id: '5',
      code: '+1',
      name: 'Canada',
    },
    {
      id: '6',
      code: '+44',
      name: 'United Kingdom',
    },
    {
      id: '7',
      code: '+1',
      name: 'United States of America',
    },
  ];

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
      // minH={'485px'}
      px={{base: `24px`, md: '40px'}}
      py="32px"
      borderRadius={'0px'}
      {...rest}
    >
      <Flex h="full" direction="column" justify={'center'} align="center" gap={`16px`}>
        {/* <Flex direction="row" justify="space-between" alignItems={'center'} alignSelf="stretch">
          <Box w="40px" />
          <CloseIcon
            alignSelf={'flex-start'}
            fontSize={'15px'}
            style={{color: '#667085', cursor: 'pointer'}}
            onClick={onAuthClose}
          />
        </Flex> */}
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
        {/* <Select
          borderRadius={0}
          color='text'
          placeholder='Account Type'
          mt='20px'
          w='full'
          h='44px'
          variant='outline'
          border={
            formik.errors.account_type
              ? '2px solid #E6192A !important'
              : '1px solid #D0D5DD !important'
          }
          // error={formik.errors.account_type}
          onChange={formik.handleChange('account_type')}
          value={formik.values.account_type}
          _focus={{ border: '1px solid #747474 !important' }}
        >
          <option value={'Personal'}>Personal</option>
          <option value={'Business'}>Business</option>
          <option value={'Corporate'}>Corporate</option>
        </Select> */}
        {/* {formik.errors.account_type && (
          <Text
            w='full'
            textAlign={'left'}
            color={themeStyles.color.matador__red}
            my={'5px'}
            fontSize={'14px'}
          >
            {formik.errors.account_type}
          </Text>
        )} */}
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
