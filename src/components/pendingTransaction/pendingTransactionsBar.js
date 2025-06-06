import {HStack, Image, Text, useDisclosure, Box, VStack} from '@chakra-ui/react';
import React, {useState} from 'react';
import cancelICon from '/src/images/icons/closeIcon.svg';
import {useQuery} from 'react-query';
import DrawerForPendingTransaction from '../pendingTransactions';
import {Button} from '/src/ui-lib';
import {CloseIcon} from '@chakra-ui/icons';
import {fetchUserEquity} from '../../api/listing';
import {PendingTransactionBarSVG} from '../assets/svgs';
import {appCurrentTheme} from '../../utils/localStorage';
import {LIGHT} from '../../constants/names';

export const PendingTransactionsBar = () => {
  const [willDisplay, setWillDisplay] = useState(true);
  const pendingQuery = useQuery(['fetchUserEquity', 'PENDING'], () => fetchUserEquity('PENDING'), {
    refetchOnMount: true,
  });
  const assetData = pendingQuery?.data?.data?.results;

  const drawerDisclosure = useDisclosure();
  return (
    <Box w="full">
      {assetData?.length ? (
        <>
          {willDisplay && (
            <HStack
              w="85%"
              bg={appCurrentTheme === LIGHT ? '#101010' : 'matador_background.200'}
              mx="auto"
              boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
              justify="space-between"
              p={{base: '16px', md: '12px'}}
              minH={{base: '48px', md: '72px'}}
              mb={{base: '8px', md: '15px'}}
            >
              <HStack w="85%" spacing={{base: '3px', md: '16px'}}>
                <HStack p={{base: '4px', md: '10px'}} justify="center" align="center">
                  {/* <Image boxSize={{base: '24px', md: '40px'}} src={pendingTransaction.src} /> */}
                  <PendingTransactionBarSVG boxSize={{base: '24px', md: '40px'}} />
                </HStack>

                <VStack color="#FBFCFC" align={'flex-start'} spacing={0}>
                  <Text fontSize={{base: '12px', md: '16px'}} fontWeight={{base: 500, md: 600}}>
                    {`You have ${assetData?.length} pending transaction${
                      assetData?.length > 1 ? 's' : ''
                    }.`}
                  </Text>
                  <Text fontSize={{base: '11px', md: '14px'}} fontWeight={300}>
                    Kindly proceed to make payment.
                  </Text>
                </VStack>
              </HStack>
              <HStack spacing={{base: '8px', md: '18px'}} pr="4px">
                <Button
                  color="custom_color.contrast"
                  bg="custom_color.color"
                  onClick={drawerDisclosure.onOpen}
                  h={{base: '23px', md: '44px'}}
                  w={{base: '47px', md: '75px'}}
                  _hover={{opacity: 1}}
                  _active={{opacity: 1}}
                  fontSize={{base: '13px', md: 'unset'}}
                  fontWeight={{base: '500', md: 'unset'}}
                  px="32px"
                  py="13px"
                >
                  View
                </Button>
                <CloseIcon
                  display={{base: 'none', md: 'block'}}
                  fontSize="11px"
                  color="#FBFCFC"
                  onClick={() => setWillDisplay(false)}
                  cursor="pointer"
                  src={cancelICon.src}
                />
              </HStack>
            </HStack>
          )}
          <DrawerForPendingTransaction
            refetch={pendingQuery?.refetch}
            assetData={assetData}
            isLoading={pendingQuery?.assetLoading}
            isOpen={drawerDisclosure.isOpen}
            drawer={drawerDisclosure}
            isError={pendingQuery?.isError}
          />
        </>
      ) : null}
    </Box>
  );
};

export default PendingTransactionsBar;
