import React, {useRef, useState} from 'react';
import {
  Box,
  GridItem,
  SimpleGrid,
  useToast,
  Text,
  VStack,
  Divider,
  FormLabel,
  Link,
  HStack,
  Center,
  Stack,
} from '@chakra-ui/react';
import {useFormik} from 'formik';
import {Button, FormInput, FormSelect, Spinner, UploadProfilePicture} from '/src/ui-lib';
import {useMutation, useQuery} from 'react-query';
import {agentSignUp} from '/src/realtors_portal/api/agents';
import useFormError from '/src/realtors_portal/utils/Hook/useFormError';
import UploadUserDocuments from '../UploadUserDocuments';
import {Checkbox2} from '/src/ui-lib';
import {storeDetails} from '../../../api/auth';
import {formatDateStringDayFirst} from '../../../utils/formatDate';
// import default_avatar from '/src/realtors_portal/images/avatar.jpeg';
import default_avatar from '/src/realtors_portal/images/avatar.svg';
import {PhoneInput} from '@/ui-lib';
// import default_avatar from '/src/realtors_portal/images/icons/Profile.png';

export const RegisterAgentForm = ({sendRequest, email}) => {
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  const TERMS = store_data?.agent_document;
  const PRIVACY_POLICY = store_data?.agent_privacy_policy;

  const toast = useToast();
  const [avatar, setAvatar] = useState(default_avatar.src);
  const [active, setActive] = useState('');
  const [doc, setDoc] = useState([]);
  const [checked, setChecked] = useState(false);
  // const router = useRouter();

  const {handleError, formError} = useFormError();
  // const dateInput = useRef(null);

  const handleDocument = file => {
    const document = file ? file.map(item => item.replace('data:', '').replace(/^.+,/, '')) : null;
    console.log({file});
    console.log({document});

    setDoc(document);
  };

  // useEffect(() => {
  //   const checkObj = value => {
  //     return Object.keys(value)?.every(item => {
  //       if (item === 'store_name') {
  //         return true;
  //       }
  //       return value[item] === null;
  //     });
  //   };
  // }, []);

  const mutation = useMutation(
    formData => {
      return agentSignUp({...formData});
    },
    {
      onSuccess: res => {
        if (res?.code === 'ERR_NETWORK') {
          toastForError(res, true, toast);
        }

        if (res?.statusText === 'Created') {
          sendRequest();
        }
      },
      onError: err => {
        toast({
          title: 'Oops...',
          description: `${
            err?.response?.data?.message ?? err?.response?.message ?? 'Something went wrong'
          }`,
          status: 'error',
          duration: 8000,
          isClosable: true,
          position: 'top-right',
        });
      },
    }
  );

  const onAvatarChange = file => {
    setAvatar(file[0]?.preview);
    formik.setFieldValue('avatar', file[0]?.image.replace('data:', '').replace(/^.+,/, ''));
  };

  const formik = useFormik({
    initialValues: {
      avatar: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      date_of_birth: '',
      marital_status: '',
      gender: '',
      phone: '',
      highest_education: '',
      email,
      employment_status: '',
      company_name: '',
      company_address: '',
    },
    onSubmit: () => {},
  });

  const handleDate = e => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, '');

    const formattedValue = formatDateStringDayFirst(numericValue);

    if (!e.target.value.trim()) {
      const {date_of_birth, ...rest} = formik.values;
      return formik.setValues(rest);
    }
    formik.setValues({
      ...formik.values,
      date_of_birth: formattedValue,
    });

    formik.setErrors({
      ...formik.errors,
      date_sold: '',
    });
  };

  function formatDate(date, forBackEnd) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    let formattedDate = `${day}/${month}/${year}`;

    if (forBackEnd) {
      formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }

    return date;
  }

  const handleEdit = opt => {
    if (active === opt) {
      return setActive('');
    }
    return setActive(opt);
  };

  const handleUpdate = () => {
    const [d, m, y] = formik?.values.date_of_birth?.split('/');
    const DOB = new Date(`${y}-${m}-${d}`);

    // const DOB = new Date(formik.values.date_of_birth);
    const payload = {
      ...formik.values,
      date_of_birth: formatDate(DOB, true),
      company_address: formik.values.company_address.toLowerCase(),
      address: formik.values.address.toLowerCase(),
      document_type: null,
      document_type: null,
      id_number: null,
      document: doc,
      country: '1',
    };

    mutation.mutate(payload);
  };

  const isValid =
    !Object.values(formError).some(item => item) &&
    !!formik.values.gender &&
    !!formik.values.avatar &&
    !!formik.values.phone &&
    !!formik.values.middle_name &&
    !!formik.values.first_name &&
    !!formik.values.last_name &&
    !!formik.values.highest_education &&
    !!formik.values.employment_status &&
    !!formik.values.address?.trim() &&
    !!formik.values.marital_status &&
    !!formik.values.address &&
    doc?.length &&
    !!formik.values.date_of_birth &&
    checked;

  return (
    <Box padding={{base: '0', lg: '34px'}} w="full" overflow={{lg: `hidden`}} py={{lg: `56px`}}>
      <Box w="full">
        <Stack
          position={{lg: `absolute`}}
          //  top={{lg: '210px'}}
          top={{lg: '150px'}}
          flexDir={`column`}
        >
          <UploadProfilePicture
            containerStyle={{
              width: 'max-content',
              margin: 'auto',
            }}
            id="avatar"
            name="avatar"
            setFiles={onAvatarChange}
            // isAvatarLoading={AvatarMutation.isLoading}
            avatar={avatar || formik.values.avatar || default_avatar.src}
            numOfFiles={1}
            isProfilePic
            mt={{base: '20px', lg: ''}}
          />
          <HStack>
            <Text
              color="custom_color.color"
              fontSize={`18px`}
              fontWeight={`500`}
              lineHeight={`20px`}
              letterSpacing={`0.01em`}
            >
              * Passport photograph is required
            </Text>
          </HStack>
        </Stack>
        <VStack
          mt={{base: '30px', lg: '50px'}}
          w="full"
          align={'stretch'}
          spacing={{base: '10px', lg: '20px'}}
          divider={<Divider w="full" />}
        >
          <SimpleGrid
            columns={{base: 1, lg: 3}}
            spacing={{base: '5px', lg: '19px'}}
            justifyContent={'space-between'}
          >
            <GridItem colSpan={1} mb={{base: '7px', lg: '30px'}} maxW="413px">
              <Text fontSize={{base: 16, md: 23}} fontWeight={600} textTransform={'uppercase'}>
                tell us more about yourself{' '}
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
                  label="First Name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange('first_name')}
                  placeholder="Enter First Name"
                  fontSize={13}
                />
                <FormInput
                  type="text"
                  label="Last Name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange('last_name')}
                  placeholder="Enter Last Name"
                  fontSize={13}
                />
                <FormInput
                  type="text"
                  label="Middle Name"
                  value={formik.values.middle_name}
                  onChange={formik.handleChange('middle_name')}
                  placeholder="Enter Last Name"
                  fontSize={13}
                />
                <PhoneInput
                  label="Phone number"
                  type="phone"
                  onChange={formik.handleChange('phone')}
                  value={formik.values.phone.replace('+234', '')}
                  placeholder={'Enter phone number'}
                  fontSize={13}
                  formik={formik}
                />
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
                <FormInput
                  label="Date of Birth"
                  type="text"
                  // onChange={formik.handleChange('date_of_birth')}
                  onChange={handleDate}
                  placeholder="DD/MM/YYY"
                  value={formik.values.date_of_birth}
                  fontSize={13}
                />
                <FormSelect
                  options={['Male', 'Female', 'Other']}
                  label="Gender"
                  type="text"
                  onChange={formik.handleChange('gender')}
                  value={formik.values.gender}
                  placeholder="Select gender"
                  borderColor={`matador_border_color.100`}
                  bg={`matador_background.100`}
                />

                <FormSelect
                  options={['Married', 'Single']}
                  label="Marital Status"
                  type="text"
                  onChange={formik.handleChange('marital_status')}
                  value={formik.values.marital_status}
                  placeholder="Select marital status"
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
                  placeholder="Company Name (optional)"
                />
                <FormInput
                  label="Residential Address"
                  type="text"
                  onChange={formik.handleChange('address')}
                  value={formik.values.address}
                  placeholder="Enter residential address"
                />
                <FormInput
                  label="Company Address"
                  type="text"
                  onChange={formik.handleChange('company_address')}
                  value={formik.values.company_address}
                  placeholder="Enter company address (optional)"
                />
                <GridItem colSpan={{base: 1, lg: 2}}>
                  <FormLabel fontSize={'13px'} color="matador_text.500" fontWeight={500}>
                    Upload ID
                  </FormLabel>
                  <UploadUserDocuments
                    noNeedForType
                    displayText={
                      doc?.[0]
                        ? // ? `Uploaded: ${toDateFormat(doc?.[0]?.created_at)}`
                          `Image Uploaded`
                        : 'Choose Image To Upload'
                    }
                    handleDocument={handleDocument}
                  />
                </GridItem>
              </SimpleGrid>
            </GridItem>
          </SimpleGrid>
        </VStack>
      </Box>
      <HStack justify={{lg: `flex-end`}} mt={`20px`}>
        <Checkbox2 isChecked={checked} onClick={() => setChecked(!checked)}>
          <Text
            fontSize={{base: '11px', md: `13px`}}
            fontWeight={500}
            color="matador_text.300"
            display={'inline'}
            ml={`0px !important`}
            w={`100%`}
            textAlign={`left`}
          >
            By Creating an account you agree to accept our{' '}
            <Link
              onClick={!PRIVACY_POLICY ? e => e.preventDefault() : null}
              href={PRIVACY_POLICY ? PRIVACY_POLICY : '#'}
              target={PRIVACY_POLICY ? '_blank' : ''}
            >
              <Text cursor="pointer" color="custom_color.color" display={'inline'}>
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
      </HStack>

      <Button
        float="right"
        onClick={handleUpdate}
        isLoading={mutation.isLoading}
        // isDisabled={!formik.isValid}
        isDisabled={!isValid}
        mt="20px"
        color="custom_color.contrast"
        bg="custom_color.color"
        w={{base: 'full', lg: '200px'}}
        type="submit"
        h="48px"
        fontSize={16}
      >
        Proceed
      </Button>
    </Box>
  );
};
