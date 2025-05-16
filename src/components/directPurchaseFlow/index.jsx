import {Center, Flex, HStack, Image, Stack, Text, VStack} from '@chakra-ui/react';
import {useState} from 'react';
import {useQuery} from 'react-query';
import {storeDetails} from '@/api/auth';
import {Spinner} from '@/ui-lib';
import {timeRelativeGreeting} from '@/utils/misc';
import {SelectAsset} from './select_asset';
import {SelectAssetIcon} from './assets';
import {FullScreenFooter} from './footer';
import {BioDataIcon} from './assets';
import {BioData} from './bio_data';
import {BankTransferIcon} from './assets';
import {PaymentMethodIcon} from './assets';
import {PaymentMethod} from './payment';

export const DirectPurchasePage = ({listing, unit, err}) => {
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const [screen, setScreen] = useState(`select_unit`);
  const [selectedUnit, setSelectedUnit] = useState(unit);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [fullPayment, setFullPayment] = useState(false);

  const store_data = STOREINFO.data?.data?.data;

  console.log({selectedPlan, selectedUnit});

  const page = {
    select_unit: {
      type: `select_unit`,
      icon: <SelectAssetIcon />,
      title: `Hi, ${timeRelativeGreeting()}!`,
      text: `We appreciate your interest—next steps are on the way.`,
      component: (
        <SelectAsset
          listing={listing}
          unit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setAmountToPay={setAmountToPay}
          fullPayment={fullPayment}
          setFullPayment={setFullPayment}
          nextStep={() => setScreen(`bio_data`)}
        />
      ),
    },
    bio_data: {
      type: `bio_data`,
      icon: <BioDataIcon />,
      title: `Bio-Data`,
      text: `Help us verify your information to keep your account up-to-date.`,
      component: <BioData nextStep={() => setScreen(`payment_method`)} />,
    },
    payment_method: {
      type: `payment`,
      icon: <PaymentMethodIcon />,
      title: `Payment Method`,
      text: `Choose how you’d like to pay safely and conveniently.`,
    },
    bank_transfer: {
      type: `payment`,
      icon: <BankTransferIcon />,
      title: `Bank Transfer`,
      text: `Pay directly from your bank account with either instant or conventional transfer options.`,
    },
    instant_bank_transfer: {
      type: `payment`,
      icon: <BankTransferIcon />,
      title: `Instant Bank Transfer`,
      text: `Pay directly from your bank account with either instant or conventional transfer options.`,
    },
  }[screen];

  const loading = false;

  // return !LoggedinUser || !asset ? (
  return loading ? (
    <Center minH={`100vh`} bg={`matador_background.100`}>
      <Spinner />
    </Center>
  ) : (
    <>
      <Stack minH={`100vh`} bg={`matador_background.100`} color={`text`}>
        <VStack
          align={`stretch`}
          justify={`stretch`}
          flex={`1`}
          pb={{base: `30px`}}
          px={{base: `20px`, lg: `100px`}}
        >
          <Flex
            direction={{base: `column`, lg: `row`}}
            gap={`32px`}
            flex={`1`}
            align={`stretch`}
            maxH={`100%`}
          >
            <VStack
              className="supplementary-font"
              flex={{base: `none`, lg: `1`}}
              gap={`24px`}
              align={`stretch`}
              maxW={{base: `100%`, lg: `409px`}}
              h={{base: `max-content`, lg: `calc(100vh - 100px)`}}
              position={{base: `static`, lg: `sticky`}}
              top={{base: `0px`, lg: `0px`}}
            >
              <HStack
                gap={'20px'}
                pt={{base: `24px`, lg: `0px`}}
                position={{base: `relative`, lg: `absolute`}}
                top={{base: `0px`, lg: `24px`}}
                left={`0px`}
              >
                <Center
                  w={`max-content`}
                  maxW="219px"
                  h="50px"
                  position={`relative`}
                  overflow={`hidden`}
                >
                  {store_data?.company_image && (
                    <Image
                      src={store_data?.company_image}
                      alt={'Company Image'}
                      fill
                      style={{objectFit: `contain`, height: `100%`, width: `auto`}}
                    />
                  )}
                </Center>
              </HStack>
              <Stack flex={`1`} justify={`center`} gap={{base: `4px`, lg: `6px`}}>
                {page?.icon}
                <Text
                  fontWeight={`600`}
                  fontSize={{base: `19px`, lg: `28.5px`}}
                  lineHeight={`130%`}
                  letterSpacing={`0%`}
                  textTransform={`capitalize`}
                >
                  {page?.title}
                </Text>
                <Text
                  fontWeight={`400`}
                  fontSize={{base: `13px`, lg: `19.5px`}}
                  lineHeight={`150%`}
                  letterSpacing={`2%`}
                  color={`matador_text.400`}
                  opacity={`.8`}
                >
                  {page?.text}
                </Text>
              </Stack>
            </VStack>
            <Center
              flex={{base: `none`, lg: `1`}}
              flexDir={`column`}
              pt={{base: `0px`, lg: `75px`}}
            >
              {page?.type === `payment` ? (
                <PaymentMethod
                  listing={listing}
                  unit={selectedUnit}
                  selectedPlan={selectedPlan}
                  setScreen={setScreen}
                  fullPayment={fullPayment}
                  amountToPay={amountToPay}
                />
              ) : (
                page?.component
              )}
            </Center>
          </Flex>
        </VStack>
        <FullScreenFooter store_data={store_data} />
      </Stack>
    </>
  );
};
