import {Box, Stack, useDisclosure, useTheme} from '@chakra-ui/react';
import {Navbar} from '../navbar';
import SupportMenu from '../support/SupportMenu';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {Footer} from './footer';
import {fullScreenAuth, SUBSCRIPTION_DECLINED} from '../../constants/routes';
import useGetSession from '@/utils/hooks/getSession';
import {FullScreenPreRequisites} from '../fullScreenPrerequisites/FullScreenPrerequisites';
import Head from 'next/head';
import {capitalizeString} from '@/utils/misc';

export const LayoutView = ({
  children,
  noPadding,
  navBarStyle,
  activePage,
  noFooter,
  noNavbar,
  fixedFooter,
  openAuth,
  metaData = {title: ``, image: ``, description: ``},
  ...rest
}) => {
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');
  const {sessionData: store_data} = useGetSession('store_data');

  const router = useRouter();
  const theme = useTheme();

  const {isOpen, onOpen, onClose} = useDisclosure();
  const isAuthPage = router.pathname.indexOf('auth') !== -1;
  useEffect(() => {
    document.body.style.background = SUBSCRIPTION_DECLINED
      ? ''
      : `${theme?.colors?.matador_background?.[`100`]}`;

    var css = `
      html { 
        background: ${theme?.colors?.matador_background?.[`100`]};
      } 
      body { 
        background: ${theme?.colors?.matador_background?.[`100`]};
      } 
      *::-webkit-scrollbar {
        width: 15px;
      }
      *::-webkit-scrollbar-thumb {
        border: 4px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
        border-radius: 9999px;
        background-color: ${theme?.colors?.matador_form?.label};
      };
      `,
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    head.appendChild(style);

    // style.type = 'text/css';
    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }, []);
  return (
    <>
      <Head>
        {/* Basic */}
        {metaData?.title && (
          <title>{capitalizeString(`${metaData?.title} | ${store_data?.store_name}`)}</title>
        )}
        {metaData?.description && <meta name="description" content={metaData?.description} />}

        {/* Open Graph Meta Tags */}
        {metaData?.title && (
          <meta
            property="og:title"
            content={capitalizeString(`${metaData?.title} | ${store_data?.store_name}`)}
          />
        )}
        {metaData?.description && (
          <meta property="og:description" content={metaData?.description} />
        )}
        <meta
          property="og:image"
          content={
            metaData?.image?.photo ||
            metaData?.image?.original ||
            metaData?.image ||
            store_data?.company_image
          }
        />
        <meta property="og:site_name" content={store_data?.store_name} />

        {/* Twitter Meta Tags */}
        {metaData?.title && (
          <meta
            name="twitter:title"
            content={capitalizeString(`${metaData?.title} | ${store_data?.store_name}`)}
          />
        )}
        {metaData?.description && (
          <meta name="twitter:description" content={metaData?.description} />
        )}
        <meta
          name="twitter:image"
          content={
            metaData?.image?.photo ||
            metaData?.image?.photo?.[0] ||
            metaData?.image?.original ||
            metaData?.image ||
            store_data?.company_image
          }
        />
        <meta name="twitter:image:alt" content={`Image of ${store_data?.store_name}`} />
        <meta name="twitter:site" content={`@${store_data?.store_name}`} />
        <meta name="twitter:card" content={'summary_large_image'} />
      </Head>
      <FullScreenPreRequisites>
        <Stack
          bg="background"
          h={'100%'}
          w={`100%`}
          maxW={`1600px`}
          mx={`auto`}
          minH="100vh"
          minInlineSize={'fit-content'}
          justify="space-between"
          color={`text`}
          gap={`0px`}
          pb={`40px`}
          position={`relative`}
          {...rest}
        >
          {!noNavbar && (
            <Navbar navBarStyle={navBarStyle} activePage={activePage} handleGetStarted={openAuth} />
          )}
          <Box
            flex={1}
            h="full"
            w={'100%'}
            px={noPadding ? '0' : {base: '20px', lg: '100px'}}
            pb={{base: '50px', xl: '51.5px'}}
            mt={`0px !important `}
          >
            {children}
          </Box>
          {isAuthPage ? null : <SupportMenu isOpen={isOpen} onClose={onClose} onOpen={onOpen} />}
          {!noFooter && (
            <Footer
              position={(fullScreenAuth && !LoggedinUser) || fixedFooter ? `fixed` : `absolute`}
              bottom={`0px`}
              left={`0px`}
              width={`100%`}
              zIndex={LoggedinUser ? `1` : `2000`}
            />
          )}
        </Stack>
      </FullScreenPreRequisites>
    </>
  );
};

export default LayoutView;
