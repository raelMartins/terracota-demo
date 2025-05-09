import React from 'react';
import {Box, Button, Center, Flex, HStack, Image, Stack, Text, VStack} from '@chakra-ui/react';
import {Spinner} from '../../../ui-lib';
import {useRouter} from 'next/router';
import {useQuery} from 'react-query';
import {fetchAllUnits, fetchProjectsById} from '../../../api/listing';
import BuyProperties from './buyProperty';
import {formatToCurrency} from '../../../utils';
import ErrorState from '../../../components/appState/error-state';
import Auth from '../../../hoc/Auth';
import AssetCarouselMobile from '../../../components/assetCarousel/mobile';
import OtherUnits from '../sections/otherUnits';
import {LayoutView} from '../../../components/page_layout';
import BookmarkProperty from '../sections/bookmark';
import ViewBrochure from '../sections/viewBrochure';
import cartIcon from '/src/images/icons/cartIcon.svg';
import {MdOutlineNotifications} from 'react-icons/md';
import useGetSession from '../../../utils/hooks/getSession';

const UnitDetailsMobile = ({openAuth}) => {
  const router = useRouter();
  const {unit, projectId} = router.query;
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const {data, isError, isLoading, error} = useQuery(
    ['fetchAllUnits', unit],
    () => fetchAllUnits(parseInt(projectId)),
    {
      // The query will not execute until the projectId exists
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

  return (
    <LayoutView noPadding openAuth={openAuth} display={{base: 'block', lg: 'none'}}>
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
            {unitData && (
              <Flex direction="column" gap="24px" w={`100%`}>
                <AssetCarouselMobile noBorderRadius rightItem={null} slideImages={slideImages} />
                <Stack gap={`12px`}>
                  <HStack justify={`space-between`} align="flex-start">
                    <Text
                      className="heading-text-medium"
                      fontSize={'28px'}
                      lineHeight={'140%'}
                      textTransform={'uppercase'}
                      color="matador_text.200"
                    >
                      {unitData?.unit_title}
                    </Text>
                    <HStack gap={`16px`}>
                      <BookmarkProperty
                        openAuth={openAuth}
                        refetch={refetch}
                        info={unitData.project}
                      />
                      {unitData?.property_document[0]?.document_file && (
                        <ViewBrochure
                          file={`${
                            unitData?.property_document
                              ? unitData?.property_document[0]?.document_file
                              : ''
                          }`}
                        />
                      )}
                    </HStack>
                  </HStack>

                  {info?.is_sold_out ? (
                    <Text
                      className="sub-text-regular"
                      // fontSize={'20px'}
                      lineHeight={'140%'}
                      textTransform={'uppercase'}
                      color="matador_text.500"
                      fontWeight={`500`}
                    >
                      Sold Out
                    </Text>
                  ) : canDisplayPrice ? (
                    <Text
                      className="sub-text-regular"
                      // fontSize={'20px'}
                      lineHeight={'140%'}
                      textTransform={'uppercase'}
                      color="matador_text.500"
                      fontWeight={`500`}
                    >
                      STARTING from {formatToCurrency(unitData?.price)}
                    </Text>
                  ) : (
                    <></>
                    // <Text
                    //   className="sub-text-regular"
                    //   // fontSize={'20px'}
                    //   lineHeight={'140%'}
                    //   textTransform={'uppercase'}
                    //   color="matador_text.500"
                    //   fontWeight={`500`}
                    // >
                    //   CONTACT FOR PRICE
                    // </Text>
                  )}

                  <Text
                    fontSize={'14px'}
                    fontWeight={300}
                    className="sub-text-regular"
                    lineHeight={'160%'}
                    color="matador_text.500"
                    letterSpacing={`.28px`}
                  >
                    {unitData?.unit_description}
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
                          w={`100%`}
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
                    // canDisplayPrice && (
                    <BuyProperties
                      openAuth={openAuth}
                      info={info}
                      unitData={unitData}
                      show_co_owner_button={false}
                      display_price={canDisplayPrice}
                    />
                    // )
                  )}
                </Stack>

                <OtherUnits info={info} excludingId={unitData?.id} />
              </Flex>
            )}
          </>
        )}
      </Box>
    </LayoutView>
  );
};

export default UnitDetailsMobile;
