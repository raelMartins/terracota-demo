import React from 'react';
import {
  Box,
  VStack,
  Flex,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Modal,
  ModalOverlay,
  ModalContent,
  HStack,
  Center,
} from '@chakra-ui/react';
import {fetchCustomPlanSummary} from '../../../../api/payment';
import {useQuery} from 'react-query';
import {formatToCurrency} from '../../../../utils';
import {Spinner} from '../../../../ui-lib';
import isMobile from '../../../../utils/extras';
import {ArrowBackIcon, CloseIcon} from '@chakra-ui/icons';

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
const Breakdown = ({selectedPlan, setStep, buyModal, customScrollbarStyles, onCloseModal}) => {
  const customPlanBreakDown = useQuery(
    ['customPLansummary', selectedPlan?.id],
    () => fetchCustomPlanSummary(selectedPlan?.id),
    {
      enabled: !!selectedPlan,
    }
  );

  function getOrdinal(number) {
    if (typeof number !== 'number') {
      return ''; // Return an empty string for invalid inputs
    }

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    // Special cases for 11, 12, and 13, as they don't follow the usual pattern
    if (lastTwoDigits === 11 || lastTwoDigits === 12 || lastTwoDigits === 13) {
      return number + 'th';
    }

    // Use the appropriate suffix based on the last digit
    const suffix = suffixes[lastDigit] || 'th';

    return number + suffix;
  }

  const mainContent = (
    <Box h={'fit-content'} overflowY="auto" __css={customScrollbarStyles}>
      <Flex justify={'space-between'} align={'center'}>
        <HStack spacing="12px" onClick={() => setStep('summary')} cursor="pointer">
          <ArrowBackIcon fontSize={'25px'} cursor="pointer" color="text" />
          <Text
            className="heading-text-regular"
            fontSize={{base: '23px', md: '28px'}}
            fontWeight={400}
          >
            Payment Breakdown
          </Text>
        </HStack>
        <CloseIcon fontSize={'15px'} cursor="pointer" color="text" onClick={buyModal?.onClose} />
      </Flex>

      <VStack
        mt="20px"
        w="full"
        gap={'12px'}
        maxH="50vh"
        overflowY="auto"
        __css={customScrollbarStyles}
        h="fit-content"
      >
        <Flex
          w="full"
          mt="0px"
          direction="column"
          py="23px"
          bg="background"
          px="15px"
          align={'center'}
          justify={'center'}
          borderRadius={'5px'}
          border="1px solid"
          borderColor={'matador_border_color.100'}
        >
          <Text color="text" fontSize={'13px'} fontWeight={500}>
            Initial Deposit
          </Text>
          <Text color="text" fontSize={'19x'} fontWeight={500}>
            {formatToCurrency(selectedPlan?.initial_deposit_in_value)}
          </Text>
        </Flex>
        {customPlanBreakDown?.isLoading ? (
          <Center w="full" h="full">
            <Spinner noAbsolute />
          </Center>
        ) : (
          <>
            {customPlanBreakDown.data?.data?.data?.map((item, idx) => (
              <Flex
                key={idx}
                w="full"
                direction="column"
                mt="20px"
                py="23px"
                bg="background"
                px="15px"
                align={'center'}
                justify={'center'}
                borderRadius={'2px'}
                border="1px solid"
                borderColor={'matador_border_color.100'}
                position={'relative'}
              >
                <Box position={'absolute'} p="2.316px 4.631px" bg="tag_bg" top={0} right={0}>
                  <Text fontSize={'10px'} fontWeight={400} color={'matador_form.label'}>
                    {`Due After ${item?.period_in_months} month${
                      Number(item?.period_in_months) === 1 ? '' : 's'
                    }`}
                  </Text>
                </Box>

                <Text color="text" fontSize={'13px'} fontWeight={500}>
                  {getOrdinal(idx + 1)} payment
                </Text>
                <Text color="text" fontSize={'19x'} fontWeight={500}>
                  {item?.amount ? formatToCurrency(item?.amount) : '-'}
                </Text>
              </Flex>
            ))}
          </>
        )}
      </VStack>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          autoFocus={false}
          onCloseComplete={onCloseModal}
          isCentered
          onClose={buyModal?.onClose}
          isOpen={buyModal?.isOpen}
          placement="bottom"
        >
          <DrawerOverlay />
          <DrawerContent
            bg="card_bg"
            color={`text`}
            maxW="430px"
            px={{base: '15px', md: '32px'}}
            minH="518px"
            py={{base: '28px', md: '38px'}}
            // borderTopRadius={{base: '10px', md: '16px'}}
          >
            {mainContent}
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          autoFocus={false}
          onCloseComplete={onCloseModal}
          isCentered
          onClose={buyModal?.onClose}
          isOpen={buyModal?.isOpen}
        >
          <ModalOverlay />
          <ModalContent
            bg="card_bg"
            color={`text`}
            maxW="434px"
            px={{base: '15px', md: '32px'}}
            minH="318px"
            py={{base: '28px', md: '38px'}}
            borderRadius={0}
          >
            {mainContent}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Breakdown;
