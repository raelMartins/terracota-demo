import {useState} from 'react';
import {
  Image,
  useDisclosure,
  HStack,
  Flex,
  Stack,
  Text,
  Divider,
  useToast,
  Grid,
} from '@chakra-ui/react';

import {LayoutView} from '../../../components/page_layout';

import {useMutation, useQuery} from 'react-query';
import {fetchEquity} from '../../../api/listing';
import {useRouter} from 'next/router';
import homeOwner from '../../../images/home-owner.svg';
import homeOwnerLight from '../../../images/home-owner-light.svg';
import MakeDepositModal from '../sections/MakeDeposit';
import HomeOwnersPacket from '../sections/HomeOwnersPacket';
import ErrorState from '../../../components/appState/error-state';
import RecurringModal from '../sections/recurringModal';
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

import Allocations from '../../../components/manageAssets/components/allocation';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import {appCurrentTheme} from '../../../utils/localStorage';

import recurringIcon from '../../../images/icons/recurringIcon.svg';

import PaymentPlanTransaction from '../../../components/manageAssets/payment_plan/paymentPlanTransaction';
import {Button, Spinner} from '../../../ui-lib';
import {setUpRecurring} from '../../../api/Settings';
import ThreeDots from '../../../components/loaders/ThreeDots';
import {formatWithCommas} from '../../../utils';
import {PaymentAccess} from '@/components/payment/PaymentAccess';
import {formatPropertySize} from '@/utils/misc';

const absoluteStyle = {
  top: '30vh',
};

const PaymentPlan = () => {
  const {query} = useRouter();
  const toast = useToast();
  const recurringModal = useDisclosure();

  const [storeThemeInfo] = useLocalStorage('storeThemeInfo');

  const [displayTab, setDisplayTab] = useState('transaction');

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
      label: 'Allocated Unit',
      component: <Allocations equity={info} refetch={refetch} />,
      hide: !info?.can_allocate, //only showng if there is a chance of there being an allocation
    },
  ];
  const navBarStyle = {
    desktop: {
      display: {base: 'none', xl: 'flex'},
    },
    mobile: {
      display: 'none',
    },
  };

  const DisableAutoDebit = useMutation(formData => setUpRecurring(info?.id, formData), {
    onSuccess: res => {
      toast({
        title: `Recurring payments has been disabled!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      refetch();
    },
    onError: err => {
      toast({
        title: `Faild to disable recurring payments...`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleRecurringDeposit = () => {
    console.log('info', info);
    if (info?.auto_debit) {
      DisableAutoDebit.mutate({auto_debit: false});
    } else {
      recurringModal.onOpen();
    }
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
                justifySelf="stretch"
                w={{base: 'full', xl: 'full'}}
                displayTab={displayTab}
                handleDisplaySwitch={handleDisplaySwitch}
                useTabs
              >
                <AssetOverviewWrapper
                  useTabs
                  overviewInfo={OVERVIEWINFO}
                  maxH={{base: 'full', xl: 'fit-content'}}
                  maxW={{base: 'full', xl: '626.856px'}}
                  w={{base: 'full', xl: 'full'}}
                  display={{
                    base: displayTab === 'overview' ? 'block' : 'none',
                    xl: 'block',
                  }}
                >
                  <Grid
                    templateColumns={{base: `1fr`, md: `1fr 1fr`}}
                    w="full"
                    gap={{base: '16px'}}
                  >
                    <PaymentAccess
                      content={
                        <Stack
                          p={{base: '15px 10px'}}
                          spacing={{base: '5.19px', xl: '7.6px'}}
                          onClick={depositModal.onOpen}
                          border={{base: '0.648px solid', xl: '0.95px solid'}}
                          borderColor={`matador_border_color.100 !important`}
                          bg={`matador_background.100`}
                          justify="start"
                          w="full"
                          alignSelf="stretch"
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
                            maxW={{base: 'full', md: '185px'}}
                            fontSize={{base: '12px', md: `10px`}}
                            color="matador_text.500"
                            fontWeight="400"
                          >
                            Make a deposit by bank transfer or card payment
                          </Text>
                        </Stack>
                      }
                    />
                    {storeThemeInfo?.auto_pay_enabled ? (
                      <HStack
                        p={{base: '15px 10px'}}
                        border={{base: '0.648px solid', xl: '0.95px solid'}}
                        onClick={handleRecurringDeposit}
                        borderColor={`matador_border_color.100 !important`}
                        bg={`matador_background.100`}
                        w="full"
                        role="button"
                        justify="space-between"
                      >
                        <Stack spacing={{base: '5.19px', xl: '7.6px'}}>
                          <HStack spacing={{base: '5.19px', xl: '7.6px'}}>
                            <Image
                              src={
                                appCurrentTheme === LIGHT ? recurringIcon.src : recurringIcon.src
                              }
                              alt="deposit icon"
                              boxSize={{base: '16px', xl: '22.8px'}}
                            />
                            <Text
                              fontSize={{base: '14px', md: `12px`}}
                              color="matador_text.100"
                              fontWeight="500"
                            >
                              {info?.auto_debit
                                ? 'Disable Recurring Deposit'
                                : 'Enable Recurring Deposit'}
                            </Text>
                          </HStack>
                          <Text
                            maxW={{base: 'full', md: '185px'}}
                            fontSize={{base: '12px', md: `10px`}}
                            color="matador_text.500"
                            fontWeight="400"
                          >
                            {info?.auto_debit
                              ? 'By disabling, you will not automatically be debited from your fund source'
                              : 'By enabling, you wouldd automatically be debited from your fund source'}
                          </Text>
                        </Stack>
                        {DisableAutoDebit.isLoading ? (
                          <ThreeDots />
                        ) : (
                          <HStack
                            display={{base: 'none', md: 'flex'}}
                            justify="center"
                            bg="#2F2F2F"
                            p="5.699px 15.197px"
                            role="button"
                          >
                            <Text fontSize="11.297px" color="#ffffff" fontWeight="400">
                              {info?.auto_debit ? 'Disable' : 'Set'}
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                    ) : null}
                  </Grid>
                  <Divider
                    display={{lg: 'none', base: 'block'}}
                    border="none"
                    h="0.95px"
                    bg="matador_border_color.100"
                  />

                  <Flex gap={{base: '16px'}}>
                    <Button
                      w="50%"
                      className="inter-semibold"
                      borderRadius="0"
                      bg={`matador_background.100`}
                      border={{base: '0.648px solid', xl: '0.95px solid'}}
                      borderColor="matador_border_color.100 !important"
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
                      fontWeight="500"
                      borderRadius="0"
                      bg={`matador_background.100`}
                      border={{base: '0.648px solid', xl: '0.95px solid'}}
                      borderColor="matador_border_color.100 !important"
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

                <PaymentPlanTransaction displayTab={displayTab} equityInfo={info} useTabs />
              </AssetInfoWrapper>
              <MakeDepositModal refetch={refetch} info={info} depositModal={depositModal} />
              <HomeOwnersPacket equityId={info?.id} modal={homeOwnersPacketModal} />
              <PurchaseFeedback equity={info} feedModal={feedModal} />
              <RecurringModal refetch={refetch} equity={info} recurringModal={recurringModal} />
            </>
          )}
        </AssetWrapper>
      </LayoutView>
    </>
  );
};

export default Auth(PaymentPlan, {absoluteStyle});
