import {
  Button,
  CurrencyInput,
  FormInput,
  FormSelect,
  PhoneInput,
  Spinner,
  UploadProfilePicture,
} from '@/ui-lib';
import {
  Box,
  GridItem,
  SimpleGrid,
  Center,
  Text,
  VStack,
  Divider,
  FormLabel,
  Flex,
  HStack,
  Stack,
} from '@chakra-ui/react';

import {formatWithCommas} from '@/utils';
import Documents from '@/pages/settings/sections/Documents';
import ThreeDots from '@/components/loaders/ThreeDots';
import {CheckCircleIcon} from '@chakra-ui/icons';

export const BioDataView = ({
  formik,
  profileQuery,
  handleBlur,
  handleAmount,
  mutation,
  handleDate,
  settingsPage = false,
}) => {
  const flexDirection = settingsPage ? {base: `column`, lg: `row`} : {base: `column`};

  const titleStyle = {
    className: 'heading-text-regular',
    fontSize: {base: 16, md: 23},
    fontWeight: `600`,
    textTransform: 'uppercase',
    flex: `1`,
  };

  const gridContainerStyle = {
    flex: {base: 1, lg: 2},
    columns: {base: 1, lg: 2},
    gap: {base: '5px', lg: '19px'},
    mb: {base: '7px', lg: '30px'},
    p: '24px',
    border: '1px solid',
    borderColor: `matador_border_color.100 !important`,
    bg: `matador_background.200`,
    borderRadius: `2px`,
    boxShadow: '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
  };

  return (
    <Box padding={{base: '0', lg: '34px'}} pt={{lg: '10px'}} w="full">
      {profileQuery?.isLoading ? (
        <Center w="full" h="50vh">
          {settingsPage ? (
            <Spinner noAbsolute />
          ) : (
            <ThreeDots boxSize={{base: '16px', md: '25px'}} circular />
          )}
        </Center>
      ) : (
        <Stack w="full">
          <Flex
            direction={flexDirection}
            gap={{base: '5px', lg: '10px'}}
            justifyContent={'space-between'}
          >
            {!settingsPage && <Text {...titleStyle}>Upload Passport Photograph</Text>}
            <UploadProfilePicture
              id="avatar"
              name="avatar"
              mt={{base: '20px', lg: 0}}
              justify={settingsPage ? {base: 'center', md: 'flex-start'} : {base: 'flex-start'}}
            />
          </Flex>
          <VStack
            mt={{base: '30px', lg: '40px'}}
            w="full"
            align={'stretch'}
            gap={{base: '10px', lg: '20px'}}
            divider={<Divider w="full" borderColor={`matador_border_color.100`} />}
          >
            {/* first section */}
            <Flex
              direction={flexDirection}
              gap={{base: '5px', lg: '10px'}}
              justifyContent={'space-between'}
            >
              <Text {...titleStyle}>Basic Information</Text>

              <SimpleGrid {...gridContainerStyle}>
                <FormInput
                  type="text"
                  label="Full Name"
                  value={formik.values.first_name + ' ' + formik.values.last_name}
                  placeholder="Enter full name"
                  fontSize={13}
                  disabled
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
                <PhoneInput
                  label="Phone number"
                  value={formik.values.phone}
                  placeholder={'Enter phone number'}
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
            </Flex>

            {/* second section */}
            <Flex
              direction={flexDirection}
              gap={{base: '5px', lg: '10px'}}
              justifyContent={'space-between'}
            >
              <Text {...titleStyle}>education & employment</Text>
              <SimpleGrid {...gridContainerStyle}>
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
            </Flex>

            {/* third section */}
            <Flex
              direction={flexDirection}
              gap={{base: '5px', lg: '10px'}}
              justifyContent={'space-between'}
              columns={{base: 1}}
            >
              <Text {...titleStyle}>additional info</Text>
              <SimpleGrid {...gridContainerStyle} columns={{base: 1}}>
                <FormInput
                  label="Residential Address"
                  type="text"
                  onChange={formik.handleChange('address')}
                  value={formik.values.address}
                  placeholder="Enter residential address"
                  bg={`matador_background.100`}
                />
                <Box display={{base: 'flex', lg: 'none'}}>
                  <FormInput
                    label="Company Address"
                    type="text"
                    onChange={formik.handleChange('company_address')}
                    value={formik.values.company_address}
                    placeholder="Enter company address"
                    bg={`matador_background.100`}
                  />
                </Box>
                <FormLabel fontSize={'13px'} color="matador_text.500" fontWeight={500}>
                  Upload Utillity Bill
                  <Documents type="utility_bill" />
                </FormLabel>
                <FormLabel fontSize={'13px'} color="matador_text.500" fontWeight={500}>
                  Upload ID
                  <Documents type="id" />
                </FormLabel>
              </SimpleGrid>
            </Flex>
            <Flex
              direction={flexDirection}
              gap={{base: '5px', lg: '10px'}}
              justifyContent={'space-between'}
            >
              <Text {...titleStyle}>Source of Funds</Text>
              <SimpleGrid {...gridContainerStyle} columns={{base: 1}}>
                <FormSelect
                  label="Fund Source"
                  type="text"
                  onChange={formik.handleChange('fund_source')}
                  value={formik.values.fund_source}
                  placeholder="Select Fund Source"
                  options={['Savings', 'Loan', 'Salary']}
                  borderColor={`matador_border_color.100`}
                  bg={`matador_background.100`}
                />
              </SimpleGrid>
            </Flex>
          </VStack>
          <HStack justify={`flex-end`}>
            <Button
              variation={`primary`}
              onClick={formik.handleSubmit}
              isLoading={profileQuery?.isLoading || mutation.isLoading}
              // isDisabled={isObjectEmpty(formik.touched) || !formik.isValid}
              isDisabled={!formik.isValid}
              w={{base: 'full', lg: '200px'}}
              type="submit"
            >
              {settingsPage ? (
                <Text fontWeight={`500`}>Update</Text>
              ) : (
                <HStack>
                  <CheckCircleIcon />
                  <Text>Save and Proceed</Text>
                </HStack>
              )}
            </Button>
          </HStack>
        </Stack>
      )}
    </Box>
  );
};
