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
import {suggestAFeature} from '../../api/navbarMenu';
import {Button} from '/src/ui-lib';
import {useMutation} from 'react-query';
import {scrollBarStyles} from '../common/ScrollBarStyles';
import UploadImages from '../uploadImages';

export const SuggestIdea = ({suggestModal, onDrawerOpen}) => {
  const [message, setMessage] = useState('');
  const toast = useToast();
  const [document, setDocument] = useState([]);

  const suggestMutation = useMutation(suggestAFeature, {
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
    return suggestMutation.mutate(body);
  };

  const handleResetModal = () => {
    setMessage('');
    setDocument([]);
    suggestMutation.reset();
    suggestModal.onClose();
  };

  const isValid = !!message.trim();

  return (
    <Drawer
      autoFocus={false}
      isCentered
      onCloseComplete={handleResetModal}
      blockScrollOnMount={true}
      onClose={suggestModal?.onClose}
      isOpen={suggestModal?.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: '0', md: '24px !important'}}
        right={{base: '0', md: '24px !important'}}
        w="full"
        h={'full'}
        maxW={{base: '100vw', md: '475px'}}
        maxH={'490px'}
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
            <Flex direction="row" justify="space-between" align={'center'}>
              <Text className="heading-text-regular" color="text" fontSize={'24px'}>
                Suggest an idea
              </Text>
              <CloseIcon
                color="text"
                cursor="pointer"
                fontSize="17px"
                onClick={suggestModal?.onClose}
              />
            </Flex>
          </Box>
          <Box overflowY={'auto'} css={scrollBarStyles} px={2} pb={`30px`}>
            {suggestMutation.isSuccess ? (
              <Center
                px="30px"
                pb={`30px`}
                w="full"
                h="full"
                flexDirection={'column'}
                textAlign={'center'}
              >
                <Image alt="success" w="150px" h="150px" src={successfulLoader.src} mx="auto" />
                <Text
                  color="text"
                  fontWeight={500}
                  fontSize={'28px'}
                  my="25px"
                  className="heading-text-regular"
                >
                  Thank you
                </Text>
                <Text color="text" fontSize={'16px'} fontWeight="400">
                  We appreciate your contribution and we’d reach out to you if we need more clarity
                </Text>
                <Button
                  fontWeight="500"
                  disabled={suggestMutation.isLoading}
                  loading={suggestMutation.isLoading}
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
            ) : suggestMutation.isLoading ? (
              <Center w="full" h="full" flexDirection={'column'} py={`30px`}>
                <Image alt="success" w="150px" h="150px" src={processingLoader.src} mx="auto" />
                <Text
                  color="text"
                  fontWeight={500}
                  fontSize={'28px'}
                  my="25px"
                  className="heading-text-regular"
                >
                  Sending feedback
                </Text>
                <Text color="text" fontSize={'16px'} fontWeight="400">
                  Wait a moment
                </Text>
              </Center>
            ) : (
              <Stack flex={1} p={4} h="full">
                <Text fontSize={{base: '12px', md: '14px'}} fontWeight={500} color="text" mb="4px">
                  Tell us your idea
                </Text>
                <Textarea
                  color="text"
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
                    outlineColor: 'matador_text.400',
                    outline: '.3px solid ',
                  }}
                  rounded={0}
                />

                <Text
                  fontSize={{base: '12px', md: '14px'}}
                  fontWeight={500}
                  color="text"
                  mt={{base: '22px', md: '29px'}}
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
                  borderColor={`matador_border_color.100`}
                  bg={`matador_background.100`}
                />

                <Flex justify={'flex-end'} align={'center'} w="full">
                  <Button
                    fontWeight="500"
                    isDisabled={!message}
                    loading={suggestMutation.isLoading}
                    onClick={handleSubmit}
                    w="full"
                    align="right"
                    color="custom_color.contrast"
                    bg="custom_color.color"
                    mt="30px"
                    h="50px"
                    rounded="4px"
                    fontSize={{base: 12, md: 16}}
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

export default SuggestIdea;
