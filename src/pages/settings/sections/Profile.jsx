import React from 'react';
import {
  Box,
  GridItem,
  Image,
  SimpleGrid,
  useToast,
  Center,
  Text,
  VStack,
  Divider,
  FormLabel,
} from '@chakra-ui/react';
import {useFormik} from 'formik';
import {
  Button,
  CurrencyInput,
  FormInput,
  FormSelect,
  PhoneInput,
  Spinner,
  UploadProfilePicture,
} from '@/ui-lib';
import {getSettingsData, updateSettings} from '@/api/Settings';
import {useMutation, useQuery} from 'react-query';
import Documents from './Documents';
import {formatDateStringDayFirst, isValidDate} from '@/realtors_portal/utils/formatDate';
import {formatWithCommas} from '@/utils';

const Profile = () => {
  const toast = useToast();

  const profileQuery = useQuery(['getSettingsData'], () => getSettingsData({profile: true}), {
    onSuccess: res => {
      const [y, m, d] = res?.data?.data?.date_of_birth
        ? res?.data?.data?.date_of_birth?.split('-')
        : [``, ``, ``];
      console.log({res});

      formik.setValues({
        avatar: res.data?.data?.avatar,
        first_name: res.data?.data?.first_name || '',
        last_name: res.data?.data?.last_name || '',
        date_of_birth: res.data?.data?.date_of_birth ? `${d}/${m}/${y}` : '',
        gender: res.data?.data?.gender || '',
        email: res.data?.data?.email || '',
        marital_status: res.data?.data?.marital_status || '',
        phone: res.data?.data?.phone || '',
        highest_education: res.data?.data?.highest_education || '',
        employment_status: res.data?.data?.employment_status || '',
        company_name: res.data?.data?.company_name || '',
        occupation: res.data?.data?.occupation || '',
        monthly_income: res.data?.data?.monthly_income || '',
        bvn: res.data?.data?.bvn || '',
        address: res.data?.data?.address || '',
        company_address: res.data?.data?.company_address || '',
        country: res.data?.data?.country || '',
        currency: res.data?.data?.currency || '',
      });
    },
  });

  const mutation = useMutation(forlgata => updateSettings(forlgata), {
    onSuccess: async res => {
      toast({
        title: 'Changes updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return await profileQuery?.refetch();
    },
    onError: err => {
      toast({
        title: err?.message === 'Network Error' ? 'Network Error' : 'Oops something went wrong',
        description: `${err?.response?.data?.message ?? 'please check your network connection'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const AvatarMutation = useMutation(forlgata => updateSettings(forlgata), {
    onSuccess: res => {
      toast({
        title: 'changes updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      profileQuery.refetch();
    },
    onError: res => {
      toast({
        title: err?.message === 'Network Error' ? 'Network Error' : 'Oops something went wrong',
        description: `${err?.response?.data?.message ?? 'please check your network connection'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const validateForm = values => {
    const errors = {};
    let hasChanged = false; // Initialize a flag
    const date = new Date();
    const [d, m, y] = values?.date_of_birth?.split('/');
    // const inputDate = new Date(`${m}-${d}-${y?.padStart(4, '0')}`);
    const inputDate = new Date(`${y?.padStart(4, '0')}-${m}-${d}`);

    // Validate date_of_birth
    if (isNaN(inputDate?.getTime()) && formik.touched.date_of_birth) {
      errors.date_of_birth = 'Invalid Date format';
    } else if (inputDate > date) {
      errors.date_of_birth = "Hmm, date selected can't be in the future";
    }

    // Check if any other value has changed
    for (const [key, value] of Object.entries(values)) {
      if (['first_name', 'last_name', 'phone', 'avatar', 'country', 'email'].includes(key)) {
        continue; // Skip these keys
      }
      const initialValue = formik.initialValues[key];
      const currentValue = values[key];
      if (initialValue !== currentValue) {
        hasChanged = true; // Set the flag if any value has changed
      }
    }

    if (!hasChanged) {
      errors._error = 'At least one value must be changed.';
    }

    return errors;
  };

  const handleDate = e => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');

    const formattedValue = formatDateStringDayFirst(numericValue);

    if (!inputValue.trim()) {
      formik.setValues({
        ...formik.values,
        date_of_birth: '', // Set to empty string when input is cleared
      });
    } else {
      formik.setValues({
        ...formik.values,
        date_of_birth: formattedValue,
      });

      // Validate the formatted date
      const [d, m, y] = formattedValue.split('/');
      if (!isValidDate(d, m, y)) {
        formik.setErrors({
          ...formik.errors,
          date_of_birth: 'Please enter a valid date',
        });
      } else {
        formik.setErrors({
          ...formik.errors,
          date_of_birth: '',
        });
      }
    }

    formik.setFieldTouched('date_of_birth');
  };

  const handleAmount = e => {
    const inputValue = e.target.value;
    const currency = inputValue.slice(0, 1);
    const numericValue = inputValue.replace(/\D/g, '');

    // const formattedValue = formatWithCommas(numericValue, true); //leave this for now until we figure out how to handle currency specifics

    // formatWithCommas(e.target.value.replace(/\D/g, ''), true); //leave this for now until we figure out how to handle currency specifics

    if (!inputValue.trim()) {
      formik.setValues({
        ...formik.values,
        monthly_income: '', // Set to empty string when input is cleared
      });
    } else {
      formik.setValues({
        ...formik.values,
        monthly_income: numericValue * 1,
        // monthly_income: formattedValue, //leave this for now until we figure out how to handle currency specifics
        // monthly_income: `${currency}${formattedValue}`, //leave this for now until we figure out how to handle currency specifics
      });
    }

    formik.setFieldTouched('monthly_income');
  };

  const handleBlur = e => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const month = numericValue.substr(0, 2);
    const day = numericValue.substr(2, 2);
    const year = numericValue.substr(4);

    if (numericValue.length === 10 && !isValidDate(day, month, year)) {
      formik.setErrors({
        ...formik.errors,
        date_sold: 'Please enter a valid date',
      });
    } else {
      formik.setErrors({
        ...formik.errors,
        date_sold: '',
      });
    }

    formik.setFieldTouched('date_sold');
  };

  const formik = useFormik({
    initialValues: {
      avatar: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      email: '',
      marital_status: '',
      phone: '',
      highest_education: '',
      employment_status: '',
      company_name: '',
      occupation: '',
      monthly_income: '',
      bvn: '',
      address: '',
      company_address: '',
      currency: '',
    },
    onSubmit: values => {
      let exp = {};
      const [d, m, y] = values?.date_of_birth?.split('/');

      for (const [key, value] of Object.entries(values)) {
        let val = value?.toString();
        if (val.trim() !== '') {
          exp[key] = value;
        }
      }
      exp = {
        profile_details: true,
        ...exp,
        date_of_birth: formik.touched.date_of_birth ? `${y}-${m}-${d}` : undefined,
      };
      delete exp.avatar;
      mutation.mutate(exp);
    },
    validateOnChange: true,
    // validateOnMount: true,
    validate: validateForm,
  });

  const onAvatarChange = file => {
    AvatarMutation.mutate({
      profile_avatar: true,
      avatar: file[0]?.image.replace('data:', '').replace(/^.+,/, ''),
    });
    return profileQuery.refetch();
  };

  return (
    <Box padding={{base: '0', lg: '34px'}} pt={{lg: '10px'}} w="full">
      {profileQuery?.isLoading ? (
        <Center w="full" h="50vh">
          <Spinner noAbsolute />
        </Center>
      ) : (
        <Box w="full">
          <UploadProfilePicture
            containerStyle={{
              width: 'max-content',
              margin: 'auto',
            }}
            id="avatar"
            name="avatar"
            setFiles={onAvatarChange}
            isAvatarLoading={AvatarMutation.isLoading}
            avatar={formik.values.avatar}
            numOfFiles={1}
            isProfilePic
            mt={{base: '20px', lg: 0}}
          />
          <VStack
            mt={{base: '30px', lg: '40px'}}
            w="full"
            align={'stretch'}
            spacing={{base: '10px', lg: '20px'}}
            divider={<Divider w="full" borderColor={`matador_border_color.100`} />}
          >
            {/* first section */}
            <SimpleGrid
              columns={{base: 1, lg: 3}}
              spacing={{base: '5px', lg: '19px'}}
              justifyContent={'space-between'}
            >
              <GridItem colSpan={1} mb={{base: '7px', lg: '30px'}} maxW="413px">
                <Text
                  className="heading-text-regular"
                  fontSize={{base: 16, md: 23}}
                  fontWeight={600}
                  textTransform={'uppercase'}
                >
                  Basic Information
                </Text>
              </GridItem>
              <GridItem
                colSpan={{base: 1, lg: 2}}
                mb={{base: '7px', lg: '30px'}}
                p="24px"
                border="1px solid"
                borderColor={`matador_border_color.100`}
                bg={`matador_background.200`}
                borderRadius={'2px'}
                boxShadow={
                  '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)'
                }
              >
                <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: '5px', lg: '19px'}}>
                  <FormInput
                    type="text"
                    label="Full Name"
                    value={formik.values.first_name + ' ' + formik.values.last_name}
                    placeholder="Enter full name"
                    fontSize={13}
                    disabled
                    bg={`matador_background.100`}
                  />
                  <FormInput
                    label="Date of Birth"
                    type="text"
                    onChange={handleDate}
                    placeholder="DD/MM/YYYY"
                    value={formik.values.date_of_birth}
                    disabled={profileQuery?.data?.data?.data?.date_of_birth}
                    fontSize={13}
                    error={formik.touched.date_of_birth && formik.errors.date_of_birth}
                    onBlur={handleBlur}
                    bg={`matador_background.100`}
                  />
                  <FormInput
                    label="Email address"
                    type="email"
                    onChange={formik.handleChange('email')}
                    value={formik.values.email}
                    placeholder={'Enter email address'}
                    disabled={true}
                    fontSize={13}
                    bg={`matador_background.100`}
                  />
                  {profileQuery?.data?.data?.data?.customer_ref && (
                    <FormInput
                      label="Ref No."
                      type="text"
                      value={profileQuery?.data?.data?.data?.customer_ref}
                      disabled={true}
                      fontSize={13}
                      bg={`matador_background.100`}
                    />
                  )}
                  <FormSelect
                    options={['Married', 'Single', 'Divorced', 'Rather not say']}
                    label="Marital Status"
                    type="text"
                    onChange={formik.handleChange('marital_status')}
                    value={formik.values.marital_status}
                    placeholder="Select marital status"
                    borderColor={`matador_border_color.100`}
                    bg={`matador_background.100`}
                  />
                  {/* <FormInput
                    label="Phone number"
                    type="phone"
                    onChange={formik.handleChange('phone')}
                    value={formik.values.phone.replace('+234', '')}
                    placeholder={'Enter phone number'}
                    disabled={true}
                    fontSize={13}
                    formik={formik}
                    bg={`matador_background.100`}
                  /> */}
                  <PhoneInput
                    label="Phone number"
                    // onChange={formik.handleChange('phone')}
                    value={formik.values.phone}
                    placeholder={'Enter phone number'}
                    // isDisabled
                    formik={formik}
                  />

                  <FormSelect
                    options={['male', 'female', 'rather not say']}
                    label="Gender"
                    type="text"
                    onChange={formik.handleChange('gender')}
                    value={formik.values.gender}
                    defaultValue={formik.values.gender}
                    placeholder="Select gender"
                    borderColor={`matador_border_color.100`}
                    bg={`matador_background.100`}
                    disabled={profileQuery?.data?.data?.data?.gender}
                    textTransform={`capitalize`}
                  />
                </SimpleGrid>
              </GridItem>
            </SimpleGrid>

            {/* second section */}
            <SimpleGrid
              mt={{base: '10px', lg: '20px'}}
              columns={{base: 1, lg: 3}}
              spacing={{base: '5px', lg: '19px'}}
              justifyContent={'space-between'}
            >
              <GridItem colSpan={{base: 1, lg: 1}} mb={{base: '7px', lg: '30px'}} maxW="413px">
                <Text
                  className="heading-text-regular"
                  fontSize={{base: 16, md: 23}}
                  fontWeight={600}
                  textTransform={'uppercase'}
                >
                  education & employment
                </Text>
              </GridItem>
              <GridItem
                colSpan={{base: 1, lg: 2}}
                mb={{base: '7px', lg: '30px'}}
                p="24px"
                border="1px solid"
                borderColor={`matador_border_color.100`}
                bg={`matador_background.200`}
                borderRadius={'2px'}
                boxShadow={
                  '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)'
                }
              >
                <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: '5px', lg: '19px'}}>
                  <FormSelect
                    label="Highest Education Level"
                    type="text"
                    onChange={formik.handleChange('highest_education')}
                    value={formik.values.highest_education}
                    placeholder="Select level"
                    options={[
                      'High School Diploma',
                      `Bachelor's Degree`,
                      'Post-Secondary Certificate',
                      'Some college',
                      `Master's Degree`,
                      'PHD',
                    ]}
                    borderColor={`matador_border_color.100`}
                    bg={`matador_background.100`}
                  />
                  <FormSelect
                    label="Employment Status"
                    type="text"
                    onChange={formik.handleChange('employment_status')}
                    value={formik.values.employment_status}
                    placeholder="Select"
                    options={['Employed', 'Unemployed', 'Self employed']}
                    borderColor={`matador_border_color.100`}
                    bg={`matador_background.100`}
                  />
                  <FormInput
                    label="Company Name"
                    type="text"
                    onChange={formik.handleChange('company_name')}
                    value={formik.values.company_name}
                    placeholder="Enter company's name"
                    bg={`matador_background.100`}
                  />
                  <FormInput
                    label="Occupation"
                    type="text"
                    onChange={formik.handleChange('occupation')}
                    value={formik.values.occupation}
                    placeholder="Enter occupation"
                    bg={`matador_background.100`}
                  />
                  <CurrencyInput
                    label="Monthly Income"
                    onChange={handleAmount}
                    changeCurrency={formik.handleChange('currency')}
                    selectedCurrency={formik.values.currency}
                    value={formatWithCommas(
                      `${formik.values.monthly_income}`.replace(/\D/g, ''),
                      true
                    )}
                    placeholder="0.00"
                  />
                  <Box display={{base: 'none', lg: 'flex'}}>
                    <FormInput
                      label="Company Address"
                      type="text"
                      onChange={formik.handleChange('company_address')}
                      value={formik.values.company_address}
                      placeholder="Enter company address"
                      bg={`matador_background.100`}
                    />
                  </Box>
                </SimpleGrid>
              </GridItem>
            </SimpleGrid>

            {/* third section */}
            <SimpleGrid
              mt={{base: '10px', lg: '20px'}}
              columns={{base: 1, lg: 3}}
              spacing={{base: '5px', lg: '19px'}}
              justifyContent={'space-between'}
            >
              <GridItem colSpan={{base: 1, lg: 1}} mb={{base: '7px', lg: '10px'}} maxW="413px">
                <Text
                  className="heading-text-regular"
                  fontSize={{base: 16, md: 23}}
                  fontWeight={600}
                  textTransform={'uppercase'}
                >
                  additional info
                </Text>
              </GridItem>
              <GridItem
                colSpan={{base: 1, lg: 2}}
                mb={{base: '7px', lg: '10px'}}
                p="24px"
                border="1px solid"
                borderColor={`matador_border_color.100`}
                bg={`matador_background.200`}
                borderRadius={'2px'}
                boxShadow={
                  '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)'
                }
              >
                <SimpleGrid columns={{base: 1, lg: 2}} spacing={{base: '15px', lg: '20px'}}>
                  <GridItem colSpan={{base: 1, lg: 2}}>
                    <FormInput
                      label="Residential Address"
                      type="text"
                      onChange={formik.handleChange('address')}
                      value={formik.values.address}
                      placeholder="Enter residential address"
                      bg={`matador_background.100`}
                    />
                  </GridItem>
                  <GridItem colSpan={1} display={{base: 'flex', lg: 'none'}}>
                    <FormInput
                      label="Company Address"
                      type="text"
                      onChange={formik.handleChange('company_address')}
                      value={formik.values.company_address}
                      placeholder="Enter company address"
                      bg={`matador_background.100`}
                    />
                  </GridItem>
                  <GridItem colSpan={{base: 1, lg: 2}}>
                    <FormLabel fontSize={'13px'} color="matador_text.500" fontWeight={500}>
                      Upload Utillity Bill
                    </FormLabel>
                    <Documents type="utility_bill" />
                  </GridItem>
                  <GridItem colSpan={{base: 1, lg: 2}}>
                    <FormLabel fontSize={'13px'} color="matador_text.500" fontWeight={500}>
                      Upload ID
                    </FormLabel>
                    <Documents type="id" />
                  </GridItem>
                </SimpleGrid>
              </GridItem>
            </SimpleGrid>
          </VStack>
        </Box>
      )}

      <Button
        float="right"
        onClick={formik.handleSubmit}
        isLoading={profileQuery?.isLoading || mutation.isLoading}
        // isDisabled={isObjectEmpty(formik.touched) || !formik.isValid}
        isDisabled={!formik.isValid}
        mt="20px"
        color="custom_color.contrast"
        bg="custom_color.color"
        w={{base: 'full', lg: '200px'}}
        type="submit"
        h="48px"
        fontSize={16}
      >
        Update
      </Button>
    </Box>
  );
};

export default Profile;
