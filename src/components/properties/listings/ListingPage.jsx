import React, {useRef} from 'react';
import {Box, Center, Flex, HStack, Image, Text, VStack} from '@chakra-ui/react';
import {LayoutView} from '@/components/page_layout';
import {Spinner} from '@/ui-lib';
import {useRouter} from 'next/router';
import {fetchProjectsById} from '@/api/listing';
import {useQuery} from 'react-query';
import Amenities from '@/pages/listing-details/sections/amenities';
import MapViewBox from '@/pages/listing-details/sections/mapView';
import PropertyInfo from '@/pages/listing-details/sections/propertyInfo';
import AllUnits from '@/pages/listing-details/sections/allUnits';
import {formatToCurrency} from '@/utils';
import ErrorState from '@/components/appState/error-state';
import Mobile from '@/pages/listing-details/mobile';
import AssetCarousel from '@/components/assetCarousel';
import BookmarkProperty from '@/pages/listing-details/sections/bookmark';
import ViewBrochure from '@/pages/listing-details/sections/viewBrochure';

import useGetSession from '@/utils/hooks/getSession';
import {checkIfSFH} from '@/utils/misc';

export const ListingPage = ({openAuth}) => {
  const router = useRouter();
  const id = router.query.id;
  const allUnitsRef = useRef();
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const {data, isError, isLoading, refetch} = useQuery(
    ['fetchProjectById', id],
    () => fetchProjectsById(parseInt(id)),
    {enabled: !!id}
  );

  const info = data?.data?.project;
  const is_detached = checkIfSFH(info);

  const slideImages =
    info?.photos?.map(image => ({
      original: image.photo,
      thumbnail: image.photo,
    })) || [];

  const brochure_url =
    info?.property_document?.find(el => el.purpose === `brochure`)?.document_url ||
    info?.property_document?.find(el => el.purpose === `brochure`)?.document_file;
  return (
    <>
      <Mobile openAuth={openAuth} />
      <LayoutView openAuth={openAuth} display={{base: 'none', lg: 'flex'}}>
        {isLoading ? (
          <Center minH={`70vh`}>
            <Spinner noAbsolute />
          </Center>
        ) : isError ? (
          <ErrorState />
        ) : (
          <>
            {info && (
              <Box mt="20px">
                <AssetCarousel videoUrl={info?.youtube_url} slideImages={slideImages} />

                <Box w="100%" mx="auto" py="28px" borderRadius={'10px'}>
                  <VStack mt="43px" spacing={'12px'} align={'stretch'}>
                    <HStack justify={'space-between'} align="flex-start">
                      <Text
                        className="heading-text-regular"
                        fontWeight={400}
                        fontSize={'80px'}
                        lineHeight={'72px'}
                        textTransform={'uppercase'}
                        maxW={`80%`}
                        color={`matador_text.500`}
                      >
                        {info.name}
                      </Text>
                      <HStack gap={`16px`}>
                        <BookmarkProperty refetch={refetch} info={info} openAuth={openAuth} />
                        {brochure_url && <ViewBrochure file={brochure_url} />}
                      </HStack>
                    </HStack>

                    {info.is_sold_out ? (
                      <Text
                        fontSize={'19px'}
                        textTransform={`uppercase`}
                        color="matador_text.500"
                        fontWeight={`500`}
                        lineHeight={'140%'}
                      >
                        Sold Out
                      </Text>
                    ) : is_detached && !info?.display_price ? null : (
                      <Text
                        fontSize={'19px'}
                        textTransform={`uppercase`}
                        color="matador_text.500"
                        fontWeight={`400`}
                        lineHeight={'140%'}
                      >
                        {is_detached && !info?.display_price ? null : is_detached ? (
                          <Text as="span">{formatToCurrency(info?.starting_from)}</Text>
                        ) : info?.display_price ? (
                          <>
                            <Text as={`span`} fontWeight={`300`}>
                              STARTING FROM{' '}
                            </Text>
                            <Text as="span">{formatToCurrency(info?.starting_from)}</Text>
                          </>
                        ) : (
                          <Text as={`span`}>Contact For Price </Text>
                        )}
                      </Text>
                    )}
                    <Text
                      lineHeight={'160%'}
                      className="sub-text-regular"
                      color="matador_text.500"
                      fontSize={'18px'}
                      fontWeight={`300`}
                      letterSpacing={`.36px`}
                    >
                      {info?.description}
                    </Text>
                  </VStack>

                  <PropertyInfo
                    openAuth={openAuth}
                    allUnitsRef={allUnitsRef}
                    refetch={refetch}
                    info={info}
                  />

                  <Amenities info={info} />
                  {/* <Divider my='40px' w='100%' /> */}
                  {info?.maps_view && (
                    <Box my="40px">
                      <Text
                        fontSize={{base: '16px', lg: '24px'}}
                        fontWeight={400}
                        color="matador_text.100"
                        className="heading-text-bold"
                      >
                        Map View
                      </Text>
                      <Box
                        w={{base: `43px`, md: '70px'}}
                        mt={{base: '4px', md: `15px`}}
                        borderBottom="1.8px solid"
                        borderColor={`matador_text.200` || `#191919`}
                        mb={{base: '16px', lg: '36px'}}
                      />
                      <MapViewBox
                        lat={info?.latitude}
                        lng={info?.longitude}
                        width="full"
                        height="391px"
                      />
                    </Box>
                  )}
                </Box>
                {!is_detached && (
                  <Box w="full" ref={allUnitsRef}>
                    <AllUnits info={info} />
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </LayoutView>
    </>
  );
};
