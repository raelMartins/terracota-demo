import React, {useState} from 'react';
import {Image, useDisclosure, HStack, Flex, Stack, Text, Button} from '@chakra-ui/react';

import {LayoutView} from '../../../components/page_layout';

import {useQuery} from 'react-query';
import {fetchEquity} from '../../../api/listing';
import {useRouter} from 'next/router';
import homeOwner from '../../../images/home-owner.svg';
import homeOwnerLight from '../../../images/home-owner-light.svg';
import MakeDepositModal from '../sections/MakeDeposit';
import HomeOwnersPacket from '../sections/HomeOwnersPacket';
import ErrorState from '../../../components/appState/error-state';
import Auth from '../../../hoc/Auth';
import deposit from '../../../images/make-a-depo-img.svg';
import depositLight from '../../../images/make-a-depo-img-light.svg';
import {LIGHT} from '../../../constants/names';
import giveFeedback from '../../../images/give-feedback.svg';
import giveFeedbackLight from '../../../images/give-feedback-light.svg';
import PurchaseFeedback from '../../../components/purchaseFeedback';

import AssetHeader from '../../../components/manageAssets/components/assetHeader';
import AssetWrapper from '../../../components/manageAssets/components/layoutWrapper/assetWrapper';
import AssetInfoWrapper from '../../../components/manageAssets/components/layoutWrapper/assetInfoWrapper';
import AssetOverviewWrapper from '../../../components/manageAssets/components/layoutWrapper/assetOverviewWrapper';

import CoownersTransactions from '../../../components/manageAssets/coownership/coownersTransactions';
import Allocations from '../../../components/manageAssets/components/allocation';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import {appCurrentTheme} from '../../../utils/localStorage';

import {Spinner} from '/src/ui-lib';
import {formatWithCommas} from '../../../utils';
import useGetSession from '../../../utils/hooks/getSession';
import {PaymentAccess} from '@/components/payment/PaymentAccess';
import {formatPropertySize} from '@/utils/misc';

const absoluteStyle = {
  top: '20vh',
};

const Coownership = () => {
  const {query} = useRouter();
  const [displayTab, setDisplayTab] = useState('transaction');
  const {sessionData: user} = useGetSession('loggedIn');

  const depositModal = useDisclosure();
  const homeOwnersPacketModal = useDisclosure();
  const feedModal = useDisclosure();

  const {data, isLoading, isError, refetch} = useQuery(
    ['fetchUserEquity', query?.id],
    () => fetchEquity(query?.id),
    {enabled: !!query?.id}
  );

  const info = data?.data;

  const handleDisplaySwitch = prop => () => setDisplayTab(prop);

  const OVERVIEWINFO = [
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

    ...(info?.owner?.id === user?.user?.id
      ? [
          {
            label: 'Allocated Unit',
            component: <Allocations equity={info} refetch={refetch} />,
          },
        ]
      : []),
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
      <LayoutView spacing="0px" navBarStyle={navBarStyle} noPadding fixedFooter>
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
                justifySelf="stretch"
                w={{base: 'full', xl: 'full'}}
                // gap="31.3px"
                pt={{base: '0px', xl: '108px'}}
                displayTab={displayTab}
                handleDisplaySwitch={handleDisplaySwitch}
              >
                <AssetOverviewWrapper
                  overviewInfo={OVERVIEWINFO}
                  // maxH={{base: 'full', xl: '460px'}}
                  maxW={{base: 'full', xl: '626.856px'}}
                  w={{base: 'full', xl: 'full'}}
                  display={{
                    base: displayTab === 'overview' ? 'block' : 'none',
                    xl: 'block',
                  }}
                >
                  <PaymentAccess
                    content={
                      <Stack
                        p={{base: '15px 10px'}}
                        spacing={{base: '5.19px', xl: '7.6px'}}
                        onClick={depositModal.onOpen}
                        minH={{base: '52px', md: '74px'}}
                        border={{base: '0.648px solid', xl: '0.95px solid'}}
                        borderColor="matador_border_color.100 !important"
                        bg={`matador_background.100`}
                        justify="start"
                        maxW={{base: 'full', md: '237.445px'}}
                        role="button"
                      >
                        <HStack spacing={{base: '5.19px', xl: '7.6px'}}>
                          <Image
                            src={appCurrentTheme === LIGHT ? deposit.src : depositLight.src}
                            alt="deposit icon"
                            boxSize={{base: '16px', xl: '22.8px'}}
                          />
                          <Text
                            fontSize={{base: '14px', md: `12px`}}
                            color="matador_text.100"
                            fontWeight="500"
                          >
                            Make a Deposit
                          </Text>
                        </HStack>
                        <Text
                          fontSize={{base: '12px', md: `10px`}}
                          color="matador_text.500"
                          fontWeight="400"
                        >
                          Make a deposit by bank transfer or card payment
                        </Text>
                      </Stack>
                    }
                  />
                  <Flex gap={{base: '16px', xl: '15.2px'}}>
                    <Button
                      w="50%"
                      className="inter-semibold"
                      _hover={{
                        bg: 'transparent',
                      }}
                      _focus={{
                        bg: 'transparent',
                        border: {
                          base: '0.648px solid !important',
                          xl: '0.95px solid !important',
                        },
                        borderColor: 'matador_border_color.100 !important',
                      }}
                      _active={{
                        bg: 'transparent',
                        border: {
                          base: '0.648px solid !important',
                          xl: '0.95px solid !important',
                        },
                        borderColor: 'matador_border_color.100 !important',
                      }}
                      borderRadius="0"
                      borderColor="matador_border_color.100 !important"
                      bg={`matador_background.100`}
                      border={{base: '0.648px solid', xl: '0.95px solid'}}
                      fontSize={{base: '12px', sm: '12px', md: '14px'}}
                      onClick={homeOwnersPacketModal.onOpen}
                      color="matador_text.500"
                      h={{base: '48px', xl: '41.79px'}}
                      iconSpacing={{base: '10.68px', xl: '15.2px'}}
                      fontWeight="500"
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
                      _hover={{
                        bg: 'transparent',
                      }}
                      _focus={{
                        bg: 'transparent',
                        border: {
                          base: '0.648px solid !important',
                          xl: '0.95px solid !important',
                        },
                        borderColor: 'matador_border_color.100 !important',
                      }}
                      _active={{
                        bg: 'transparent',
                        border: {
                          base: '0.648px solid !important',
                          xl: '0.95px solid !important',
                        },
                        borderColor: 'matador_border_color.100 !important',
                      }}
                      fontWeight="500"
                      borderRadius="0"
                      borderColor="matador_border_color.100 !important"
                      bg={`matador_background.100`}
                      border={{base: '0.648px solid', xl: '0.95px solid'}}
                      fontSize={{base: '12px', sm: '12px', md: '14px'}}
                      onClick={feedModal.onOpen}
                      color="matador_text.500"
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

                <CoownersTransactions displayTab={displayTab} equityInfo={info} />
              </AssetInfoWrapper>
              <MakeDepositModal refetch={refetch} info={info} depositModal={depositModal} />
              <HomeOwnersPacket equityId={info?.id} modal={homeOwnersPacketModal} />
              <PurchaseFeedback equity={info} feedModal={feedModal} />
            </>
          )}
        </AssetWrapper>
      </LayoutView>
    </>
  );
};

export default Auth(Coownership, {absoluteStyle});
