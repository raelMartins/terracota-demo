import React from 'react';
import {Box, Center, Flex, HStack, Image, Stack, Text, VStack} from '@chakra-ui/react';
import {Spinner} from '../../ui-lib';
import {useRouter} from 'next/router';
import {fetchProjectDocument, fetchProjectsById} from '../../api/listing';
import {useQuery} from 'react-query';
import Amenities from './sections/amenities';
import MapViewBox from './sections/mapView';
import AllUnits from './sections/allUnits';
import {formatToCurrency} from '../../utils';
import ErrorState from '../../components/appState/error-state';
import Auth from '../../hoc/Auth';
import BookmarkProperty from './sections/bookmark';
import brochure from '../../images/icons/view-brochure.svg';
import PropertyInfoMobile from './sections/propertyInfoMobile';
import AssetCarouselMobile from '../../components/assetCarousel/mobile';
import {LayoutView} from '../../components/page_layout';
import ViewBrochure from './sections/viewBrochure';

import useGetSession from '../../utils/hooks/getSession';
import {checkIfSFH} from '@/utils/misc';

const ListingDetailsMobile = ({openAuth}) => {
  const router = useRouter();
  const id = router.query.id;
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const {data, isError, isLoading, error, refetch} = useQuery(
    ['fetchProjectById', id],
    () => fetchProjectsById(parseInt(id)),
    {enabled: !!id}
  );
  const info = data?.data?.project;
  const projectDoc = useQuery(['projectDoc', info?.id], () => fetchProjectDocument(info?.id));

  const is_detached = checkIfSFH(info);

  const slideImages =
    info?.photos?.map(image => ({
      original: image.photo,
      thumbnail: image.photo,
    })) || [];

  const brochure_url =
    info?.property_document?.find(el => el.purpose === `brochure`)?.document_url ||
    info?.property_document?.find(el => el.purpose === `brochure`)?.document_file ||
    info?.property_document?.[0]?.document_url ||
    info?.property_document?.[0]?.document_file ||
    `/`;

  return (
    <LayoutView display={{base: 'block', lg: 'none'}} noPadding openAuth={openAuth}>
      <Box
        pb={{base: '20px', lg: '50px'}}
        bg="background"
        h={'100%'}
        // minH="100vh"
        minInlineSize={'fit-content'}
        color={`text`}
        px={{base: '16px', lg: '24px'}}
        pt="20px"
        display={{base: 'block', lg: 'none'}}
      >
        {isLoading ? (
          <Center minH={`70vh`}>
            <Spinner noAbsolute />
          </Center>
        ) : isError ? (
          <ErrorState />
        ) : (
          <>
            {info && (
              <Flex direction="column" gap="24px">
                <AssetCarouselMobile
                  noBorderRadius
                  slideImages={slideImages}
                  videoUrl={info?.youtube_url}
                />
                <Stack gap={`12px`}>
                  <HStack justify={`space-between`} align="flex-start">
                    <Text
                      className="heading-text-medium"
                      fontSize={'28px'}
                      lineHeight={'140%'}
                      textTransform={'uppercase'}
                      color="matador_text.500"
                      maxW={`80%`}
                    >
                      {info?.name}
                    </Text>
                    <HStack gap={`16px`}>
                      <BookmarkProperty
                        openAuth={openAuth}
                        fontSize={`22px`}
                        refetch={refetch}
                        info={info}
                      />
                      {brochure_url && <ViewBrochure fontSize={`22px`} file={brochure_url} />}
                    </HStack>
                  </HStack>

                  {info?.is_sold_out ? (
                    <Text
                      className="sub-text-regular"
                      lineHeight={'140%'}
                      textTransform={'uppercase'}
                      color="matador_text.500"
                      fontWeight={`500`}
                    >
                      Sold Out
                    </Text>
                  ) : (
                    <Text
                      className="sub-text-regular"
                      lineHeight={'140%'}
                      textTransform={'uppercase'}
                      color="matador_text.500"
                      fontWeight={`500`}
                    >
                      {is_detached && !info?.display_price ? null : is_detached ? (
                        <Text as="span">{formatToCurrency(info?.starting_from)}</Text>
                      ) : info?.display_price ? (
                        <>
                          <Text as={`span`}>STARTING FROM </Text>
                          <Text as="span">{formatToCurrency(info?.starting_from)}</Text>
                        </>
                      ) : (
                        <Text as={`span`}>Contact For Price </Text>
                      )}
                    </Text>
                  )}

                  <Box>
                    <Text
                      fontSize={'14px'}
                      fontWeight={300}
                      className="sub-text-regular"
                      lineHeight={'160%'}
                      color="matador_text.500"
                      letterSpacing={`.28px`}
                    >
                      {info?.description}
                    </Text>
                  </Box>
                </Stack>
                <PropertyInfoMobile info={info} openAuth={openAuth} refetch={refetch} />

                <Amenities info={info} />
                {info?.maps_view && (
                  <Box my="20px">
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
                      mt="4px"
                      mb={`16px`}
                      borderBottom="1.8px solid"
                      borderColor={`matador_text.200`}
                    />
                    <MapViewBox
                      lat={info?.latitude}
                      lng={info?.longitude}
                      width="full"
                      height="222px"
                    />
                  </Box>
                )}
                {!is_detached && <AllUnits info={info} />}
              </Flex>
            )}
          </>
        )}
      </Box>
    </LayoutView>
  );
};

export default ListingDetailsMobile;
