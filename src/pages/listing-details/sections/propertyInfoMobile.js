import React from 'react';
import {Box, Flex, VStack, Image, useDisclosure, Text, HStack} from '@chakra-ui/react';
import RequestTourModal from '../modals/requestTour';
import ContactPerson from '../modals/contactPerson';
import {Button} from '../../../ui-lib';
import buyProperty from '../../../images/icons/buyProperty.svg';
import {BiPhoneCall} from 'react-icons/bi';
import FractionalModal from './fractionalModal';
import fractionalImg from '../../../images/icons/fractional-btn.svg';
import {MdNotifications, MdOutlineNotifications, MdOutlineSignpost} from 'react-icons/md';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import BuyProperties, {BuyPropertySVG, ContactSVG} from '../units/buyProperty';
import {useQuery} from 'react-query';
import {fetchAllUnits, fetchFractionalInfo} from '../../../api/listing';
import cartIcon from '/src/images/icons/cartIcon.svg';
import BookmarkProperty from './bookmark';
import useWatchlist from '../../../ui-lib/ui-lib.hooks/useWatchlist';
import {BsGrid1X2} from 'react-icons/bs';
import useGetSession from '@/utils/hooks/getSession';
import {PaymentAccess} from '@/components/payment/PaymentAccess';
import {checkIfSFH} from '@/utils/misc';

const PropertyInfoMobile = ({info, openAuth, refetch}) => {
  const requestModal = useDisclosure();
  const contactModal = useDisclosure();
  const fractionalModal = useDisclosure();
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const handleAuthClick = func => {
    if (LoggedinUser) {
      func();
    } else {
      openAuth();
    }
  };

  const {data: allUnits} = useQuery(
    ['fetchAllUnits', info?.id],
    () => fetchAllUnits(parseInt(info?.id)),
    {enabled: !!info?.id}
  );

  const unitsData = allUnits?.data?.results;

  const unitThatWasFractionalized = unitsData?.find(item => item?.is_fraction_sale_available);

  const {
    data: fractionalDetail,
    isError: fractionalDetailError,
    isLoading: fractionalDetailLoading,
  } = useQuery(
    ['fractional', unitThatWasFractionalized?.id],
    () => fetchFractionalInfo(unitThatWasFractionalized?.id)
    // {enabled: !!unitThatWasFractionalized?.id}
  );
  const fractionalData = fractionalDetail?.data;
  const unitData = fractionalData?.fraction_data?.unit;
  const leftFractions = fractionalDetailError ? 0 : Number(unitData?.total_fractions);

  const [storeThemeInfo] = useLocalStorage('storeThemeInfo');

  const fractionalIsEnabled = storeThemeInfo?.isFractionalEnabled ?? false;

  const has_fractions = info.is_fractionalized && fractionalIsEnabled;
  const is_detached = checkIfSFH(info);
  const canDisplayPrice = info?.display_price;

  const {toggleWatchlist, isWatchlisted} = useWatchlist({info, refetch});

  const button_styles = {
    flex: `1`,
    width: '100%',
    p: '16px',
    h: `100% !important`,
    bg: 'custom_color.color',
    color: 'custom_color.contrast',
    borderRadius: `0px`,
    border: '0.5px solid',
    borderColor: `custom_color.color`,
    _hover: {opacity: '1'},
    _active: {opacity: '1'},
    _focus: {opacity: '1'},
    opacity: '1',
    fontWeight: '500',
  };

  return (
    <Box>
      <Box w="full">
        <Flex
          direction="column"
          alignItems={'center'}
          gap="8px"
          justify={'space-between'}
          className="sub-text-regular"
          w={`100%`}
        >
          {info.is_sold_out ? (
            <BookmarkProperty
              info={info}
              openAuth={openAuth}
              InnerComponent={
                <Button
                  flex={`1`}
                  py="16px"
                  px="24px"
                  h={`100%`}
                  bg={'custom_color.color'}
                  color="custom_color.contrast"
                  borderRadius={`0px`}
                  border="0.5px solid"
                  borderColor={`custom_color.color`}
                  _hover={{opacity: `1`}}
                  leftIcon={
                    isWatchlisted ? (
                      <MdNotifications fontSize="20px" />
                    ) : (
                      <MdOutlineNotifications fontSize="20px" />
                    )
                  }
                  fontWeight="500"
                  w={`100%`}
                >
                  <HStack>
                    <Text fontSize={`13px`} textTransform={`capitalize`}>
                      {isWatchlisted ? `Added to Watchlist` : `notify when available`}
                    </Text>{' '}
                  </HStack>
                </Button>
              }
            />
          ) : has_fractions ? (
            <Button
              flex={`1`}
              p="16px"
              // bg='custom_color.color'
              bg={leftFractions <= 0 ? '#191919' : 'custom_color.color'}
              color={leftFractions <= 0 ? '#fff' : `custom_color.contrast`}
              border="0.5px solid"
              borderColor={leftFractions <= 0 ? '#191919' : 'custom_color.color'}
              _hover={{bg: leftFractions <= 0 ? '#191919' : 'custom_color.color'}}
              // leftIcon={<Image src={fractionalImg.src} fontSize="20" />}
              leftIcon={<BsGrid1X2 fontSize="20" />}
              onClick={() => handleAuthClick(fractionalModal?.onOpen)}
              fontWeight="500"
              w={`100%`}
              h="100%"
              // isDisabled={info.is_sold_out}
              isDisabled={fractionalDetailLoading || leftFractions <= 0}
            >
              <HStack>
                <Text fontSize={`13px`}>
                  {leftFractions <= 0 ? 'Fractions Sold out' : 'Buy Fraction'}
                </Text>
              </HStack>
            </Button>
          ) : is_detached ? (
            !canDisplayPrice ? (
              <HStack
                gap="8px"
                justifyContent="center"
                w="full"
                h="51px"
                bg="custom_color.color"
                color={`custom_color.contrast`}
                onClick={contactModal.onOpen}
                cursor={`pointer`}
              >
                <ContactSVG />

                <Text fontSize="13px" fontWeight="400">
                  Contact For Price
                </Text>
              </HStack>
            ) : (
              <PaymentAccess
                content={
                  <BuyProperties
                    info={info}
                    unitData={unitsData?.[0]}
                    openAuth={openAuth}
                    InnerComponent={
                      <Button leftIcon={<BuyPropertySVG boxSize={`20px`} />} {...button_styles}>
                        <HStack>
                          <Text fontSize={`13px`}>Proceed To Payment</Text>{' '}
                        </HStack>
                      </Button>
                    }
                  />
                }
              />
            )
          ) : null}{' '}
          <HStack gap="8px" flex={`1`} w={`100%`}>
            {info?.inspection_enabled && (
              <Button
                flex={`1`}
                p="16px"
                h={`100%`}
                bg={
                  info.is_sold_out || is_detached || has_fractions
                    ? 'custom_color.background'
                    : 'custom_color.color'
                }
                color={
                  info.is_sold_out || is_detached || has_fractions
                    ? 'custom_color.color'
                    : 'custom_color.contrast'
                }
                border="0.5px solid"
                borderColor="custom_color.color"
                _focus={{
                  bg:
                    info.is_sold_out || is_detached || has_fractions
                      ? 'custom_color.background'
                      : 'custom_color.color',
                  border: '0.5px solid !important',
                  borderColor: 'custom_color.color',
                }}
                _active={{
                  bg:
                    info.is_sold_out || is_detached || has_fractions
                      ? 'custom_color.background'
                      : 'custom_color.color',
                  border: '0.5px solid !important',
                  borderColor: 'custom_color.color',
                }}
                _hover={{
                  bg:
                    info.is_sold_out || is_detached || has_fractions
                      ? 'custom_color.background'
                      : 'custom_color.color',
                  border: '0.5px solid !important',
                  borderColor: 'custom_color.color ',
                }}
                leftIcon={<MdOutlineSignpost fontSize={`18px`} />}
                onClick={() => handleAuthClick(requestModal.onOpen)}
                fontWeight="500"
                isDisabled={info.is_sold_out}
              >
                <HStack>
                  <Text fontSize={`13px`}>Schedule Inspection</Text>
                </HStack>
              </Button>
            )}
            <Button
              flex={`1`}
              p="16px"
              h={`100%`}
              ml={`0px !important`}
              // bg='custom_color.color'
              bg="custom_color.background"
              color="custom_color.color"
              border="0.5px solid"
              borderColor="custom_color.color"
              _focus={{
                opacity: info.is_sold_out ? `auto` : `1`,
                border: '0.5px solid !important',
                borderColor: 'custom_color.color',
              }}
              _hover={{
                opacity: info.is_sold_out ? `auto` : `1`,
                border: '0.5px solid !important',
                borderColor: 'custom_color.color ',
              }}
              _focusVisible={{
                opacity: info.is_sold_out ? `auto` : `1`,
                border: '0.5px solid !important',
                borderColor: 'custom_color.color',
              }}
              _active={{
                opacity: info.is_sold_out ? `auto` : `1`,
                border: '0.5px solid !important',
                borderColor: 'custom_color.color',
              }}
              leftIcon={<BiPhoneCall fontSize={`18px`} />}
              onClick={contactModal.onOpen}
              fontWeight="500"
              isDisabled={info.is_sold_out}
            >
              <HStack>
                <Text fontSize={`13px`}>Contact Person</Text>
              </HStack>
            </Button>
          </HStack>
        </Flex>
      </Box>

      <RequestTourModal requestModal={requestModal} info={info} />
      <ContactPerson contactModal={contactModal} info={info} />
      <FractionalModal info={info} fractionalModal={fractionalModal} />
    </Box>
  );
};

export default PropertyInfoMobile;
