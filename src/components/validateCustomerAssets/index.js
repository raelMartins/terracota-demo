import {useEffect, useState} from 'react';
import {
  DrawerContent,
  Flex,
  Box,
  Text,
  Drawer,
  DrawerOverlay,
  HStack,
  DrawerHeader,
} from '@chakra-ui/react';
import Summary from './summary';
import ConfirmValidate from './confirmValidate';
import Dispute from './dispute';
import AssetsList from './assetsList';
import {ChevronLeftIcon, CloseIcon} from '@chakra-ui/icons';
import isMobile from '../../utils/extras';

export const ValidateCustomerEquity = ({equitiesData, drawer, refetch, isLoading}) => {
  const [type, setType] = useState('list');
  const [equityData, setEquityData] = useState(null);

  useEffect(() => {
    setEquityData(equitiesData?.[0]);
  }, [equitiesData]);

  const customScrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '4px',
      borderRadius: '16px',
    },
    '&::-webkit-scrollbar-track': {
      borderRadius: '16px',
      WebkitBoxShadow: 'inset 0 0 6px rgba(255, 255, 255, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      // outline: "1px solid slategrey", // You can include this line if needed
    },
  };

  const handleClose = () => {
    setType('list');
  };

  const validationRequestArray = equityData?.validation_requests || [];
  const validation_requestsId = validationRequestArray?.[validationRequestArray?.length - 1]?.id;

  return (
    <Drawer
      onCloseComplete={handleClose}
      blockScrollOnMount
      scrollBehavior="inside"
      onClose={drawer?.onClose}
      isOpen={drawer?.isOpen}
      placement={isMobile ? 'bottom' : 'right'}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: 'unset', md: '24px !important'}}
        right={{base: 'unset', md: '24px !important'}}
        w="full"
        bg="matador_background.200"
        px="0"
        position={'relative'}
        maxW={{base: '100vw', md: '450px'}}
      >
        <DrawerHeader
          px={{base: '14px', md: '18px'}}
          py={{base: '18px', md: '26px'}}
          // position={'absolute'}
          // top="0"
          // right={0}
          w="full"
          zIndex={200}
          borderBottom={`1px solid`}
          borderColor={`matador_border_color.100 !important`}
        >
          <Flex w="full" h="20px" justify={'space-between'} align={'center'}>
            {type === 'dispute' ? (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={() => setType('summary')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Dispute
                </Text>
              </HStack>
            ) : type === 'validate' ? (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={() => setType('summary')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Validate
                </Text>
              </HStack>
            ) : type === 'summary' ? (
              <HStack align={'center'}>
                <ChevronLeftIcon
                  cursor={'pointer'}
                  onClick={() => setType('list')}
                  fontSize={'35px'}
                  color={'text'}
                />
                <Text
                  color="text"
                  fontSize={'23px'}
                  fontWeight={400}
                  className="heading-text-regular"
                >
                  Transaction Validation
                </Text>
              </HStack>
            ) : (
              <Text
                color="text"
                fontSize={'23px'}
                fontWeight={400}
                className="heading-text-regular"
              >
                Validate Transaction
              </Text>
            )}
            <CloseIcon
              cursor={'pointer'}
              fontSize={'14px'}
              color="text"
              onClick={drawer?.onClose}
            />
          </Flex>
        </DrawerHeader>

        {/* <Box w="full" h={'fit-content'} overflowY="auto"> */}
        <Flex
          flexDir={`column`}
          w="full"
          maxH={'75vh'}
          minH={'30vh'}
          // overflowY={`auto`}
          px={{base: '18px', md: '24px'}}
          pt={`10px`}
          pb={`30px`}
        >
          {type === 'summary' ? (
            <Summary
              equityData={equityData}
              setType={setType}
              customScrollbarStyles={customScrollbarStyles}
            />
          ) : type === 'validate' ? (
            <ConfirmValidate
              refetch={refetch}
              validation_requestsId={validation_requestsId}
              equityData={equityData}
              setType={setType}
              customScrollbarStyles={customScrollbarStyles}
            />
          ) : type === 'dispute' ? (
            <Dispute
              drawer={drawer}
              equityData={equityData}
              setType={setType}
              validation_requestsId={validation_requestsId}
              customScrollbarStyles={customScrollbarStyles}
            />
          ) : (
            <AssetsList
              drawer={drawer}
              setType={setType}
              isLoading={isLoading}
              equityData={equityData}
              equitiesData={equitiesData}
              setEquityData={setEquityData}
              validation_requestsId={validation_requestsId}
              customScrollbarStyles={customScrollbarStyles}
            />
          )}
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default ValidateCustomerEquity;
