import React, {useState} from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Flex,
  Text,
  Box,
  Image,
  Center,
  Textarea,
  useToast,
  HStack,
  Stack,
} from '@chakra-ui/react';
import processingLoader from '../../images/processing-transaction.gif';
import successfulLoader from '../../images/successful-transaction.gif';
import {CloseIcon} from '@chakra-ui/icons';
import {Button} from '/src/ui-lib';
import {useMutation} from 'react-query';
import UploadImages from '../uploadImages';
import {scrollBarStyles} from '../common/ScrollBarStyles';
import {reportABug} from '../../api/navbarMenu';

export const ReportBug = ({reportBugModal, onDrawerOpen}) => {
  const [message, setMessage] = useState('');
  const toast = useToast();
  const [document, setDocument] = useState([]);

  const reportMutation = useMutation(reportABug, {
    onSuccess: async res => {},
    onError: err => {
      toast({
        title: 'Oops...',
        description: `${
          err?.response?.data?.message ??
          err?.response?.message ??
          err?.response?.data[0] ??
          'Something went wrong'
        }`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleSubmit = () => {
    if (!isValid)
      return toast({
        description: `Please leave a comment`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    const image = document.map(item => item?.image.replace('data:', '').replace(/^.+,/, ''));
    const body = {image, message, error: ''};
    return reportMutation.mutate(body);
  };

  const handleResetModal = () => {
    setMessage('');
    setDocument([]);
    reportMutation.reset();
    reportBugModal.onClose();
  };

  const isValid = !!message.trim();

  return (
    <Drawer
      autoFocus={false}
      isCentered
      onCloseComplete={handleResetModal}
      blockScrollOnMount={true}
      onClose={reportBugModal?.onClose}
      isOpen={reportBugModal?.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: '0', md: '24px !important'}}
        right={{base: '0', md: '24px !important'}}
        w="full"
        h={'full'}
        px={0}
        maxW={{base: '100vw', md: '475px'}}
        maxH={'475px'}
        bg={'card_bg'}
        boxShadow={{base: 'none', md: 'md'}}
      >
        <Box>
          <Box
            py="16px"
            px="32px"
            borderBottom="1px solid"
            borderColor={`matador_border_color.100`}
          >
            <Box>
              <Flex direction="row" justify="space-between" align={'center'}>
                <Text className="heading-text-regular" color={'text'} fontSize={'24px'}>
                  Report a bug
                </Text>
                <CloseIcon
                  color={'text'}
                  cursor="pointer"
                  fontSize="17px"
                  onClick={reportBugModal?.onClose}
                />
              </Flex>
            </Box>
          </Box>

          {/* <MobileHeader onDrawerClose={reportBugModal.onClose} activePage={'Report a Bug'} onDrawerOpen={onDrawerOpen} /> */}

          <Box overflowY={'auto'} css={scrollBarStyles} px={2}>
            {reportMutation.isSuccess ? (
              <Center
                px="30px"
                mt="5px"
                w="full"
                h="full"
                flexDirection={'column'}
                textAlign={'center'}
              >
                <Image alt="success" w="150px" h="150px" src={successfulLoader.src} mx="auto" />
                <Text
                  color={'text'}
                  fontWeight={500}
                  fontSize={'28px'}
                  my="25px"
                  className="heading-text-regular"
                >
                  Thank you
                </Text>
                <Text color={'text'} fontSize={'16px'} fontWeight="400">
                  Our technical team will review and get back to you as soon as possible
                </Text>
                <Button
                  fontWeight="500"
                  disabled={reportMutation.isLoading}
                  loading={reportMutation.isLoading}
                  onClick={handleResetModal}
                  w="full"
                  align="right"
                  color="custom_color.contrast"
                  bg="custom_color.color"
                  mt="50px"
                >
                  OK
                </Button>
              </Center>
            ) : reportMutation.isLoading ? (
              <Center mt="5px" w="full" h="full" flexDirection={'column'}>
                <Image alt="success" w="150px" h="150px" src={processingLoader.src} mx="auto" />
                <Text
                  color={'text'}
                  fontWeight={500}
                  fontSize={'28px'}
                  my="25px"
                  className="heading-text-regular"
                >
                  Sending feedback
                </Text>
                <Text color={'text'} fontSize={'16px'} fontWeight="400">
                  Wait a moment
                </Text>
              </Center>
            ) : (
              <Stack p={4}>
                <Text fontSize={{base: '12px', md: '14px'}} fontWeight={500} color="text">
                  Describe your experience
                </Text>
                <Textarea
                  color={'text'}
                  onChange={e => setMessage(e.target.value)}
                  value={message}
                  resize="none"
                  border="0.3px solid "
                  borderColor={`matador_border_color.100`}
                  bg={`matador_background.100`}
                  borderRadius={'5px'}
                  w="full"
                  h="105px"
                  _focus={{
                    outline: '.3px solid ',
                    outlineColor: 'matador_text.400',
                  }}
                  rounded={0}
                />

                <Text
                  color={'text'}
                  fontSize={{base: '12px', md: '14px'}}
                  fontWeight={500}
                  mt="29px"
                >
                  Upload Image
                </Text>
                <UploadImages
                  maxFiles={5}
                  id="document"
                  name="document"
                  files={document}
                  setFiles={setDocument}
                  lable={'Upload image'}
                  message="Upload image"
                  border={'0.3px solid'}
                  w="full"
                  h="80px"
                  mt={0}
                  borderColor={`matador_border_color.100`}
                  bg={`matador_background.100`}
                />

                <Flex justify={'flex-end'} alignSelf={'flex-end'} align={'center'} w="full">
                  <Button
                    h="45px"
                    fontWeight="500"
                    isDisabled={!message}
                    loading={reportMutation.isLoading}
                    onClick={handleSubmit}
                    w="full"
                    align="right"
                    color="custom_color.contrast"
                    bg="custom_color.color"
                    mt="30px"
                    fontSize={'14px'}
                  >
                    Submit
                  </Button>
                </Flex>
              </Stack>
            )}
          </Box>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default ReportBug;
