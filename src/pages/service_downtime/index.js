import { Heading, Stack, Text, VStack } from '@chakra-ui/react';

export const ServiceDowntime = () => {
  return (
    <Stack
      w="full"
      maxW="1400px"
      justify={'center'}
      align="center"
      h="fit-content"
      minH='100vh'
      mx="auto"
    >
      <Stack width={{base:'90%',lg:"538px"}} justify="center" alignItems="flex-start" mx="auto">
        <Heading
          w={{base:'fit-content',lg:"289px"}}
          color="#424242"
          textEdge="cap"
          pl={3}
          fontSize={{base:'26px',lg:"28px"}}
          fontWeight="500"
          lineHeight="30px"
          leadingTrim="both"
          textAlign="center"
          fontStyle="normal"
          letterSpacing="-1.12px"
          fontFamily="Euclid Circular B"
          borderLeft={'4px solid #FF6A6A'}
        >
          Deployment Disabled
        </Heading>

        <VStack
          my="28px"
          gap="24px"
          padding="24px"
          display="flex"
          alignSelf="stretch"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          border="1px solid #D6D6D6"
          w={{base: '90%', lg: '490px'}}
        >
          <Text
            color="#525252"
            fontSize={{base:'16px', lg:"20px"}}
            fontStyle="normal"
            fontWeight="400"
            lineHeight="normal"
            textTransform={'uppercase'}
            fontFamily="Euclid Circular B"
          >
            <b>402:</b> WEBPAGE_NOT_FOUND
          </Text>

          <Text
            color="#525252"
            fontSize={{base:'16px', lg:"20px"}}
            fontWeight="400"
            fontStyle="normal"
            lineHeight="normal"
            fontFamily="Euclid Circular B"
          >
            {`Code: ‘DEPLOYMENT_DISABLED’`}
          </Text>
          <Text
            color="#525252"
            fontSize={{base:'16px', lg:"20px"}}
            fontWeight="400"
            fontStyle="normal"
            lineHeight="normal"
            fontFamily="Euclid Circular B"
          >
            {`ID: ‘cdg1:fg:-dfvgfds-1034555-3345rfgd’`}
          </Text>
        </VStack>
        <Text
          color="#525252"
          fontSize={{base:'14px', lg:"18px"}}
          fontStyle="normal"
          fontWeight="400"
          lineHeight="normal"
          fontFamily="Euclid Circular B"
        >{`- If you’re a visitor, contact the website owner or try again later.`}</Text>
      </Stack>
    </Stack>
  );
};

export default ServiceDowntime;
