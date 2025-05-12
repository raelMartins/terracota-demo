import {Box, Flex, HStack, Show, SimpleGrid, Stack, Text} from '@chakra-ui/react';
import React from 'react';

const AssetInfoWrapper = ({
  useTabs = false,
  displayTab,
  handleDisplaySwitch,
  children,
  ...rest
}) => {
  return (
    <Box maxW={{base: '700px', xl: 'initial'}} w={{base: 'full', xl: 'full'}}>
      {useTabs && (
        <HStack
          h="54px"
          //   mb="36px"
          mx="24px"
          bg="matador_background.200"
          p="8px"
          align="center"
          spacing="9px"
          justify="space-between"
          position="relative"
          display={{base: 'flex', xl: 'none'}}
        >
          <HStack
            onClick={handleDisplaySwitch('transaction')}
            h="full"
            justify="center"
            w="full"
            role="button"
            bg={displayTab === 'transaction' ? 'custom_color.color' : 'transparent'}
          >
            <Text
              fontSize="16px"
              textAlign="center"
              fontWeight="400"
              color={displayTab === 'transaction' ? 'custom_color.contrast' : 'text'}
            >
              TRANSACTION
            </Text>
          </HStack>
          <HStack
            onClick={handleDisplaySwitch('overview')}
            justify="center"
            h="full"
            w="full"
            role="button"
            bg={displayTab === 'overview' ? 'custom_color.color' : 'transparent'}
          >
            <Text
              fontSize="16px"
              textAlign="center"
              fontWeight="400"
              color={displayTab === 'overview' ? 'custom_color.contrast' : 'text'}
            >
              OVERVIEW
            </Text>
          </HStack>
        </HStack>
      )}

      <Flex
        w="full"
        gap="24px"
        wrap={{base: 'wrap', xl: 'nowrap'}}
        position="relative"
        px={{base: '24px'}}
        mx="auto"
        maxW="1259.66px"
        h={`max-content`}
        // maxH={`80vh`}
        pt={{base: '0px', xl: '23px'}}
        {...rest}
      >
        {children}
      </Flex>
    </Box>
  );
};

export default AssetInfoWrapper;
