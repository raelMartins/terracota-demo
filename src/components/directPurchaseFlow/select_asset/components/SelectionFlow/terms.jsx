import ThreeDots from '@/components/loaders/ThreeDots';
import {PurchaseAgreementSVG} from '@/pages/listing-details/units/buyModalComponents/terms';
import {Button} from '@/ui-lib';
import {ArrowBackIcon, CloseIcon} from '@chakra-ui/icons';
import {Box, Center, Flex, HStack, Stack, Text, VStack} from '@chakra-ui/react';
import {useState} from 'react';

export const SelectionFlowTerms = ({document, setTab, handleProceed, isLoading, disclosure}) => {
  const [accepted, setAccepted] = useState(false);
  return (
    <Stack minH={`400px`} p={`16px`}>
      <Flex direction="row" justify="space-between" align={'center'} px={`8px`}>
        <HStack>
          <ArrowBackIcon
            color="text"
            fontSize={'25px'}
            onClick={() => setTab(`summary`)}
            style={{cursor: 'pointer'}}
          />
          <Text
            fontSize={{base: '23px', md: '25px'}}
            fontWeight={400}
            color="text"
            className="heading-text-regular"
          >
            Terms of Service
          </Text>
        </HStack>

        <CloseIcon
          fontWeight={600}
          alignSelf={'flex-start'}
          fontSize={'13px'}
          style={{color: '#667085', cursor: 'pointer'}}
          onClick={disclosure?.onClose}
        />
      </Flex>

      {isLoading ? (
        <Center h="300px">
          <ThreeDots boxSize={{base: `12px`, md: `16px`}} circular />
        </Center>
      ) : (
        <>
          <Box overflowY={'auto'} my="22px">
            <VStack spacing={'20px'} h="full">
              {/* <Image src={purchaseAgreement.src} /> */}
              <PurchaseAgreementSVG />
              <a href={document} target="_blank">
                <Button
                  border="1px solid !important"
                  color="custom_color.color"
                  bg="custom_color.background"
                  h="35px"
                  w="164px"
                  borderColor="custom_color.color"
                >
                  View Document
                </Button>
              </a>
              <HStack
                w="full"
                spacing="10px"
                onClick={() => setAccepted(!accepted)}
                cursor={'pointer'}
                align={'flex-start'}
              >
                <Center
                  mt="2px"
                  w="20px"
                  h="20px"
                  borderRadius={'full'}
                  border={'1px solid'}
                  borderColor="custom_color.color"
                >
                  {accepted && (
                    <Box w="12px" h="12px" borderRadius={'full'} bg="custom_color.color" />
                  )}
                </Center>
                <Text w="fit-content" fontSize={'14px'} fontWeight={300} color={'matador_text.300'}>
                  By checking this box, I acknowledge that I’ve read and accept the terms of the
                  agreement.
                </Text>
              </HStack>
            </VStack>
          </Box>
          <Flex my="20px" justify="center" align="center" gap="20px">
            <Button
              border="1px solid !important"
              color="text"
              borderColor="matador_border_color.100 !important"
              bg="matador_background.100"
              h="49px"
              w="302px"
              onClick={disclosure?.onClose}
            >
              Cancel
            </Button>
            <Button
              disabled={!accepted}
              isDisabled={!accepted}
              onClick={handleProceed}
              color="custom_color.contrast"
              w="302px"
              bg="custom_color.color"
              h="49px"
            >
              Accept & Continue
            </Button>
          </Flex>
        </>
      )}
    </Stack>
  );
};
