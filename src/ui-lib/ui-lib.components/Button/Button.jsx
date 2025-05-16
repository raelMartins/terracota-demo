import {Button as ChakraButton, Text} from '@chakra-ui/react';
import {motion} from 'framer-motion';

export const Button = ({variation, hoverEffect = true, clickEffect = true, children, ...rest}) => {
  switch (variation) {
    case 'primary':
      return (
        <ChakraButton
          w={`max-content`}
          p={`14px`}
          h={`max-content`}
          fontSize={'16px'}
          fontWeight="500"
          border={'1px solid'}
          color="custom_color.contrast"
          borderColor={`custom_color.color`}
          bg={`custom_color.color`}
          transition="ease-in-out 0.3s"
          _hover={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _active={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _focus={{opacity: rest.isDisabled ? 'auto' : '1'}}
          borderRadius={0}
          as={motion.button}
          whileTap={{scale: clickEffect ? 0.9 : 1}}
          whileHover={{scale: hoverEffect ? 1.04 : 1}}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
    case 'secondary':
      return (
        <ChakraButton
          w={`max-content`}
          p={`14px`}
          h={`max-content`}
          fontSize={'16px'}
          fontWeight="500"
          border={'1px solid'}
          color="custom_color.color"
          bg={`custom_color.background`}
          transition="ease-in-out 0.3s"
          _hover={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _active={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _focus={{opacity: rest.isDisabled ? 'auto' : '1'}}
          borderRadius={0}
          as={motion.button}
          whileTap={{scale: clickEffect ? 0.9 : 1}}
          whileHover={{scale: hoverEffect ? 1.04 : 1}}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
    case 'tertiary':
      return (
        <ChakraButton
          w={`max-content`}
          p={`14px`}
          h={`max-content`}
          fontSize={'16px'}
          fontWeight="500"
          border={'1px solid'}
          borderColor={`matador_border_color.100`}
          color="text"
          bg={`matador_background.100`}
          transition="ease-in-out 0.3s"
          _hover={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _active={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _focus={{opacity: rest.isDisabled ? 'auto' : '1'}}
          borderRadius={0}
          as={motion.button}
          whileTap={{scale: clickEffect ? 0.9 : 1}}
          whileHover={{scale: hoverEffect ? 1.04 : 1}}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
    case 'type-4':
      return (
        <ChakraButton
          w={`max-content`}
          p={`14px`}
          h={`max-content`}
          fontSize={'16px'}
          fontWeight="500"
          border={'1px solid'}
          borderColor={`matador_border_color.100`}
          color="text"
          bg={`matador_background.200`}
          transition="ease-in-out 0.3s"
          _hover={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _active={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _focus={{opacity: rest.isDisabled ? 'auto' : '1'}}
          borderRadius={0}
          as={motion.button}
          whileTap={{scale: clickEffect ? 0.9 : 1}}
          whileHover={{scale: hoverEffect ? 1.04 : 1}}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
    default:
      return (
        <ChakraButton
          borderRadius={0}
          fontWeight={500}
          as={motion.button}
          whileTap={{scale: clickEffect ? 0.9 : 1}}
          whileHover={{scale: hoverEffect ? 1.04 : 1}}
          _hover={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _active={{opacity: rest.isDisabled ? 'auto' : '1'}}
          _focus={{opacity: rest.isDisabled ? 'auto' : '1'}}
          {...rest}
        >
          {children}
        </ChakraButton>
      );
  }
};
