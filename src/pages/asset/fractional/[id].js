import React, {useState} from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  SimpleGrid,
  useDisclosure,
  GridItem,
  Center,
  Divider,
  HStack,
  Hide,
  useMediaQuery,
} from '@chakra-ui/react';

import {LayoutView} from '../../../components/page_layout';
import homeOwner from '../../../images/home-owner.svg';
import homeOwnerLight from '../../../images/home-owner-light.svg';
import giveFeedback from '../../../images/give-feedback.svg';
import giveFeedbackLight from '../../../images/give-feedback-light.svg';
import {useQuery} from 'react-query';
import {fetchEquity, fetchFractionalInfo} from '../../../api/listing';
import {useRouter} from 'next/router';

import HomeOwnersPacket from '../sections/HomeOwnersPacket';
import ErrorState from '../../../components/appState/error-state';

import Auth from '../../../hoc/Auth';

import PurchaseFeedback from '../../../components/purchaseFeedback';

import {appCurrentTheme} from '../../../utils/localStorage';
import {LIGHT} from '../../../constants/names';
import AssetHeader from '../../../components/manageAssets/components/assetHeader';
import AssetWrapper from '../../../components/manageAssets/components/layoutWrapper/assetWrapper';
import AssetInfoWrapper from '../../../components/manageAssets/components/layoutWrapper/assetInfoWrapper';
import AssetOverviewWrapper from '../../../components/manageAssets/components/layoutWrapper/assetOverviewWrapper';
import FractionalTransactionInfo from '../../../components/manageAssets/fractionalTransactionInfo';
import {Button, Spinner} from '../../../ui-lib';
import HoverText from '../../../ui-lib/ui-lib.components/hover/hoverOnText';
import {formatToCurrency, formatWithCommas} from '../../../utils';
import {InvestorsPacket} from '../sections/InvestorsPacket';
import {IoChevronForward} from 'react-icons/io5';
import isMobile from '../../../utils/extras';

const absoluteStyle = {
  top: '40vh',
};

const FractionalAsset = () => {
  const {query} = useRouter();
  const [displayTab, setDisplayTab] = useState('transaction');

  const recurringModal = useDisclosure();

  const investorsPacketDisclosure = useDisclosure();
  const {data, isLoading, isError, refetch} = useQuery(
    ['fetchUserEquity', query?.id],
    () => fetchEquity(query?.id),
    {enabled: !!query?.id}
  );
  const info = data?.data;
  const feedModal = useDisclosure();

  const handleDisplaySwitch = prop => () => setDisplayTab(prop);

  const {data: fractionalDetail} = useQuery(
    ['fractional', info?.unit?.id],
    () => fetchFractionalInfo(info?.unit?.id),
    {enabled: !!info?.unit?.id}
  );

  console.log({fractionalDetail, info});

  const stackHolders = fractionalDetail?.data?.partners;
  const dividendObj = fractionalDetail?.data?.extra_info;

  const customScrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '4px',
      borderRadius: '16px',
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      borderRadius: '16px',
      WebkitBoxShadow: 'inset 0 0 6px #fff',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: '16px',
      backgroundColor: '#cbcbcb',
    },
  };
  const stake_holders_array = stackHolders
    ? stackHolders?.map(item => {
        return {label: item?.stakeholder_type, value: item.stakeholder_name};
      })
    : [];

  const OVERVIEWINFO = [
    {
      label: 'Fractional Value',
      component: (
        <Text
          fontSize={{base: '12px', md: '13.664px'}}
          lineHeight={{base: '14px', md: '17px'}}
          fontWeight="600"
          color="text"
        >
          {info?.fractional_equity_value ? formatToCurrency(info?.fractional_equity_value) : '-'}
        </Text>
      ),
    },
    {label: 'Total Fractions', value: info?.amount_of_fractions ?? '-'},
    // {
    //   label: 'Land Title',
    //   value: info?.project?.land_title ?? '-',
    // },
    // {
    //   label: 'Development Stage',
    //   value: info?.project?.status ?? '-',
    // },
    // {
    //   label: 'Unit size',
    //   value: `${formatWithCommas(info?.project?.land_size) ?? '-'} sqm`,
    // },

    // {label: 'Unit type', value: info?.project?.building_type ?? '-'},
    ...(info?.allocation
      ? [
          {
            label: 'Allocation',
            value: info?.allocation ? info.allocation : 'Not Allocated',
          },
        ]
      : []),
    {label: 'Holding Period', value: info?.unit?.holding_period ?? '-'},
    ...stake_holders_array,
    {
      label: 'Investors Packet',
      component: (
        <HStack
          color={`custom_color.color`}
          gap={`6px`}
          onClick={() => {
            fractionalDetail?.data?.packets?.length && fractionalDetail?.data?.packets?.length === 1
              ? window.open(
                  `${
                    fractionalDetail?.data?.packets?.[0]?.packet
                      ? fractionalDetail?.data?.packets?.[0]?.packet
                      : ''
                  }`,
                  '_blank'
                )
              : investorsPacketDisclosure.onOpen();
          }}
        >
          <Text fontSize={`12px`}>View</Text>
          <IoChevronForward fontSize={`14px`} />{' '}
        </HStack>
      ),
      // show: info?.allocation || info?.can_allocate || info?.unit?.allocation_milestone, //only showng if there is an allocation or there is a chance of there being an allocation
      hide: !isMobile,
    },
    // {
    //   label: 'Give Feedback',
    //   component: (
    //     <HStack color={`custom_color.color`} gap={`6px`} onClick={feedModal.onOpen}>
    //       <Text fontSize={`12px`}>View</Text>
    //       <IoChevronForward fontSize={`14px`} />{' '}
    //     </HStack>
    //   ),
    //   // show: info?.allocation || info?.can_allocate || info?.unit?.allocation_milestone, //only showng if there is an allocation or there is a chance of there being an allocation
    //   hide: !isMobile,
    // },
  ];
  const navBarStyle = {
    desktop: {
      display: {base: 'none', xl: 'flex'},
    },
    mobile: {
      display: 'none',
    },
  };

  return (
    <>
      <LayoutView spacing="0px" navBarStyle={navBarStyle} noPadding>
                {/* removed fixed "fixedFooter" attribute temporarily t maintain padding on top of the footer. this comment is necessary for now*/}
        <AssetWrapper>
          {isError ? (
            <ErrorState />
          ) : isLoading || !info ? (
            <Spinner absoluteStyle={absoluteStyle} />
          ) : (
            <>
              <AssetHeader
                listingName={info?.project?.name ?? '-'}
                unitName={info?.unit?.unit_title ?? '-'}
                bgImg={info?.project?.photos?.[0]?.photo}
                info={info}
              />

              <AssetInfoWrapper
                maxW="1305px"
                spacing="31.3px"
                pt={{base: '0px', xl: '42.75px'}}
                displayTab={displayTab}
                handleDisplaySwitch={handleDisplaySwitch}
              >
                <AssetOverviewWrapper
                  overviewInfo={OVERVIEWINFO}
                  maxH={{base: 'full', xl: 'fit-content'}}
                  maxW={{base: 'full', xl: '646.13px'}}
                  w={{base: 'full', xl: 'full'}}
                >
                  <Flex gap={{base: '16px', xl: '15.2px'}}>
                    <Button
                      w="50%"
                      className="inter-semibold"
                      borderRadius="0"
                      borderColor="matador_border_color.100 !important"
                      bg={`matador_background.100`}
                      border={{base: '0.648px solid', xl: '0.95px solid'}}
                      color="matador_text.500"
                      fontSize={{base: '12px', sm: '12px', md: '14px'}}
                      // onClick={investorsPacketDisclosure.onOpen}
                      onClick={() => {
                        fractionalDetail?.data?.packets?.length &&
                        fractionalDetail?.data?.packets?.length === 1
                          ? window.open(
                              `${
                                fractionalDetail?.data?.packets?.[0]?.packet
                                  ? fractionalDetail?.data?.packets?.[0]?.packet
                                  : ''
                              }`,
                              '_blank'
                            )
                          : investorsPacketDisclosure.onOpen();
                      }}
                      h={{base: '48px', xl: '41.79px'}}
                      fontWeight="500"
                      iconSpacing={{base: '10.68px', xl: '15.2px'}}
                      leftIcon={
                        <Image
                          alt="next_image"
                          boxSize={{base: '16px', xl: '22.795px'}}
                          src={appCurrentTheme === LIGHT ? homeOwner.src : homeOwnerLight.src}
                        />
                      }
                    >
                      Investor&apos;s packet
                    </Button>
                    <Button
                      w="50%"
                      className="inter-semibold"
                      borderRadius="0"
                      borderColor="matador_border_color.100 !important"
                      bg={`matador_background.100`}
                      border={{base: '0.648px solid', xl: '0.95px solid'}}
                      fontSize={{base: '12px', sm: '12px', md: '14px'}}
                      onClick={feedModal.onOpen}
                      color="matador_text.500"
                      fontWeight="500"
                      h={{base: '48px', xl: '41.79px'}}
                      leftIcon={
                        <Image
                          alt="next_image"
                          boxSize={{base: '16px', xl: '22.795px'}}
                          src={appCurrentTheme === LIGHT ? giveFeedback.src : giveFeedbackLight.src}
                        />
                      }
                    >
                      Give Feedback
                    </Button>
                  </Flex>
                </AssetOverviewWrapper>

                <FractionalTransactionInfo displayTab={displayTab} dividendObj={dividendObj} />
              </AssetInfoWrapper>

              <InvestorsPacket
                equityId={info?.id}
                modal={investorsPacketDisclosure}
                packets={fractionalDetail?.data?.packets}
              />
              {/* <HomeOwnersPacket equityId={info?.id} modal={investorsPacketDisclosure} /> */}
              <PurchaseFeedback equity={info} feedModal={feedModal} />
            </>
          )}
        </AssetWrapper>
      </LayoutView>
    </>
  );
};

export default Auth(FractionalAsset, {absoluteStyle});
