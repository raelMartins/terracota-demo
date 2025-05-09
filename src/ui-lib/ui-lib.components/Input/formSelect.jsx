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
  Select,
} from '@chakra-ui/react';
import {themeStyles} from '../../../theme';

export const FormSelect = ({label, value, options, leftAddon, rightAddon, error, ...rest}) => {
  return (
    <FormControl {...themeStyles.textStyles.sl5}>
      <Text fontSize={'13px'} color="matador_text.500" fontWeight={500}>
        {label}
      </Text>
      <InputGroup borderColor={'text'}>
        {leftAddon ? <InputLeftElement ml="2">{leftAddon}</InputLeftElement> : null}
        <Select
          borderRadius={0}
          color="text"
          h={'44px'}
          fontSize={'13px'}
          value={value}
          {...rest}
          isInvalid={error}
          _focus={{
            border: error ? '0.5px solid red !important' : `0.5px solid #747474 !important`,
          }}
          _hover={{
            border: error ? '0.5px solid red !important' : `0.5px solid #747474 !important`,
          }}
          _focusVisible={{
            border: error ? '0.5px red solid !important' : `0.5px solid #747474 !important`,
          }}
          fontWeight={500}
        >
          {(options || []).map(option => (
            <option value={option} key={option} selected={value === option ? 'selected' : ``}>
              {option}
            </option>
          ))}
        </Select>
        {rightAddon ? <InputRightElement>{rightAddon}</InputRightElement> : null}
      </InputGroup>
      <SlideFade in={error} offsetY="10px">
        <Text color={themeStyles.color.matador__red} my={'5px'} fontSize={'14px'}>
          {error}
        </Text>
      </SlideFade>
    </FormControl>
  );
};
