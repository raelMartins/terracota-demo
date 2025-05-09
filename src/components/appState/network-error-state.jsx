import {Button, Center, Image, Text, VStack} from '@chakra-ui/react';
import React from 'react';
import empty from '../../images/icons/empty-icon.svg';

export const NetworkErrorState = ({text, height, ...rest}) => {
  const handle_reload = () => {
    location.reload();
  };
  return (
    <Center minH={`300px`} p={`12px`} w="full" {...rest}>
      <VStack gap={`12px`} color={`matador_text.200`}>
        <Text textTransform={`uppercase`} fontWeight={`500`} className="heading-text-regular">
          POOR CONNECTION
        </Text>
        <Text
          fontWeight="400"
          color="matador_form.label"
          fontSize="12px"
          textAlign="center"
          className="sub-text-regular"
        >
          Please check your internet connection. Ensure you&apos;re connected to a stable network.
        </Text>
        <Button
          bg={`matador_background.200`}
          border={`1px solid`}
          borderColor={`matador_border_color.100`}
          color={`text`}
          _hover={{opacity: `1`}}
          _active={{opacity: `1`}}
          fontSize={`12px`}
          fontWeight={`400`}
          h={`max-content`}
          textTransform={`uppercase`}
          p={`12px 20px`}
          borderRadius={`none`}
          className="heading-text-regular"
          onClick={handle_reload}
        >
          Refresh Page
        </Button>
      </VStack>
    </Center>
  );
};
