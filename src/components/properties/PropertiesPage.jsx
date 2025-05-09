import {
  SimpleGrid,
  Skeleton,
  Stack,
  Box,
  Text,
  Flex,
  SlideFade,
  HStack,
  Center,
} from '@chakra-ui/react';
import {ListingCard} from '../../components/cards';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {LayoutView} from '../../components/page_layout';
import {fetchProjectsWithFilters} from '../../api/listing';

import {useInfiniteQuery, useQuery} from 'react-query';
import {fetchWatchlist} from '../../api/watchlist';
import OffersBar from '../../components/offers/offersBar';
import InspectionFeedBack from '../../components/feedback';
import ValidateCustomerEquity from '../../components/validateCustomerAssets/ValidateCustomerEquityBar';
import ErrorState from '../../components/appState/error-state';
import EmptyState from '../../components/appState/empty-state';
import PendingTransactionsBar from '../../components/pendingTransaction/pendingTransactionsBar';
import {ArrowBackIcon} from '@chakra-ui/icons';
import FilterList from './filterList';
import EmptyStateForFlter from './filterList/components/emptyStateForFilter';
import useGetSession from '../../utils/hooks/getSession';
import {NetworkErrorState} from '../appState/network-error-state';
import {OpenSettingsBanner} from './OpenSettingsBanner';
import {Spinner} from '@/ui-lib';

const defaultFilterObj = {
  paymentPlan: false,
  propertyType: [],
  priceRange: {
    priceFrom: '',
    priceTo: '',
  },
  no_of_bedroom: [],
  searchString: '',
};

const PropertiesPage = ({openAuth, ...rest}) => {
  const router = useRouter();
  const [queryString, setQueryString] = useState(null);
  const [filterObj, setFilterObj] = useState(defaultFilterObj);

  const [scrollDirection, setScrollDirection] = useState('down');

  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const isAppendable = item => {
    if (item === '' || item === undefined || item === null) return false;
    else return true;
  };

  const {
    data: infiniteData,
    error: infiniteError,
    isError: infiniteIsError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading: infiniteLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['infiniteListingData', queryString],
    queryFn: ({pageParam = `${queryString ? `${queryString}&` : ''}page=1`}) => {
      return fetchProjectsWithFilters(pageParam);
    },
    getNextPageParam: (lastPage, pages) => {
      const maxPageNumber = Math.ceil(lastPage?.data?.count / 10);
      const nextPageNumber = pages.length + 1;
      return nextPageNumber <= maxPageNumber
        ? `${queryString ? `${queryString}&` : ''}page=${nextPageNumber}`
        : undefined;
    },
  });

  const numberOfProjects =
    infiniteData?.pages?.flatMap(projectData => projectData?.data?.project?.map(() => 0))?.length ??
    0;

  const getQueryString = () => {
    const queryString = new URLSearchParams();

    const {
      paymentPlan,
      propertyType = [],
      priceRange = {},
      no_of_bedroom = [],
      searchString,
    } = filterObj ?? {};

    let {priceFrom, priceTo} = priceRange;
    const maxValue = infiniteData?.pages?.[0]?.data?.max_price;
    const minValue = infiniteData?.pages?.[0]?.data?.min_price;

    if (Number(priceFrom) > Number(priceTo)) {
      priceFrom = minValue;
      if (Number(priceFrom) > Number(priceTo)) {
        priceTo = maxValue;
        priceFrom = priceRange.priceFrom;
      }

      setFilterObj(prevState => ({
        ...prevState,
        priceRange: {
          ...prevState.priceRange,
          priceFrom,
          priceTo,
        },
      }));
    }

    propertyType.forEach(item => {
      queryString.append('building_type[]', item);
    });

    queryString.append('payment_plan_is_available', paymentPlan ? 'true' : 'false');

    if (isAppendable(priceFrom)) {
      queryString.append('price_from', priceFrom);
    }
    if (isAppendable(priceTo)) {
      queryString.append('price_to', priceTo);
    }

    no_of_bedroom.forEach(item => {
      queryString.append('no_of_bedroom[]', item);
    });

    if (isAppendable(searchString)) {
      queryString.append('search', searchString?.formatted_address ?? searchString);
    }

    return queryString.toString();
  };

  const handleFilter = () => {
    const queryString = getQueryString();
    return setQueryString(queryString);
  };
  const handleReset = () => {
    setFilterObj(defaultFilterObj);
    return setQueryString(null);
  };

  const scrollToTop = () => {
    return window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const arrayForLoaders = lens => Array.from({length: lens || 3 - (numberOfProjects % 3)}, () => 0);

  const handleAnimation = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 840 && numberOfProjects > 10) {
      setScrollDirection('up');
    } else {
      setScrollDirection('down');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      handleAnimation();
      if (
        !isFetchingNextPage &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 10
      ) {
        return hasNextPage ? fetchNextPage() : null;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const {data: watchlistData, refetch: refetchForWatchlist} = useQuery(
    ['waitlistipoiid'],
    fetchWatchlist
  );

  const isIdWatchlisted = id =>
    watchlistData?.data?.watchlist
      ? watchlistData?.data?.watchlist?.some(item => item.project.id === id)
      : undefined;
  const single_listing_loader = (infiniteLoading || numberOfProjects == 1) && !queryString;

  useEffect(() => {
    if (numberOfProjects === 1) {
      const project = infiniteData.pages?.[0]?.data?.project?.[0];
      router.push(`/listing-details/${project?.id}`);
      console.log({project});
    }
  }, [numberOfProjects]);

  return (
    <LayoutView
      noPadding
      openAuth={openAuth}
      noFooter={single_listing_loader}
      noNavbar={single_listing_loader}
    >
      {single_listing_loader ? (
        <Center h={`100vh`}>
          <Spinner noAbsolute />
        </Center>
      ) : (
        <>
          <Box
            w="full"
            h={{base: `80px`, lg: '180px'}}
            // bgImage={filterBG.src}
            bgPosition={'center'}
            bgSize={'cover'}
            position={'relative'}
            {...rest}
          >
            {/* <Box position={'absolute'} opacity={0.5} bg="#0E0E0E" h="full" w="full" /> */}
            <Flex
              position={'absolute'}
              h="full"
              w="full"
              px="100px"
              py={{base: `20px`, lg: '40px'}}
              direction={'column'}
              zIndex={`1`}
              align={'center'}
              justify={{base: 'center', lg: 'space-between'}}
            >
              {/* <Box h="50px" display={{base: 'none', lg: 'block'}} /> */}
              <Text
                className="heading-text-regular"
                fontSize={{base: `23px`, lg: '40px'}}
                pb={{base: `0px`, lg: '20px'}}
                px={`20px`}
                // color="#FFF"
                color="custom_color.color_pop"
                borderBottom={'2.688px solid'}
                // borderColor={`#ffffff`}
                borderColor={`custom_color.color_pop`}
                w={{base: 'max-width', lg: '403.188px'}}
                textAlign={'center'}
              >
                Our Offerings
              </Text>
            </Flex>
          </Box>
          <FilterList
            shouldDisable={infiniteIsError || infiniteLoading}
            filterObj={filterObj}
            setFilterObj={setFilterObj}
            handleFilter={handleFilter}
            handleReset={handleReset}
            queryString={queryString}
          />
          <Box
            w="full"
            px={{base: '16px', md: '80px'}}
            py={{base: '16px', md: '50px'}}
            position={'relative'}
          >
            <Box position={'fixed'} bottom={'0px'} zIndex={30} w="100%" right="0" left="0">
              {LoggedinUser && (
                <>
                  <OpenSettingsBanner user={LoggedinUser} />
                  <OffersBar />
                  <PendingTransactionsBar />
                  <InspectionFeedBack />
                </>
              )}
            </Box>
            {
              // isLoading
              infiniteLoading ? (
                <SimpleGrid
                  columns={{base: 1, md: 2, xl: 3}}
                  gap={{base: `16px`, md: '40px'}}
                  w="full"
                  px="auto"
                  justify={'center'}
                  placeItems="center"
                  alignItems="stretch"
                >
                  <>
                    {arrayForLoaders(6).map((item, index) => (
                      <Stack key={index} overflow="hidden" pb="23px" spacing="none" w="full">
                        <Skeleton
                          shadow={'sm'}
                          // as={motion.div}
                          maxWidth={'597.45px'}
                          cursor={'pointer'}
                          whileTap={{scale: 0.98}}
                          whileHover={{scale: 1.01}}
                          // style={{aspectRatio: '38 / 36'}}
                          aspectRatio={{base: `1 / 1`, lg: '387  / 490'}}
                          // bg="card_bg"
                          mx={'auto'}
                          h={{base: '350px', lg: `490`}}
                          w="full"
                          bgSize={'cover'}
                          borderRadius={'5px'}
                          position={'relative'}
                          // startColor="grey"
                          startColor="rgba(0,0,0,.5)"
                          // endColor="darkgrey"
                          endColor="rgba(0,0,0,.8)"
                        />
                      </Stack>
                    ))}
                  </>
                </SimpleGrid>
              ) : infiniteIsError ? (
                !infiniteError?.response ||
                !infiniteError?.response?.status ||
                infiniteError?.response?.status === 500 ||
                infiniteError?.response?.status === 502 ||
                infiniteError?.response?.status === 503 ||
                infiniteError?.response?.status === 504 ? (
                  <NetworkErrorState />
                ) : (
                  <ErrorState
                    text={`${
                      infiniteError?.response?.status === 500
                        ? "Apologies for the inconvenience. We're working on it. Please try again later."
                        : infiniteError?.response?.status === 401
                        ? 'Authentication Timeout: For security reasons, your session has timed out. Please log in again to continue.'
                        : infiniteError?.response?.data?.message ??
                          infiniteError?.response?.message ??
                          infiniteError?.message ??
                          'Something went wrong'
                    }`}
                  />
                )
              ) : (
                <>
                  {numberOfProjects > 0 ? (
                    <>
                      <SimpleGrid
                        gap={{base: `16px`, md: '40px'}}
                        columns={{base: 1, md: 2, xl: 3}}
                        w={`100%`}
                        justify={'center'}
                        alignItems={'center'}
                      >
                        {infiniteData.pages.map(projectData =>
                          projectData?.data?.project?.map(data => (
                            <ListingCard
                              key={data?.id}
                              data={data}
                              refetch={refetchForWatchlist}
                              justifyContent="center"
                              is_id_watchlisted={isIdWatchlisted(data?.id)}
                            />
                          ))
                        )}
                        {isFetchingNextPage
                          ? arrayForLoaders().map((item, index) => (
                              <SlideFade key={index} in={isFetchingNextPage}>
                                <Stack
                                  key={index}
                                  overflow="hidden"
                                  pb="23px"
                                  spacing="none"
                                  w="full"
                                >
                                  <Skeleton
                                    shadow={'sm'}
                                    // as={motion.div}
                                    maxWidth={'597.45px'}
                                    cursor={'pointer'}
                                    whileTap={{scale: 0.98}}
                                    whileHover={{scale: 1.01}}
                                    // style={{aspectRatio: '38 / 36'}}
                                    aspectRatio={{base: `1 / 1`, lg: '387  / 490'}}
                                    // bg="card_bg"
                                    mx={'auto'}
                                    h={{base: '350px', lg: `490`}}
                                    w="full"
                                    bgSize={'cover'}
                                    borderRadius={'5px'}
                                    position={'relative'}
                                    // startColor="grey"
                                    startColor="rgba(0,0,0,.5)"
                                    // endColor="darkgrey"
                                    endColor="rgba(0,0,0,.8)"
                                  />
                                </Stack>
                              </SlideFade>
                            ))
                          : null}
                      </SimpleGrid>
                      <ScrollToTop scrollDirection={scrollDirection} scrollToTop={scrollToTop} />
                    </>
                  ) : queryString ? (
                    <EmptyStateForFlter handleReset={handleReset} />
                  ) : (
                    <EmptyState heading={'Nothing found'} text={`No property was found`} />
                  )}
                </>
              )
            }
          </Box>
        </>
      )}
    </LayoutView>
  );
};

const ScrollToTop = ({scrollDirection, scrollToTop}) => {
  return (
    <Center
      opacity={scrollDirection === 'up' ? 1 : 0}
      visibility={scrollDirection === 'up' ? 'visible' : 'hidden'}
      transition="ease-in-out 0.3s"
      transform={`translateY(${scrollDirection === 'up' ? '0px' : '20px'}) scale(${
        scrollDirection === 'up' ? 1 : 0.8
      })`}
      position="fixed"
      bottom="20"
      right={{base: '3%', md: '10'}}
      p="4px"
      boxSize="50px"
      role="button"
      onClick={scrollToTop}
      borderRadius="full"
      bg="#f5f5f5"
      color={`#191919`}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
    >
      <Box transform="rotate(90deg)">
        <ArrowBackIcon fontSize={`24px`} />
      </Box>
    </Center>
  );
};

export default PropertiesPage;
