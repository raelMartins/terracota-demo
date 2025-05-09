import React, {useState} from 'react';

import {
  AbsoluteCenter,
  Button,
  Center,
  HStack,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import bgForAuth from '/src/images/bg_pattern_store.svg';
import checkIcon from '/src/images/successful-transaction.gif';

import {useMutation, useQuery} from 'react-query';
import {useRouter} from 'next/router';
import {
  fetchInspectionFeedbaackDetails,
  giveInspectionFeedbackForEmail,
} from '../../api/navbarMenu';
import {Ratings} from '../../utils/ratings';
import {LayoutView} from '../../components/page_layout';

const FeedBackInspection = props => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState();
  const defaultScreen = props.isSuccess == 'true' ? 'success' : 'feedback';
  const [feedBackScreen, setFeedScreen] = useState(defaultScreen);

  const router = useRouter();
  const toast = useToast();

  const {data, isLoading, isError, error, refetch} = useQuery(
    [' inspection feeedback detail from email', props.slug],
    () => fetchInspectionFeedbaackDetails(props.slug)
  );

  const Inspectioninfo = data?.data?.data?.[0];

  const feedbackMutation = useMutation(
    formData => giveInspectionFeedbackForEmail(formData, props.slug),
    {
      onSuccess: res => {
        refetch();
        const mergedQuery = {
          ...router.query,
          isSuccess: true,
        };
        setFeedScreen('success');
        router.push({
          pathname: router.pathname,
          query: {
            ...mergedQuery,
          },
        });
      },
      onError: err => {
        toastForError(err, true, toast);
      },
    }
  );

  const handleMessage = e => {
    return setMessage(e.target.value);
  };
  const handleSubmit = () => {
    const body = {
      feedback: message,
      rating: rating.toFixed(1),
    };

    return feedbackMutation.mutate(body);
  };
  const isValid = !!message.trim() && rating >= 0;

  return (
    <LayoutView bg="transparent" onLogin noIcons={true} noPadding={true}>
      {/* <HStack
        zIndex="222"
        cursor="pointer"
        position="fixed"
        top="2vh"
        right="2vw"
        align="center"
        onClick={modalDisclosure.onOpen}
        justify="center"
      >
        <Icon as={RxHamburgerMenu} h="33px" w="33px" />
      </HStack> */}
      {/* <Image
        src={bgForAuth.src}
        loading="eager"
        top={{base: '-63px', md: '-70px'}}
        w={'100vw'}
        minH={'100vh'}
        opacity={'0.8'}
        alt="background"
        position="absolute"
      /> */}
      {isLoading ? (
        <AbsoluteCenter>
          <Spinner boxSize="72px" />
        </AbsoluteCenter>
      ) : isError && error?.response?.status !== 409 ? (
        <></>
      ) : // feedBackScreen === 'feedback'
      (router.query.isSuccess !== 'true' || feedBackScreen === 'feedback') &&
        error?.response?.status !== 409 ? (
        <Center h={`80vh`} position="relative" zIndex="2">
          <Stack gap="24px">
            <Heading
              textAlign={{base: 'center', md: 'start'}}
              w="full"
              fontSize="28px"
              color="text"
              fontWeight="700"
            >
              Inspection Feedback
            </Heading>
            <Stack
              // px="72px"
              // w="500px"
              // pt="25px"
              // pb="27px"
              padding={{base: '24px', md: '32px 85px'}}
              width={{base: '350px', md: '600px'}}
              border="1px solid rgba(145, 145, 145, 0.30)"
              borderRadius={{base: `6px`, md: '20px'}}
              bg="matador_background.200"
              transition={'.3s'}
            >
              <Stack
                w="full"
                spacing="none"
                // pb="10px"
                // pt="7px"
                bg="transparent"
              >
                <Stack w="full" spacing="19px">
                  <Text textAlign="start" w="full" fontSize="24px" color="text" fontWeight="600">
                    {Inspectioninfo?.project?.name}
                  </Text>
                  {/* <Image
                    src={Inspectioninfo?.project?.photos?.[0]?.photo}
                    borderRadius="3.78px"
                    bg="matador_background.100"
                    h="196px"
                    alt="proect image"
                    objectFit="cover"
                    w="full"
                  /> */}
                  <Text textAlign="start" w="full" fontSize="18px" color="text" fontWeight="400">
                    How was your inspection?
                  </Text>
                  <Ratings mb={`0px`} setRating={setRating} rating={rating} />
                  <Stack gap={`14px`}>
                    <Text
                      textAlign="start"
                      w="full"
                      as="label"
                      htmlFor="message"
                      fontSize="18px"
                      color="text"
                      fontWeight="400"
                    >
                      Additional Comment (Optional)
                    </Text>
                    <Textarea
                      // w="291px"
                      py="6.41px"
                      color="text"
                      id="message"
                      value={message}
                      w="full"
                      h="105px"
                      fontSize={'14px'}
                      resize="none"
                      name="message"
                      border="0.5px solid"
                      borderColor={`matador_border_color.100 !important`}
                      bg={`matador_background.100`}
                      _focus={{
                        borderColor: `matador_border_color.100 !important`,
                      }}
                      _focusVisible={{
                        borderColor: `matador_border_color.100 !important`,
                      }}
                      _hover={{
                        borderColor: `matador_border_color.100 !important`,
                      }}
                      onChange={handleMessage}
                    />
                  </Stack>

                  <Button
                    bg="custom_color.color"
                    _hover={{opacity: !isValid ? 'auto' : '1'}}
                    _active={{opacity: !isValid ? 'auto' : '1'}}
                    _focus={{opacity: !isValid ? 'auto' : '1'}}
                    borderRadius="6px"
                    isDisabled={!isValid}
                    onClick={handleSubmit}
                    w="full"
                    h={`100%`}
                    p={{base: `19px`}}
                    fontSize="18px"
                    fontWeight="400"
                    isLoading={feedbackMutation.isLoading}
                    color="custom_color.contrast"
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Center>
      ) : (
        <AbsoluteCenter>
          <Center
            flexDirection={`column`}
            gap="20px"
            bg="matador_background.200"
            borderRadius="16px"
            zIndex="22222"
            position="relative"
            w="478px"
            h={`350px`}
            justify="center"
            p={`10px`}
          >
            <Image
              // mb="20px"
              src={checkIcon?.src}
              boxSize="100px"
              alt={'success'}
            />

            <Text fontSize="28px" fontWeight="700" textAlign={'center'}>
              Thank you!
            </Text>
            <Text fontSize="16px" fontWeight="400" textAlign={'center'}>
              We appreciate your feedback
            </Text>
          </Center>
        </AbsoluteCenter>
      )}
    </LayoutView>
  );
};

export default FeedBackInspection;

export async function getServerSideProps({params, query}) {
  return {props: {slug: query.id, isSuccess: query.isSuccess ?? null}};
}
