import React from 'react';
import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {Button, Spinner} from '../../../ui-lib';
import {useRouter} from 'next/router';
import {formatToCurrency} from '../../../utils';
import AssetCarouselMobile from '../../../components/assetCarousel/mobile';
import {LayoutView} from '../../../components/page_layout';
import {useQuery} from 'react-query';
import {fetchFractionalInfo, fetchProjectsById} from '../../../api/listing';
import ErrorState from '../../../components/appState/error-state';
import FractionalMobileModal from './fractionalMobileModal';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';

const FractionalDetailsMobile = ({setStep}) => {
  const router = useRouter();
  const fractionalId = router.query.id;
  const fractionalModal = useDisclosure();

  const [storeThemeInfo] = useLocalStorage('storeThemeInfo');

  const fractionalIsEnabled = storeThemeInfo?.isFractionalEnabled ?? false;

  const {
    data: fractionalDetail,
    isLoading,
    isError,
  } = useQuery(['fractional', fractionalId], () => fetchFractionalInfo(fractionalId), {
    enabled: !!fractionalId,
  });
  const fractionalData = fractionalDetail?.data;
  const unitData = fractionalData?.fraction_data?.unit;

  const listingId = unitData?.project?.id;
  const {data: listingData} = useQuery(
    ['fetchProjectById', listingId],
    () => fetchProjectsById(parseInt(listingId)),
    {enabled: !!listingId}
  );

  const project = listingData?.data?.project;
  const isBuildingTypeSingleFamilyResidential =
    project?.building_type == 'Detached' ||
    project?.building_type == 'Semi Detached' ||
    project?.building_type == 'Land';

  const slideImages =
    unitData?.photos?.map(image => ({
      original: image.photo,
      thumbnail: image.photo,
    })) || [];

  const fractionalPercent = Math.ceil(
    (Number(unitData?.total_purchased_fractions) /
      (Number(unitData?.total_fractions) + Number(unitData?.total_purchased_fractions))) *
      100
  ).toFixed(2);

  const leftFractions = Number(unitData?.total_fractions);

  const top_row = [
    {
      title: `Price Per Fraction`,
      value: formatToCurrency(unitData?.price_per_fraction),
      show: true,
    },
    {
      title: `Unit Type`,
      value: unitData?.unit_type,
      show: unitData?.unit_type,
    },
    {
      title: `Dividend`,
      value: fractionalData?.extra_info?.dividend_amount
        ? formatToCurrency(fractionalData?.extra_info?.dividend_amount)
        : '-',
      show: fractionalData?.extra_info?.dividend_amount,
    },
    {
      title: `Dividend Payout`,
      value: fractionalData?.extra_info?.dividend_payout,
      show: fractionalData?.extra_info?.dividend_payout ? true : false,
    },
    {
      title: `Holding Period`,
      value: unitData?.holding_period,
      show: unitData?.holding_period ? true : false,
    },
  ];

  return (
    <LayoutView noPadding display={{base: 'block', md: 'none'}} pb={`0px !important`}>
      <Box w="full" minH={`82vh`} h="100%" display={`flex`} flexDir={`column`} gap={`10px`}>
        {isLoading ? (
          <Center w="full" h="80vh" bg={`matador_background.100`}>
            <Spinner noAbsolute />
          </Center>
        ) : isError ? (
          <ErrorState />
        ) : (
          <Box
            flex={`1`}
            display={`flex`}
            flexDir={`column`}
            h="100%"
            px={{base: '16px', lg: '24px'}}
            pt="20px"
            w="full"
            gap={`5px`}
          >
            <AssetCarouselMobile noBorderRadius slideImages={slideImages} />
            <Text
              mt="16px"
              className="heading-text-medium"
              fontSize={'28px'}
              lineHeight={'140%'}
              textTransform={'uppercase'}
              color="matador_text.100"
            >
              {unitData?.project?.name}
            </Text>

            <Text
              mt="16px"
              className="sub-text-regular"
              fontSize={'13px'}
              fontWeight={500}
              color="matador_form.label"
            >
              Price per fraction {formatToCurrency(unitData?.price_per_fraction)}
            </Text>

            {project?.fractions_progress_bar && (
              <Box
                mt="16px"
                w="full"
                bg="matador_background.200"
                border="0.2px solid"
                borderColor={`matador_border_color.100`}
                borderRadius={'5px'}
                px="10px"
                pb="9px"
              >
                <Box
                  mt="39px"
                  bg="text"
                  w="full"
                  h="10px"
                  borderRadius={'full'}
                  position={'relative'}
                >
                  <Box
                    position={'absolute'}
                    h="20px"
                    w="2px"
                    bg="custom_color.color"
                    left={`${fractionalPercent}%`}
                    top="-5px"
                  />
                  <Text
                    position={'absolute'}
                    color="custom_color.color"
                    left={`${fractionalPercent - (fractionalPercent > 90 ? 10 : 3)}%`}
                    top="-30px"
                  >
                    {`${fractionalPercent}%`}
                  </Text>
                  <Box
                    w={`${fractionalPercent}%`}
                    h="full"
                    bg="custom_color.color"
                    borderRadius={'full'}
                  />
                </Box>
                <HStack w="full" align="center" justify={'space-between'} mt="10px" px="4px">
                  <Text fontSize={'11px'} fontWeight={400} color="text">
                    {unitData?.total_purchased_fractions} fraction
                    {unitData?.total_purchased_fractions != 1 && `s`} sold
                  </Text>
                  <Text fontSize={'11px'} fontWeight={400} color="text">
                    {leftFractions} fraction{leftFractions != 1 && `s`} left
                  </Text>
                </HStack>
              </Box>
            )}

            <VStack
              w="full"
              justify={'space-between'}
              mt="20px"
              gap="10px"
              divider={<Divider borderColor={`matador_border_color.100 !important`} />}
            >
              {!isBuildingTypeSingleFamilyResidential && (
                <>
                  {fractionalData?.fraction_data?.unit?.unit_title && (
                    <HStack justify="space-between" w="full">
                      <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                        Unit
                      </Text>
                      <Text
                        fontSize={'16px'}
                        fontWeight={500}
                        color="text"
                        textTransform="capitalize"
                      >
                        {fractionalData?.fraction_data?.unit?.unit_title}
                      </Text>
                    </HStack>
                  )}
                </>
              )}
              {unitData?.holding_period && (
                <HStack justify="space-between" w="full">
                  <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                    Holding Period
                  </Text>
                  <Text fontSize={'16px'} fontWeight={500} color="text" textTransform="capitalize">
                    {unitData?.holding_period}
                  </Text>
                </HStack>
              )}
              <HStack justify="space-between" w="full">
                <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                  {`Investor's Packet`}
                </Text>
                <Text
                  border={'1px solid'}
                  borderColor="matador_border_color.100"
                  bg={`matador_background.100`}
                  p="4px 16px"
                  fontSize={'16px'}
                  fontWeight={500}
                  color="text"
                  cursor={'pointer'}
                  onClick={() =>
                    window.open(
                      `${
                        fractionalData?.packets?.[0]?.packet
                          ? fractionalData?.packets?.[0]?.packet
                          : ''
                      }`,
                      '_blank'
                    )
                  }
                >
                  View
                </Text>
              </HStack>
              {fractionalData?.partners?.map((stakeholder, i) => (
                <HStack justify="space-between" w="full" key={i}>
                  <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                    {stakeholder?.stakeholder_type ?? ''}
                  </Text>
                  <Text fontSize={'16px'} fontWeight={500} color="text" textTransform="capitalize">
                    {stakeholder?.stakeholder_name ?? ''}
                  </Text>
                </HStack>
              ))}
              {fractionalData?.extra_info?.dividend_payout && (
                <HStack justify="space-between" w="full">
                  <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                    Payout Type
                  </Text>
                  <Text fontSize={'16px'} fontWeight={500} color="text" textTransform="capitalize">
                    {fractionalData?.extra_info?.dividend_payout}
                  </Text>
                </HStack>
              )}
              {Number(fractionalData?.extra_info?.dividend_amount) && (
                <HStack justify="space-between" w="full">
                  <Text fontSize={'13px'} fontWeight={500} color="matador_form.label">
                    Dividend
                  </Text>
                  <Text fontSize={'16px'} fontWeight={500} color="text" textTransform="capitalize">
                    {formatToCurrency(fractionalData?.extra_info?.dividend_amount)}
                  </Text>
                </HStack>
              )}
            </VStack>
            {/* <Stack
              w="full"
              my={`20px`}
              gap={`10px`}
              divider={
                <StackDivider
                  border={`1px solid`}
                  borderColor={`matador_border_color.100`}
                  m={`0px !important`}
                />
              }
            >
              <HStack gap={`35px`} py={`20px`} flexWrap={`wrap`}>
                {top_row?.map((el, i) => {
                  return el.show ? (
                    <Stack key={i}>
                      <Text
                        fontSize={`12px`}
                        fontWeight={`500`}
                        lineHeight={`17px`}
                        letterSpacing={`0.01em`}
                        color={`matador_text.400`}
                      >
                        {el.title}
                      </Text>
                      <Text
                        fontSize={'12px'}
                        fontWeight={`600`}
                        color="text"
                        textTransform="capitalize"
                        lineHeight={`16px`}
                        letterSpacing={`-0.02em`}
                        textAlign={`left`}
                      >
                        {el.value}
                      </Text>
                    </Stack>
                  ) : (
                    <></>
                  );
                })}
              </HStack>
              <HStack gap={`35px`} py={`20px`} flexWrap={`wrap`}>
                {fractionalData?.extra_info?.issuer && (
                  <Stack>
                    <Text
                      fontSize={'12px'}
                      fontWeight={`600`}
                      color="text"
                      textTransform="capitalize"
                      lineHeight={`16px`}
                      letterSpacing={`-0.02em`}
                      textAlign={`left`}
                    >
                      Property Management
                    </Text>
                    <Text
                      fontSize={`12px`}
                      fontWeight={`500`}
                      lineHeight={`17px`}
                      letterSpacing={`0.01em`}
                      color={`matador_text.400`}
                    >
                      {fractionalData?.extra_info?.issuer}
                    </Text>
                  </Stack>
                )}
                {fractionalData?.partners?.map((el, i) => (
                  <Stack key={i}>
                    <Text
                      fontSize={'12px'}
                      fontWeight={`600`}
                      color="text"
                      textTransform="capitalize"
                      lineHeight={`16px`}
                      letterSpacing={`-0.02em`}
                      textAlign={`left`}
                    >
                      {el.stakeholder_name}
                    </Text>
                    <Text
                      fontSize={`12px`}
                      fontWeight={`500`}
                      lineHeight={`17px`}
                      letterSpacing={`0.01em`}
                      color={`matador_text.400`}
                      textTransform={`capitalize`}
                    >
                      {el.stakeholder_type}
                    </Text>
                  </Stack>
                ))}
              </HStack>
            </Stack> */}
            <Flex flexDir={`column`} mt="auto">
              {fractionalIsEnabled && (
                <Button
                  mt="20px"
                  alignSelf={`flex-end`}
                  h="48px"
                  w="full"
                  color={leftFractions <= 0 ? `#fff` : 'custom_color.contrast'}
                  bg={leftFractions <= 0 ? '#000' : 'custom_color.color'}
                  zIndex="100"
                  isDisabled={leftFractions <= 0}
                  onClick={fractionalModal.onOpen}
                >
                  {leftFractions <= 0 ? 'Fraction Sold out' : 'Buy Fraction'}
                </Button>
              )}
            </Flex>
          </Box>
        )}
      </Box>
      <FractionalMobileModal fractionalModal={fractionalModal} fractionalData={fractionalData} />
    </LayoutView>
  );
};

export default FractionalDetailsMobile;
