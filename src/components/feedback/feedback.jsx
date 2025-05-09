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
  HStack,
  useToast,
  Icon,
} from '@chakra-ui/react';
import processingLoader from '../../images/processing-transaction.gif';
import successfulLoader from '../../images/successful-transaction.gif';
import {CloseIcon} from '@chakra-ui/icons';
import {feedback, getfeedbackHistory} from '../../api/navbarMenu';
import {Button} from '/src/ui-lib';
import {useMutation, useQuery} from 'react-query';
import {MdHistory} from 'react-icons/md';
import FeedbackHistory from './feedbackHistory';
import {scrollBarStyles} from '../common/ScrollBarStyles';
import {BsArrowLeft} from 'react-icons/bs';

import terrible from '../../images/feedbacks/terrible.svg';
import bad from '../../images/feedbacks/bad.svg';
import okay from '../../images/feedbacks/okay.svg';
import good from '../../images/feedbacks/good.svg';
import awesome from '../../images/feedbacks/awesome.svg';

import terribleSelect from '../../images/feedbacks-select/terrible.svg';
import badSelect from '../../images/feedbacks-select/bad.svg';
import okaySelect from '../../images/feedbacks-select/okay.svg';
import goodSelect from '../../images/feedbacks-select/good.svg';
import awesomeSelect from '../../images/feedbacks-select/awesome.svg';
import {
  AwesomeSVG,
  BadSVG,
  GoodSVG,
  OkaySVG,
  TerribleSVG,
} from '../../images/feedbacks-select/FeedBackSVGs';

export const reactions = [
  {
    img: terrible.src,
    imgSelect: terribleSelect.src,
    icon: <TerribleSVG selected={false} />,
    iconSelect: <TerribleSVG />,
    text: 'Terrible',
  },
  {
    img: bad.src,
    imgSelect: badSelect.src,
    icon: <BadSVG selected={false} />,
    iconSelect: <BadSVG />,
    text: 'Bad',
  },
  {
    img: okay.src,
    imgSelect: okaySelect.src,
    icon: <OkaySVG selected={false} />,
    iconSelect: <OkaySVG />,
    text: 'Okay',
  },
  {
    img: good.src,
    imgSelect: goodSelect.src,
    icon: <GoodSVG selected={false} />,
    iconSelect: <GoodSVG />,
    text: 'Good',
  },
  {
    img: awesome.src,
    imgSelect: awesomeSelect.src,
    icon: <AwesomeSVG selected={false} />,
    iconSelect: <AwesomeSVG />,
    text: 'Awesome',
  },
];

export const Feedback = ({feedModal}) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [screen, setScreen] = useState('');
  const toast = useToast();
  const feedbackQuery = useQuery(['feedbackhistory'], () => getfeedbackHistory());
  const feedbackData = feedbackQuery?.data?.data?.message;

  const submitFeedback = useMutation(feedback, {
    onSuccess: async res => {
      await feedbackQuery.refetch();
    },
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
    const body = {
      feedback: message,
      rating: rating.toFixed(1),
    };
    return submitFeedback.mutate(body);
  };

  const handleResetModal = () => {
    setMessage('');
    setRating(0);
    submitFeedback.reset();
    feedModal.onClose();
  };

  const isValid = !!message.trim();

  return (
    <Drawer
      autoFocus={false}
      isCentered
      onCloseComplete={handleResetModal}
      blockScrollOnMount={true}
      onClose={feedModal?.onClose}
      isOpen={feedModal?.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent
        top="unset !important"
        bottom={{base: '0', md: '24px !important'}}
        right={{base: '0', md: '24px !important'}}
        w="full"
        h={'full'}
        // p="16px"
        maxW={{base: '100vw', md: '475px'}}
        maxH={'430px'}
        bg={'matador_background.200'}
        boxShadow={{base: 'none', md: 'md'}}
      >
        <Box>
          <Box
            pt="16px"
            px="25px"
            borderBottom={`1px solid`}
            borderColor={`matador_border_color.100`}
          >
            {screen === 'history' ? (
              <Flex direction="row" justify="space-between" align={'center'}>
                <HStack spacing={'15px'}>
                  <BsArrowLeft
                    style={{cursor: 'pointer'}}
                    onClick={() => setScreen('')}
                    size={25}
                  />
                  <Text
                    className="heading-text-regular"
                    color="text"
                    fontSize={'25px'}
                    fontWeight={500}
                  >
                    Feedback History
                  </Text>
                </HStack>
                <CloseIcon
                  color="text"
                  cursor="pointer"
                  fontSize="17px"
                  onClick={feedModal?.onClose}
                />
              </Flex>
            ) : (
              <Flex
                direction="row"
                justify="space-between"
                align={'flex-start'}
                borderBottom={`1px solid`}
                borderColor={`matador_border_color.100`}
              >
                <Text
                  className="heading-text-regular"
                  color="text"
                  fontSize={'25px'}
                  fontWeight={500}
                >
                  Feedback
                </Text>
                <HStack gap="5px">
                  {/* {feedbackData?.length && (
                    <Center
                      w="36px"
                      h="36px"
                      borderRadius={'8px'}
                      border={'0.672px solid'}
                      borderColor={'text'}
                    >
                      <Icon
                        as={MdHistory}
                        color="text"
                        fontSize={'20px'}
                        cursor="pointer"
                        onClick={() => setScreen('history')}
                      />
                    </Center>
                  )} */}
                  <CloseIcon
                    color="text"
                    cursor="pointer"
                    fontSize="17px"
                    onClick={feedModal?.onClose}
                    mt={2}
                  />
                </HStack>
              </Flex>
            )}
          </Box>
          {screen === 'history' ? (
            <FeedbackHistory setScreen={setScreen} feedbacks={feedbackData} />
          ) : (
            <Box overflowY="auto" css={scrollBarStyles}>
              {submitFeedback.isSuccess ? (
                <Center px="30px" mt="20px" w="full" flexDirection={'column'} textAlign={'center'}>
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
                    {' '}
                    We appreciate your feedback
                  </Text>
                  <Button
                    fontWeight="500"
                    disabled={submitFeedback.isLoading}
                    loading={submitFeedback.isLoading}
                    onClick={handleResetModal}
                    w="full"
                    align="right"
                    color="custom_color.contrast"
                    bg="custom_color.color"
                    mt="30px"
                  >
                    OK
                  </Button>
                </Center>
              ) : submitFeedback.isLoading ? (
                <Center mt="20px" w="full" h="300px" flexDirection={'column'}>
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
                <Box px={{base: '12px', md: '25px'}}>
                  <Box bg="card_bg" p={{base: '12px', md: '5px'}}>
                    <Flex justify={'space-between'} mt="17px">
                      {reactions.map((reaction, index) => (
                        <>
                          {rating === index + 1 ? (
                            <Center
                              onClick={() => setRating(index + 1)}
                              cursor={'pointer'}
                              // bg="#3D3D3D"
                              bg="matador_background.100"
                              // bg="transparent"
                              w="58px"
                              h="48px"
                              alignItems={'center'}
                              justifyContent={'center'}
                              key={reaction.text}
                              gap="auto"
                              flexDirection={'column'}
                              border={'1px solid'}
                              borderColor="custom_color.color"
                            >
                              {reaction.iconSelect ? (
                                reaction.iconSelect
                              ) : (
                                <Image alt="reaction" w="24px" h="24px" src={reaction.imgSelect} />
                              )}
                              <Text
                                fontSize={'10px'}
                                fontWeight={400}
                                //  color={'#fff'}
                                color="custom_color.color"
                              >
                                {reaction.text}
                              </Text>
                            </Center>
                          ) : (
                            <Center
                              onClick={() => setRating(index + 1)}
                              cursor={'pointer'}
                              bg="matador_background.100"
                              w="58px"
                              h="48px"
                              alignItems={'center'}
                              justifyContent={'center'}
                              key={reaction.text}
                              gap="auto"
                              flexDirection={'column'}
                              border={'1px solid'}
                              borderColor={`matador_border_color.100`}
                            >
                              {reaction.icon ? (
                                reaction.icon
                              ) : (
                                <Image alt="reaction" w="24px" h="24px" src={reaction.img} />
                              )}
                              <Text fontSize={'10px'} fontWeight={400} color={'matador_form.label'}>
                                {reaction.text}
                              </Text>
                            </Center>
                          )}
                        </>
                      ))}
                    </Flex>

                    <Text
                      color="text"
                      fontSize={{base: '12px', md: '14px'}}
                      fontWeight={500}
                      mb="10px"
                      mt="29px"
                    >
                      Drop a comment
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
                        outlineColor: 'matador_text.400',
                        outline: '.3px solid ',
                      }}
                      rounded={0}
                    />
                    <Flex justify={'flex-end'} align={'center'} w="full">
                      <Button
                        fontWeight="500"
                        isDisabled={!message || !rating}
                        loading={submitFeedback.isLoading}
                        onClick={handleSubmit}
                        w="full"
                        align="right"
                        color="custom_color.contrast"
                        bg="custom_color.color"
                        mt="75px"
                        h="45px"
                        fontSize="14px"
                        // rounded="5px"
                      >
                        Submit
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default Feedback;
