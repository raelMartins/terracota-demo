import {
  Image,
  VStack,
  HStack,
  Text,
  useToast,
  Flex,
  Stack,
  useMediaQuery,
  SlideFade,
  Center,
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import {useInfiniteQuery, useQuery} from 'react-query';
import {useRef, useState} from 'react';
import {Drawer, DrawerOverlay, DrawerContent, Box} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons';
import {Spinner} from '/src/ui-lib';
import {fetchUserEquity} from '../../api/listing';
import ErrorState from '../appState/error-state';
import EmptyState from '../appState/empty-state';
import thinArrow from '/src/images/icons/thinArrow.svg';
import ThreeDots from '../loaders/ThreeDots';

export const MyAssets = ({isAssetOpen, onAssetClose, onDrawerOpen}) => {
  const router = useRouter();
  const toast = useToast();
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [scrollPosition1, setScrollPosition1] = useState(0);
  const [shouldScroll, setScrollDirection] = useState('down');
  const {data, isError, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage} =
    useInfiniteQuery({
      queryKey: ['infinitePaidAssets', 'PAID'],
      queryFn: ({pageParam = `PAID&page=1`}) => {
        return fetchUserEquity(pageParam);
      },
      getNextPageParam: (lastPage, pages) => {
        const maxPageNumber = Math.ceil(lastPage?.data?.count / 10);
        const nextPageNumber = pages.length + 1;
        return nextPageNumber <= maxPageNumber ? `PAID&page=${nextPageNumber}` : undefined;
      },
    });

  const USER_EQUITY = data?.pages?.flatMap(assetsData =>
    assetsData?.data?.results?.map(item => item)
  );

  const wrap = document?.getElementById('assetsWrap');

  const scrollToTop = () => {
    wrap.scrollTop = 0;
  };
  const numberOfAssets =
    data?.pages?.flatMap(assetsData => assetsData?.data?.results?.map(() => 0))?.length ?? 0;

  const handleAnimation = () => {
    const currentScrollY = wrap?.scrollTop;

    if (currentScrollY > 540 && numberOfAssets > 10) {
      setScrollDirection('up');
    } else {
      setScrollDirection('down');
    }
  };

  const handleScroll = () => {
    const wrap = document?.getElementById('assetsWrap');

    handleAnimation();

    if (!isFetchingNextPage && wrap?.clientHeight + wrap?.scrollTop >= wrap?.scrollHeight) {
      console.log({scrol: 'insode'});

      return hasNextPage ? fetchNextPage() : null;
    }
  };

  const readScollToRef1 = useRef();

  const handleMostReadScroll = scrollAmount => {
    const newScrollPosition = scrollPosition1 + scrollAmount;
    setScrollPosition1(newScrollPosition);
    readScollToRef1.current.scrollLeft = newScrollPosition;
  };

  if (data?.code === 'ERR_NETWORK') {
    toast({
      title: `${data?.message}`,
      description: ` please check your network connection`,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  }

  const handleManageAssets = property => {
    property?.type == 'WHOLE' &&
      !property?.payment_plan &&
      !property?.co_owners?.length &&
      router.push(`/asset/outright/${property?.id}?status=${paymentStatus}`);

    property?.type == 'WHOLE' &&
      property?.payment_plan &&
      !property?.co_owners?.length &&
      router.push(`/asset/payment_plan/${property?.id}?status=${paymentStatus}`);

    property?.type == 'WHOLE' &&
      property?.co_owners?.length &&
      router.push(`/asset/co_ownership/${property?.id}?status=${paymentStatus}`);

    property?.type == 'FRACTIONAL' &&
      property?.co_owners?.length > 0 &&
      router.push(`/asset/fractional/${property?.id}?status=${paymentStatus}`);

    property?.type == 'FRACTIONAL' &&
      router.push(`/asset/fractional/${property?.id}?status=${paymentStatus}`);
    onAssetClose();
  };
  const [isNotMobile] = useMediaQuery('(min-width: 768px)');

  return (
    <Drawer
      autoFocus={false}
      placement="right"
      scrollBehavior="inside"
      isOpen={isAssetOpen}
      onClose={onAssetClose}
    >
      {/* {isNotMobile && <DrawerOverlay />} */}
      <DrawerOverlay />
      <DrawerContent
        top={{base: 'unset !important', lg: '24px !important'}}
        right={{base: '0', md: '24px !important'}}
        bottom={{base: '0', md: 'unset !important'}}
        w="full"
        minH={{base: `300px`, lg: '50vh'}}
        p="16px"
        maxW={{base: '100vw', md: '450px'}}
        maxH={'75vh'}
        bg={'card_bg'}
        boxShadow={{base: 'none', md: 'md'}}
      >
        <Flex
          px="10px"
          w="full"
          justify={'space-between'}
          align={'center'}
          borderBottom={`1px solid`}
          borderColor={`matador_border_color.100`}
        >
          <Text
            fontSize={'25px'}
            fontWeight={400}
            className="heading-text-regular"
            color={'matador_text.100'}
          >
            Portfolio
          </Text>

          <CloseIcon
            alignSelf={'flex-start'}
            cursor="pointer"
            fontSize={14}
            color={'text'}
            onClick={onAssetClose}
            mt={{md: 2}}
          />
        </Flex>

        {isLoading ? (
          <Center w="full" h="300px">
            <Spinner noAbsolute />
          </Center>
        ) : isError ? (
          <ErrorState />
        ) : (
          <Box px={3} pt={{base: '10px', md: '15px'}} overflowY="auto" onScroll={handleScroll}>
            {USER_EQUITY?.length > 0 ? (
              <>
                <Stack
                  // overflowY={'auto'}
                  scrollBehavior={'smooth'}
                  className="hide_scroll"
                  ref={readScollToRef1}
                  id="assetsWrap"
                >
                  <Stack spacing="14px" alignItems={'center'}>
                    {(USER_EQUITY || [])?.map((equity, idx) => (
                      <Flex
                        key={idx}
                        w={'full'}
                        maxW="405px"
                        h={{base: '98px', md: '104px'}}
                        bg="matador_background.100"
                        onClick={() => handleManageAssets(equity)}
                        cursor="pointer"
                        align={'center'}
                        gap={4}
                        rounded={'2px'}
                        border={'1px solid'}
                        borderColor={`matador_border_color.100`}
                        p={'16px'}
                      >
                        <Image
                          boxSize={{base: '64px', md: '68px'}}
                          alt="next_image"
                          src={equity?.project?.photos[0]?.photo}
                        />
                        <VStack align="stretch" spacing={'4px'} px="8px" py="9px">
                          <Text
                            className="heading-text-regular"
                            fontSize={18}
                            fontWeight="400"
                            color="matador_text.100"
                          >
                            {equity?.project?.name}
                          </Text>
                          <Text
                            // className="heading-text-regular"
                            fontSize={{base: 14, md: 12}}
                            fontWeight="400"
                            color="matador_text.400"
                          >
                            {equity?.type === 'FRACTIONAL'
                              ? `${equity?.amount_of_fractions} fraction${
                                  equity?.amount_of_fractions === 1 ? `` : 's'
                                }`
                              : equity?.unit?.unit_title}
                          </Text>
                        </VStack>
                      </Flex>
                    ))}
                    {/* <SlideFade in={isFetchingNextPage}>
                      <Text color="text" fontSize="12px" textAlign="center">
                        Just a sec ...
                      </Text>
                    </SlideFade> */}
                    <ScrollToTop shouldScroll={shouldScroll} scrollToTop={scrollToTop} />
                  </Stack>
                </Stack>
                {isFetchingNextPage && (
                  <Center p={`20px`}>
                    <ThreeDots />
                  </Center>
                )}
              </>
            ) : (
              <EmptyState
                icon
                textSize={12}
                headerStyle={{textTransform: 'uppercase', fontWeight: 700, fontSize: '14px'}}
                height={{base: '200px', md: '300px'}}
                text={`Looks like you haven't purchased anything yet.`}
              />
            )}
          </Box>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MyAssets;

const ScrollToTop = ({shouldScroll, scrollToTop}) => {
  return (
    <HStack
      justify="center"
      opacity={shouldScroll === 'up' ? 1 : 0}
      visibility={shouldScroll === 'up' ? 'visible' : 'hidden'}
      transition="ease-in-out 0.3s"
      transform={`translateY(${shouldScroll === 'up' ? '0px' : '20px'}) scale(${
        shouldScroll === 'up' ? 1 : 0.8
      })`}
      position="fixed"
      bottom="10"
      right={{base: '3%', md: '10'}}
      align="center"
      p="5px"
      role="button"
      onClick={scrollToTop}
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.6)"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
    >
      <Image src={thinArrow.src} boxSize="20px" transform="rotate(-90deg)" alt="right arrow" />
    </HStack>
  );
};
