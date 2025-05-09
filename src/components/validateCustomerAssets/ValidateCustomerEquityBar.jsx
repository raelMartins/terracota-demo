import {HStack, Image, VStack, Text, useDisclosure, Box} from '@chakra-ui/react';
import React, {useState} from 'react';
import homeIcon from '../../images/icons/validateAssetHomeIcon.svg';
import {useQuery} from 'react-query';
import {Button} from '/src/ui-lib';
import {CloseIcon} from '@chakra-ui/icons';
import cancelICon from '/src/images/icons/closeIcon.svg';
import {fetchForCustomerEquityValidation} from '../../api/listing';
import DrawerForValidateCustomerEquity from './index';
import {ValidateAssetHomeIcon} from '../assets/svgs';
import useLocalStorage from '../../utils/hooks/useLocalStorage';
import {BUSINESS_ID} from '../../constants/routes';
import {appCurrentTheme} from '../../utils/localStorage';
import {LIGHT} from '../../constants/names';

const ValidateCustomerEquityBar = () => {
  const [willDisplay, setWillDisplay] = useState(true);
  // const [business_id] = useLocalStorage('businessId');

  const fetchcustomeQuery = useQuery(
    ['fetchcustomervalidationEquity'],
    () => fetchForCustomerEquityValidation(),
    {refetchOnMount: true}
  );
  const datasToUse = fetchcustomeQuery?.data?.data?.all_pending_requests;

  const drawerDisclosure = useDisclosure();

  return (
    <Box w="full">
      {datasToUse?.length ? (
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
              <HStack w="80%" spacing={{base: '3px', md: '16px'}}>
                <HStack p={{base: '4px', md: '10px'}} justify="center" align="center">
                  {/* <Image alt="" boxSize={{base: '24px', md: '40px'}} src={homeIcon.src} /> */}
                  <ValidateAssetHomeIcon boxSize={{base: '24px', md: '40px'}} />
                </HStack>

                <VStack color="#FBFCFC" align={'flex-start'} spacing={0}>
                  <Text fontSize={{base: '12px', md: '16px'}} fontWeight={{base: 500, md: 600}}>
                    Welcome Onboard
                  </Text>
                  <Text fontSize={{base: '11px', md: '14px'}} fontWeight={300}>
                    We need you to validate a transaction.
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing={{base: '8px', md: '18px'}} pr="4px">
                <Button
                  color="custom_color.contrast"
                  bg="custom_color.color"
                  onClick={drawerDisclosure.onOpen}
                  _hover={{opacity: 1}}
                  _active={{opacity: 1}}
                  boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                  h={{base: '23px', md: '44px'}}
                  w={{base: '47px', md: '75px'}}
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
          <DrawerForValidateCustomerEquity
            equitiesData={datasToUse}
            drawer={drawerDisclosure}
            refetch={fetchcustomeQuery?.refetch}
            isLoading={fetchcustomeQuery?.isLoading}
          />
        </>
      ) : null}
    </Box>
  );
};

export default ValidateCustomerEquityBar;
