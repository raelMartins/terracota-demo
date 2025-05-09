import React, {useEffect, useState} from 'react';
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
import OutrightTransactionInfo from '../../../components/manageAssets/outrightTransactionInfo';

import Allocations from '../../../components/manageAssets/components/allocation';
import {Button, Spinner} from '../../../ui-lib';
import {formatWithCommas} from '../../../utils';
import {IoChevronForward} from 'react-icons/io5';
import isMobile from '../../../utils/extras';
import {formatDateStringDayFirst} from '@/realtors_portal/utils/formatDate';
import {formatDate, monthDayYear} from '@/utils/formatDate';
import {formatPropertySize} from '@/utils/misc';

const absoluteStyle = {
  top: '20vh',
};

const OutrightAsset = () => {
  const {query} = useRouter();
  const [displayTab, setDisplayTab] = useState('transaction');

  const homeOwnersPacketModal = useDisclosure();
  const {data, isLoading, isError, refetch} = useQuery(
    ['fetchUserEquity', query?.id],
    () => fetchEquity(query?.id),
    {enabled: !!query?.id}
  );
  const info = data?.data;
  const feedModal = useDisclosure();

  const handleDisplaySwitch = prop => () => setDisplayTab(prop);

  const OVERVIEWINFO = [
    // {
    //   label: 'Property Type',
    //   value: info?.project?.building_type ?? '-',
    // },
    {
      label: 'Land Title',
      value: info?.project?.land_title ?? '-',
    },
    {
      label: 'Development Stage',
      value: info?.project?.status ?? '-',
    },
    {
      label: 'Unit size',
      value: formatPropertySize(info?.unit?.unit_size),
    },
    {
      label: 'Purchase Date',
      value: monthDayYear(info?.purchase_date),
    },

    {
      label: 'Allocated Unit',
      component: <Allocations equity={info} refetch={refetch} />,
      // show: info?.allocation || info?.can_allocate || info?.unit?.allocation_milestone, //only showng if there is an allocation or there is a chance of there being an allocation
      hide: !info?.can_allocate, //only showng if there is an allocation or there is a chance of there being an allocation
    },

    {
      label: 'Owners Packet',
      component: (
        <HStack color={`custom_color.color`} gap={`6px`} onClick={homeOwnersPacketModal.onOpen}>
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

  console.log({info});

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
                      fontSize={{base: '12px', sm: '12px', md: '14px'}}
                      onClick={homeOwnersPacketModal.onOpen}
                      color="matador_text.500"
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
                      Owners Packet
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

                <OutrightTransactionInfo displayTab={displayTab} />
              </AssetInfoWrapper>

              <HomeOwnersPacket equityId={info?.id} modal={homeOwnersPacketModal} />
              <PurchaseFeedback equity={info} feedModal={feedModal} />
            </>
          )}
        </AssetWrapper>
      </LayoutView>
    </>
  );
};

export default Auth(OutrightAsset, {absoluteStyle});
