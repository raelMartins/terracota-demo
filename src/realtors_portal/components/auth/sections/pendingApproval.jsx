import React from 'react';
import {Flex, Image, Text, Box, Stack, Center} from '@chakra-ui/react';
import pending_approval from '/src/images/pending_approval.gif';

const PendingApproval = () => {
  return (
    <Box
      bg="card_bg"
      minH={'350px'}
      maxW="440px"
      w={`100%`}
      px={{base: `26.5px`, md: '40px'}}
      py={{base: `32px`, md: '24px'}}
      borderRadius={'2px'}
      boxShadow="0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)"
    >
      <Flex
        w="full"
        h="full"
        direction="column"
        justify={'center'}
        align="center"
        textAlign={'center'}
        gap={{base: `24px`, md: `12px`}}
      >
        <Center
          h={{base: `112px`, md: `172px`}}
          w={{base: `165px`, md: `250px`}}
          overflow={`hidden`}
        >
          <Image alt="next_image" src={pending_approval.src} />
        </Center>
        <Stack gap={`7px`}>
          <Text
            color="text"
            textAlign={'center'}
            fontWeight={600}
            fontSize={{base: `23px`, md: '28px'}}
            className="gilda-display-regular"
          >
            Approval Pending
          </Text>
          <Text
            textAlign={'center'}
            fontSize={'13px'}
            mt="0px !important"
            fontWeight={`500`}
            color="matador_text.300"
            lineHeight={`135%`}
          >
            Thank you for registering with us! We&apos;ve received your application and our team is
            currently reviewing it. We&apos;ll be in touch soon with an update.
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

export default PendingApproval;
