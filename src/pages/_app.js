/* eslint-disable @next/next/no-page-custom-font */
import Head from 'next/head';
import {useRouter} from 'next/router';
import {StrictMode, useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider, Hydrate} from 'react-query';
import NoSSR from 'react-no-ssr';
import {Center, ChakraProvider, extendTheme} from '@chakra-ui/react';
import Preloader from '@/components/common/preloader';
import {Custom400} from '@/components/page_layout/Custom400';
import {declinceAppAccessDueToPayment, store_name} from '@/constants/routes';
import useLocalStorage from '@/utils/hooks/useLocalStorage';
import {setSession} from '@/utils/sessionmanagers';
import {capitalizeString} from '@/utils/misc';
import {storeDetails, storeDomainCheck} from '@/api/auth';
import {currentTheme, get_hex_color_complements} from '@/theme';
import {Spinner} from '@/ui-lib';
import icon from '@/images/gidi_icon.svg';
import ServiceDowntime from './service_downtime';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {retry: 1, refetchOnWindowFocus: false},
    mutations: {retry: 0},
  },
});

export default function MyApp({Component, pageProps}) {
  const router = useRouter();
  const storeName = store_name();
  const SUBSCRIPTION_DECLINED = declinceAppAccessDueToPayment?.includes(storeName);

  const [objForLocalStorage, setValueForLocalStorage] = useLocalStorage([
    'storeThemeInfo',
    'companyImage',
  ]);
  const [storeDoesNotExist, setStoreDoesNotExist] = useState(false);
  const storeThemeInfo = objForLocalStorage?.storeThemeInfo;
  const companyImage = objForLocalStorage?.companyImage;
  const primary_color = storeThemeInfo?.theme_color || '#FAB702';
  const theme = storeThemeInfo?.theme_mode;
  const customColors = get_hex_color_complements(primary_color, theme);

  const CURRENT_THEME = currentTheme(theme);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const storeInfo = await storeDomainCheck();
        const storeInfoData = storeInfo?.data?.store;

        if (storeInfoData) {
          const {
            company_image: storeInfoImage,
            store_name: storeName,
            agent_features: agentActive,
            fractional_features: isFractionalEnabled,
            auto_pay_features: autoPayEnabled,
            co_ownership_features: isCoownershipEnabled,
            theme_color,
            theme_mode,
          } = storeInfoData;

          const allStoreDetails = await storeDetails(storeName);
          const generalStoreDetails = allStoreDetails?.data?.data;
          const businessId = storeInfo?.data?.store?.business?.business_id;
          const businessName = storeInfo?.data?.store?.owner?.company_name;

          const themeColor = theme_color ? theme_color : '#2F2F2F';
          const themeMode = SUBSCRIPTION_DECLINED ? 'light' : theme_mode ? theme_mode : 'light';

          const newStoreThemeInfo = {
            agentActive,
            isFractionalEnabled,
            autoPayEnabled,
            isCoownershipEnabled,
            theme_color: themeColor,
            theme_mode: themeMode,
          };

          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          if (businessId) {
            setSession(businessId, 'businessId', expires);
          }
          setSession(storeName, 'store_name', expires);
          const set_store_data = {
            store_name: storeName,
            agent_active: generalStoreDetails?.agent_active,
            company_image: generalStoreDetails?.company_image,
            fractions_enabled: generalStoreDetails?.fractions_enabled,
            auto_pay_enabled: generalStoreDetails?.auto_pay_enabled,
            withdrawal_enabled: storeInfoData?.withdrawal_enabled,
            wallet_features: generalStoreDetails?.wallet_features,
            service_down: generalStoreDetails?.service_down,
            gateway_disabled: generalStoreDetails?.gateway_disabled,
            terms: generalStoreDetails?.customer_document,
            privacy_policy: generalStoreDetails?.customer_privacy_policy,
            agent_terms: generalStoreDetails?.agent_document,
            agent_privacy_policy: generalStoreDetails?.agent_privacy_policy,
          };
          setSession(set_store_data, 'store_data', expires);

          if (typeof window !== 'undefined') {
            if (businessName) localStorage.setItem('businessName', JSON.stringify(businessName));
            if (storeInfoImage) {
              localStorage.setItem('companyImage', JSON.stringify(storeInfoImage));
            }
            localStorage.setItem('storeName', JSON.stringify(storeName));
            localStorage.setItem('baseCurrency', storeInfo?.data?.currency);
            localStorage.setItem('baseCountry', storeInfo?.data?.country);
            localStorage.setItem('storeThemeInfo', JSON.stringify(newStoreThemeInfo));
            localStorage.setItem('my_preferred_colors', JSON.stringify(themeColor));
            localStorage.setItem('my_preferred_theme', JSON.stringify(themeMode));
            setValueForLocalStorage('storeThemeInfo', JSON.stringify(newStoreThemeInfo));
            setValueForLocalStorage('companyImage', JSON.stringify(storeInfoImage));
          }
        }
      } catch (err) {
        setStoreDoesNotExist(true);
      }
    };
    SUBSCRIPTION_DECLINED ? '' : fetchStoreInfo();
  }, []);
  if (declinceAppAccessDueToPayment?.includes(storeName)) {
    router.push('/service_downtime');
  }
  const art_deco_auths = ['gidirealestate-dev', `gidirealestateinvestment`];

  const custom_theme = {...CURRENT_THEME, colors: {...CURRENT_THEME.colors, ...customColors}};

  return (
    <ChakraProvider theme={extendTheme(custom_theme)}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>
            {capitalizeString(
              storeName ? `${storeName} - Luxury Properties for Discerning Buyers` : `loading`
            )}
          </title>
          <meta name="description" content={`Property Development Company`} />
          <link
            rel="icon"
            href={
              storeName === `gidirealestate-dev` || storeName === 'gidirealestateinvestment'
                ? icon.src
                : companyImage ?? ''
            }
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=League+Spartan:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
            rel="stylesheet"
          />

          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <NoSSR onSSR={<Preloader />}>
          <Hydrate state={pageProps.dehydratedState}>
            <StrictMode>
              {storeDoesNotExist ? (
                <Custom400 />
              ) : SUBSCRIPTION_DECLINED ? (
                <ServiceDowntime />
              ) : !storeThemeInfo?.theme_color || !storeName ? (
                <Center h="100vh" w="100vw" bg={`matador_background.100`}>
                  <Spinner />
                </Center>
              ) : (
                <Component {...pageProps} currentTheme={theme} />
              )}
            </StrictMode>
          </Hydrate>
        </NoSSR>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
