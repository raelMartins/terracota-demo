import React from 'react';
import {Box, Center, Flex, HStack, Image, Text, useDisclosure} from '@chakra-ui/react';
import fractionalImg from '../../../images/icons/fractional-btn.svg';
import RequestTourModal from '../modals/requestTour';
import ContactPerson from '../modals/contactPerson';
import {useQuery} from 'react-query';
import {fetchAllUnits, fetchFractionalInfo} from '../../../api/listing';
import FractionalModal from './fractionalModal';
import {BiGrid, BiPhoneCall} from 'react-icons/bi';
import {MdNotifications, MdOutlineNotifications, MdOutlineSignpost} from 'react-icons/md';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import BuyProperties, {BuyPropertySVG, ContactSVG} from '../units/buyProperty';
import buyProperty from '../../../images/icons/buyProperty.svg';
import cartIcon from '/src/images/icons/cartIcon.svg';
import BookmarkProperty from './bookmark';
import useWatchlist from '../../../ui-lib/ui-lib.hooks/useWatchlist';
import {BsGrid1X2} from 'react-icons/bs';
import {Button} from '../../../ui-lib';
import useGetSession from '@/utils/hooks/getSession';
import {PaymentAccess} from '@/components/payment/PaymentAccess';
import {checkIfSFH} from '@/utils/misc';

const PropertyInfo = ({openAuth, info, refetch, allUnitsRef}) => {
  const requestModal = useDisclosure();
  const contactModal = useDisclosure();
  const fractionalModal = useDisclosure();
  const [storeThemeInfo] = useLocalStorage('storeThemeInfo');
  const {toggleWatchlist, isWatchlisted} = useWatchlist({info, refetch});
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const handleAuthClick = func => {
    if (LoggedinUser) {
      func();
    } else {
      openAuth();
    }
  };

  const fractionalIsEnabled = storeThemeInfo?.isFractionalEnabled ?? false;

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
  // const leftFractions =
  //   Number(unitData?.total_fractions) - Number(unitData?.total_purchased_fractions);

  const has_fractions = info.is_fractionalized && fractionalIsEnabled;
  const is_detached = checkIfSFH(info);
  const canDisplayPrice = info?.display_price;
  const button_styles = {
    flex: `1`,
    width: '100%',
    py: '16px',
    px: '24px',
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
      <Box w="full" mt="48px">
        <Flex
          direction="row"
          alignItems={'center'}
          gap="12px"
          justify={'space-between'}
          className="sub-text-regular"
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
                >
                  <HStack>
                    <Text fontSize={`16px`} textTransform={`capitalize`}>
                      {isWatchlisted ? `Added to Watchlist` : `notify when available`}
                    </Text>{' '}
                  </HStack>
                </Button>
              }
            />
          ) : has_fractions ? (
            <Button
              flex={`1`}
              py="16px"
              px="24px"
              h={`100%`}
              // bg='custom_color.color'
              bg={leftFractions <= 0 ? '#191919' : 'custom_color.color'}
              color={leftFractions <= 0 ? '#fff' : `custom_color.contrast`}
              borderRadius={`0px`}
              border="0.5px solid"
              borderColor={leftFractions <= 0 ? '#191919' : 'custom_color.color'}
              _hover={{bg: leftFractions <= 0 ? '#191919' : 'custom_color.color'}}
              // leftIcon={<Image alt="" src={fractionalImg.src} fontSize="20" />}
              leftIcon={<BsGrid1X2 fontSize="20" />}
              onClick={() => handleAuthClick(fractionalModal?.onOpen)}
              fontWeight="500"
              isDisabled={fractionalDetailLoading || leftFractions <= 0}
            >
              <HStack>
                <Text fontSize={`16px`}>
                  {leftFractions <= 0 ? 'Fractions Sold out' : 'Buy Fraction'}
                </Text>{' '}
              </HStack>
            </Button>
          ) : is_detached ? (
            !canDisplayPrice ? (
              <HStack
                justifyContent="center"
                gap="8px"
                bg="custom_color.color"
                py="16px"
                px="24px"
                maxH="52.2px"
                flex="1"
                onClick={contactModal.onOpen}
                cursor={`pointer`}
              >
                <ContactSVG />
                <Text fontSize="16px" fontWeight="500" color="custom_color.contrast">
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
                          <Text fontSize={`16px`}>Proceed To Payment</Text>{' '}
                        </HStack>
                      </Button>
                    }
                  />
                }
              />
            )
          ) : null}
          {info?.inspection_enabled && (
            <Button
              flex={`1`}
              py="16px"
              px="24px"
              w={`100%`}
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
              borderRadius={`0px`}
              border="0.5px solid"
              borderColor="custom_color.color"
              _focus={{
                opacity: info.is_sold_out || is_detached || has_fractions ? `auto` : `1`,
                bg:
                  info.is_sold_out || is_detached || has_fractions
                    ? 'custom_color.background'
                    : 'custom_color.color',
                border: '0.5px solid !important',
                borderColor: 'custom_color.color',
              }}
              _hover={{
                opacity: info.is_sold_out || is_detached || has_fractions ? `auto` : `1`,
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
                <Text fontSize={`16px`}>Schedule Inspection</Text>
              </HStack>
            </Button>
          )}
          <Button
            flex={`1`}
            py="16px"
            px="24px"
            h={`100%`}
            w={`100%`}
            // bg='custom_color.color'
            bg="custom_color.background"
            color="custom_color.color"
            borderRadius={`0px`}
            border="0.5px solid"
            borderColor="custom_color.color"
            _focus={{
              opacity: info.is_sold_out ? `auto` : `1`,
              border: '0.5px solid !important',
              borderColor: 'custom_color.color',
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
            _hover={{
              opacity: info.is_sold_out ? `auto` : `1`,
              border: '0.5px solid !important',
              borderColor: 'custom_color.color ',
            }}
            leftIcon={<BiPhoneCall fontSize={`18px`} />}
            onClick={contactModal.onOpen}
            fontWeight="500"
            isDisabled={info.is_sold_out}
          >
            <HStack>
              <Text fontSize={`16px`}>Contact Person</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>

      <RequestTourModal requestModal={requestModal} info={info} />
      <ContactPerson contactModal={contactModal} info={info} />
      <FractionalModal info={info} fractionalModal={fractionalModal} />
    </Box>
  );
};

export default PropertyInfo;
