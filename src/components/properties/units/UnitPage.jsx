import React from 'react';
import {Box, Button, Center, Flex, HStack, Image, Text, VStack} from '@chakra-ui/react';
import {LayoutView} from '@/components/page_layout';
import {Spinner} from '@/ui-lib';
import {useRouter} from 'next/router';
import {useQuery} from 'react-query';
import {fetchAllUnits, fetchProjectsById} from '@/api/listing';
import BuyProperties from '@/pages/listing-details/units/buyProperty';
import {formatToCurrency} from '@/utils';
import ErrorState from '@/components/appState/error-state';
import Mobile from '@/pages/listing-details/units/mobile';
import AssetCarousel from '@/components/assetCarousel';
import OtherUnits from '@/pages/listing-details/sections/otherUnits';
import BookmarkProperty from '@/pages/listing-details/sections/bookmark';

import {MdOutlineNotifications} from 'react-icons/md';
import useGetSession from '@/utils/hooks/getSession';

export const UnitPage = ({openAuth}) => {
  const router = useRouter();
  const {unit, projectId} = router.query;

  const {data, isError, isLoading} = useQuery(
    ['fetchAllUnits', unit],
    () => fetchAllUnits(parseInt(projectId)),
    {
      enabled: !!unit,
    }
  );

  const {data: projectData, refetch} = useQuery(
    ['fetchProjectById', projectId],
    () => fetchProjectsById(parseInt(projectId)),
    {enabled: !!projectId}
  );

  const info = projectData?.data?.project;
  const unitData = data?.data?.results?.find(item => parseInt(item.id) == parseInt(unit));
  const canDisplayPrice = unitData?.display_price;

  const slideImages =
    unitData?.photos?.map(image => ({
      original: image.photo,
      thumbnail: image.photo,
    })) || [];
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  return (
    <>
      <Mobile openAuth={openAuth} />
      <LayoutView
        openAuth={openAuth}
        display={{base: 'none', lg: 'flex'}}
        metaData={{
          title: unitData?.unit_title,
          description: unitData?.unit_description,
          image: slideImages?.[0],
        }}
      >
        {isLoading ? (
          <Center minH={`70vh`}>
            <Spinner noAbsolute />
          </Center>
        ) : isError ? (
          <ErrorState />
        ) : (
          <>
            {unitData && (
              <Box mt="20px">
                <AssetCarousel videoUrl={unitData?.youtube_url} slideImages={slideImages} />
                <Box w="100%" mx="auto" borderRadius={'10px'}>
                  <VStack mt="43px" spacing={'12px'} align={'stretch'}>
                    <HStack justify={'space-between'}>
                      <Text
                        className="heading-text-regular"
                        fontWeight={400}
                        fontSize={'48px'}
                        lineHeight={'72px'}
                        textTransform={'uppercase'}
                      >
                        {unitData?.unit_title}
                      </Text>
                      {unitData.quantity <= 0 ? (
                        <BookmarkProperty
                          info={unitData?.project}
                          openAuth={openAuth}
                          InnerComponent={
                            <Button
                              py="16px"
                              px="24px"
                              h={`100%`}
                              bg="custom_color.color"
                              color="custom_color.contrast"
                              borderRadius={`0px`}
                              _hover={{opacity: `1`}}
                              leftIcon={<MdOutlineNotifications fontSize="20px" />}
                              fontWeight="500"
                              w={`max-content`}
                            >
                              <HStack>
                                <Text fontSize={`16px`} textTransform={`capitalize`}>
                                  notify when available
                                </Text>{' '}
                              </HStack>
                            </Button>
                          }
                        />
                      ) : (
                        <BuyProperties
                          openAuth={openAuth}
                          info={info}
                          unitData={unitData}
                          show_co_owner_button={false}
                          display_price={canDisplayPrice}
                        />
                      )}
                    </HStack>

                    {info?.is_sold_out ? (
                      <Text
                        fontSize={'19px'}
                        textTransform={`uppercase`}
                        lineHeight={'140%'}
                        color="matador_text.500"
                        fontWeight={`400`}
                      >
                        Sold Out
                      </Text>
                    ) : canDisplayPrice ? (
                      <Text
                        fontSize={'19px'}
                        textTransform={`uppercase`}
                        lineHeight={'140%'}
                        color="matador_text.500"
                        fontWeight={`400`}
                      >
                        STARTING FROM <Text as="span">{formatToCurrency(unitData?.price)}</Text>
                      </Text>
                    ) : (
                      <></>
                    )}

                    <Text
                      lineHeight={'160%'}
                      className="sub-text-regular"
                      color="matador_text.500"
                      fontSize={'18px'}
                      fontWeight={`300`}
                      letterSpacing={`.36px`}
                    >
                      {unitData?.unit_description}
                    </Text>
                  </VStack>
                </Box>
                <OtherUnits info={info} excludingId={unitData?.id} />
              </Box>
            )}
          </>
        )}
      </LayoutView>
    </>
  );
};
