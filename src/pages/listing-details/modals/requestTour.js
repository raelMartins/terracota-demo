import {useState} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  FormControl,
  FormLabel,
  useToast,
  Center,
  Stack,
  ModalCloseButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useMediaQuery,
} from '@chakra-ui/react';
import {Button, Spinner} from '@/ui-lib';
import {SelectTime} from '@/components/common/Calendar/forDateAndTime';
import {useMutation, useQuery} from 'react-query';
import {getTourRequest, requestATour} from '@/api/listing';
import {storeName} from '@/constants/routes';
import SelectDateCarousel from './selectDateCarousel';
import {InspectionRequestCreated} from '@/components/properties/InspectionRequestCreated';
import moment from 'moment-timezone';
import {fromZonedTime, toZonedTime} from 'date-fns-tz';

export const RequestTourContent = ({requestModal, info}) => {
  const toast = useToast();
  const [time, setTime] = useState('');
  const [tourMode, setTourMode] = useState('');
  const [mainDate, setmainDate] = useState('');
  const [isLargeScreen] = useMediaQuery('(min-width: 769px)');

  const inspectionRequestQuery = useQuery(['requestsQuery', info?.id], () =>
    getTourRequest(info?.id)
  );

  const inspectionRequest = inspectionRequestQuery?.data?.data?.data;

  const proceedRequest = useMutation(body => requestATour(body, info.id), {
    onSuccess: async res => {
      toast({
        title: `Thank you`,
        description: `We have gotten your request and we will respond as soon as possible.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      requestModal.onClose();
      inspectionRequestQuery.refetch();
    },
    onError: err => {
      toast({
        title: 'An error occured',
        description: `${err?.response?.data?.message || 'Something went wrong, try again'}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleSelectedDate = date => {
    return setmainDate(date);
  };

  const is_complete = mainDate && time && tourMode;
  const isDisabled = !is_complete || proceedRequest.isLoading;

  const presentDay = toZonedTime(new Date(), info?.listing_timezone);

  const filterPassedTime = time => {
    const selectedDate = toZonedTime(time, info?.listing_timezone);
    return presentDay < selectedDate;
  };

  const handleRequest = () => {
    if (is_complete) {
      const formattedDate = moment(mainDate).format('YYYY-MM-DD');
      const sanitizedTime = time.trim().toUpperCase(); // make sure it's '09:00 AM'

      const dateToUse = moment.tz(
        `${formattedDate} ${sanitizedTime}`,
        'YYYY-MM-DD hh:mm A',
        info?.listing_timezone
      );

      // Check if it's valid
      const utcDate = fromZonedTime(new Date(dateToUse), info?.listing_timezone).toISOString();

      const selectedDate = toZonedTime(new Date(dateToUse), info?.listing_timezone);
      const isPastDate = selectedDate < presentDay;

      if (isPastDate) {
        toast({
          title: 'Invalid Date',
          description: 'Please select a future date.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      const body = {
        time: utcDate,
        store_name: storeName,
        type: tourMode?.toLowerCase(),
        mode: tourMode?.toLowerCase(),
      };

      if (!isDisabled) {
        proceedRequest.mutate(body);
      }

      console.log({
        presentDay,
        formattedDate,
        sanitizedTime,
        dateToUse,
        utcDate,
        selectedDate,
        isPastDate,
        body,
      });
    } else
      toast({
        description: `Please select a date, time and a tour mode`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
  };

  return (
    <>
      <Box>
        <Flex
          direction="row"
          justify="space-between"
          align={'center'}
          mb={{base: '25px', md: '26px'}}
          pb={{base: `10px`}}
          className="sub-text-regular"
          borderBottom={`1px solid`}
          borderColor={`matador_border_color.100`}
        >
          <Text color="text" fontSize={'23px'} fontWeight={400} className="heading-text-regular">
            Schedule Inspection
          </Text>

          {isLargeScreen ? (
            <DrawerCloseButton position="initial" />
          ) : (
            <ModalCloseButton position="initial" />
          )}
        </Flex>

        {inspectionRequestQuery?.isLoading ? (
          <Center minH={`200px`} p={`16px`}>
            <Spinner noAbsolute />
          </Center>
        ) : inspectionRequest?.tour_method ? (
          <Box>
            <InspectionRequestCreated data={inspectionRequest} />
          </Box>
        ) : (
          <>
            <Flex rowGap="12px" direction={'column'} align={'stretch'} w="full" mb="26px">
              <FormLabel color="text" m="0px" fontSize={'16px'} className="heading-text-regular">
                Inspection type
              </FormLabel>
              <Flex gap={`59px`}>
                <Stack
                  spacing={'8px'}
                  direction="row"
                  align="center"
                  className="request-checkbox"
                  onClick={() => setTourMode('In-Person')}
                >
                  <Center
                    cursor="pointer"
                    border={'1px solid'}
                    borderRadius={'full'}
                    borderColor={'text'}
                    w="16px"
                    h="16px"
                  >
                    {tourMode === 'In-Person' && (
                      <Box bg={`text`} w={'10px'} h={'10px'} borderRadius={'full'} />
                    )}
                  </Center>
                  <Text color="text" fontSize="13px" fontWeight="500" className="sub-text-regular">
                    In-person
                  </Text>
                </Stack>
                <Stack
                  spacing={'8px'}
                  direction="row"
                  align="center"
                  className="request-checkbox"
                  onClick={() => setTourMode('Virtual')}
                >
                  <Center
                    cursor="pointer"
                    border={'1px solid'}
                    borderRadius={'full'}
                    borderColor={'text'}
                    w="16px"
                    h="16px"
                  >
                    {tourMode === 'Virtual' && (
                      <Box bg={`text`} w={'10px'} h={'10px'} borderRadius={'full'} />
                    )}
                  </Center>
                  <Text fontSize="13px" color="text" fontWeight="500" className="sub-text-regular">
                    Virtual
                  </Text>
                </Stack>
              </Flex>
            </Flex>

            <SelectDateCarousel mainDate={mainDate} handleSelectedDate={handleSelectedDate} />

            <FormControl>
              <SelectTime setTime={setTime} time={time} timezone={info?.listing_timezone} />
            </FormControl>

            <Button
              disabled={isDisabled}
              isDisabled={isDisabled}
              isLoading={proceedRequest.isLoading}
              onClick={handleRequest}
              whileHover={{scale: 1}}
              w="full"
              color="custom_color.contrast"
              bg="custom_color.color"
              mt="48px"
              minH="48px"
              p="13px 32px"
            >
              <Text fontSize={`16px`} fontWeight="500" className="sub-text-regular">
                Send Request
              </Text>
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

const RequestTour = ({requestModal, info}) => {
  const [isLargeScreen] = useMediaQuery('(min-width: 769px)');

  return isLargeScreen ? (
    <Modal
      autoFocus={false}
      isCentered
      onClose={requestModal?.onClose}
      isOpen={requestModal?.isOpen}
    >
      <ModalOverlay />
      <ModalContent
        bg="card_bg"
        color={`text`}
        maxW="430px"
        minH="437px"
        px={{base: '24px', md: '32px'}}
        py={{base: '24px', md: '32px'}}
        borderRadius={{base: '10px', md: '0px'}}
        position={`fixed`}
        bottom={`60px`}
        right={`60px`}
      >
        <RequestTourContent requestModal={requestModal} info={info} />
      </ModalContent>
    </Modal>
  ) : (
    <Drawer
      autoFocus={false}
      isCentered
      onClose={requestModal?.onClose}
      isOpen={requestModal?.isOpen}
      placement="bottom"
    >
      <DrawerOverlay />
      <DrawerContent
        bg="card_bg"
        color={`text`}
        px={{base: '24px', md: '32px'}}
        py={{base: '24px', md: '32px'}}
      >
        <RequestTourContent requestModal={requestModal} info={info} />
      </DrawerContent>
    </Drawer>
  );
};

export default RequestTour;
