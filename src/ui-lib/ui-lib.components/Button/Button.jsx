import {Button as ChakraButton, Text} from '@chakra-ui/react';
import {motion} from 'framer-motion';

export const Button = ({hoverEffect = true, clickEffect = true, children, ...rest}) => {
  return (
    <ChakraButton
      borderRadius={0}
      fontWeight={500}
      as={motion.button}
      whileTap={{scale: clickEffect ? 0.9 : 1}}
      whileHover={{scale: hoverEffect ? 1.04 : 1}}
      _hover={{opacity: rest.isDisabled ? `auto` : `1`}}
      _focus={{opacity: rest.isDisabled ? `auto` : `1`}}
      _active={{opacity: rest.isDisabled ? `auto` : `1`}}
      {...rest}
    >
      {children}
    </ChakraButton>
  );
};
