import React from 'react';
import {
  InputGroup,
  Input,
  FormControl,
  FormLabel,
  Text,
  SlideFade,
  InputRightElement,
  InputLeftElement,
  InputLeftAddon,
  HStack,
  Select,
  Box,
} from '@chakra-ui/react';
import {themeStyles} from '../../../theme';
import {FaChevronDown} from 'react-icons/fa';
import {CURRENCIES, PHONEPREFIX} from '../../../components/constants/settings';
import countries, {MY_COUNTRY} from '@/constants/country';
import {defaultLabelStyling, getFormInputStyles, getInputDropDownStyle} from '.';
import {ErrorTextFadeIn} from './ErrorTextFadeIn';

export const FormInput = ({
  label,
  labelStyles = {},
  leftAddon,
  rightAddon,
  error,
  group,
  leftAddonStyle,
  getDialCode,
  formik,
  selectedCurrency,
  changeCurrency,
  _placeholder = {opacity: 0.8},
  ...rest
}) => {
  const phone = PHONEPREFIX.find(item => formik?.values?.country === parseInt(item.id));
  const [countryCode, setCountryCode] = React.useState(phone?.code || '+234');

  const handleGender = val => {
    const gender = val === 'Mr.' ? 'male' : 'female';
    formik?.setFieldValue('gender', gender);
  };

  const disabled = rest?.isDisabled || rest?.disabled;
  const label_styles = {...defaultLabelStyling, ...labelStyles};
  const input_style = getFormInputStyles(error, rest);
  const dropdown_style = getInputDropDownStyle(error, rest);

  return (
    <FormControl {...themeStyles.textStyles.sl5}>
      {label && <Text {...label_styles}>{label}</Text>}
      <HStack w="full" gap={`12px`} cursor={disabled ? `not-allowed` : `auto`}>
        {rest.type === 'phone' ? (
          <Box
            position="relative"
            w="100px"
            minW="80px"
            color={rest.color}
            height={rest?.h || rest?.height ? rest?.h || rest?.height : '44px'}
            // border={error ? '1px solid red !important' : `1px solid #E4E4E4 !important`}
            border={error ? '1px solid' : rest.border ? `${rest.border}` : `1px solid`}
            borderColor={
              error
                ? `red !important`
                : rest.border
                ? `${rest.borderColor} !important`
                : `matador_border_color.100 !important`
            }
            bg={
              rest.background ||
              rest.bg ||
              rest.backgroundColor ||
              rest.bgColor ||
              `matador_background.100`
            }
            opacity={rest?.isDisabled || rest?.disabled ? `.4` : `auto`}
            borderRadius={rest.borderRadius}
            rounded={rest.rounded}
          >
            <HStack spacing="10px" pl="16px" w="full" h="full">
              <Text fontSize="14px" color={rest.color || 'matador_form.label'} fontWeight="400">
                {countryCode}
              </Text>
            </HStack>
            <Select
              name="country"
              overflowX="hidden"
              // hidden={true}
              opacity="0"
              onChange={e => {
                setCountryCode(e.target.value);
              }}
              // icon={<FaChevronDown size={14} />}
              w="70px"
              zIndex="2"
              position="absolute"
              p="0px"
              cursor="pointer"
              left="10px"
              top={'0px'}
              // bottom="3px"
              border="none"
              required
              // fontWeight="400"
              // fontSize="20px"
              // icon={<DropDown />}
              id="countryPhoneNumber"
              lineHeight="18px "
              // color="card_bg"
              fontSize="14px"
              height={rest?.h || rest?.height ? rest?.h || rest?.height : '44px'}
              fontWeight="300"
              _focus={{
                border: 'none',
              }}
              _active={{
                border: 'none',
              }}
              _focusVisible={
                {
                  // border: 'none',
                }
              }
              _disabled={{color: `transparent`}}
              disabled={rest?.disabled}
              isDisabled={rest?.isDisabled || rest?.disabled}
              value={countryCode}
              sx={{
                paddingInlineStart: '0.05rem',
              }}
            >
              {PHONEPREFIX.map((item, index) => {
                return (
                  <option key={index} value={item.code} style={{color: `black`}}>
                    {`${item.code}`}
                  </option>
                );
              })}
            </Select>
          </Box>
        ) : null}
        {rest.type === 'title' ? (
          <Box
            position="relative"
            w="100px"
            height={rest?.h || rest?.height ? rest?.h || rest?.height : '44px'}
            // border={error ? '1px solid red !important' : `1px solid #E4E4E4 !important`}
            bg={
              rest.background ||
              rest.bg ||
              rest.backgroundColor ||
              rest.bgColor ||
              `matador_background.100`
            }
            border={error ? '1px solid' : rest.border ? `${rest.border}` : `1px solid`}
            borderColor={
              error
                ? `red !important`
                : rest.border
                ? `${rest.borderColor} !important`
                : `matador_border_color.100 !important`
            }
            borderRadius={rest.borderRadius}
            rounded={rest.rounded}
          >
            {/* <HStack spacing="10px" pl="16px" w="full" h="full">
              <Text fontSize="14px" color="matador_form.label" fontWeight="400">
                {countryCode}
              </Text>
            </HStack> */}
            <Select
              name="gender"
              overflowX="hidden"
              // hidden={true}"
              onChange={e => {
                handleGender(e.target.value);
              }}
              // icon={<FaChevronDown size={14} />}
              w="70px"
              zIndex="2"
              position="absolute"
              p="0px"
              cursor="pointer"
              left="10px"
              top={'0px'}
              // bottom="3px"
              border="none"
              required
              lineHeight="18px "
              // color="card_bg"
              fontSize="14px"
              height={rest?.h || rest?.height ? rest?.h || rest?.height : '44px'}
              fontWeight="300"
              _focus={{
                border: 'none',
              }}
              _active={{
                border: 'none',
              }}
              _focusVisible={
                {
                  // border: 'none',
                }
              }
              disabled={rest?.disabled}
              // value={countryCode}
              sx={{
                paddingInlineStart: '0.05rem',
              }}
            >
              {TITLES.map((item, index) => {
                return (
                  <option key={index} value={item} style={{color: `black`}}>
                    {`${item}`}
                  </option>
                );
              })}
            </Select>
          </Box>
        ) : null}
        <InputGroup borderColor={'matador_border_color.100'} {...group}>
          {leftAddon ? (
            <InputLeftElement ml="0" {...leftAddonStyle}>
              {leftAddon}
            </InputLeftElement>
          ) : null}
          <Input {...input_style} isInvalid={error} _placeholder={{..._placeholder}} {...rest} />
          {rightAddon ? <InputRightElement>{rightAddon}</InputRightElement> : null}
        </InputGroup>
      </HStack>
      <ErrorTextFadeIn error={error} errorSize={rest.errorSize || {base: '10px', md: '14px'}} />
    </FormControl>
  );
};

const TITLES = ['Mr.', 'Mrs.', 'Miss'];
