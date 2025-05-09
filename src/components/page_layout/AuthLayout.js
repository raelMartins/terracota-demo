import auth_background_mobile from '/src/images/auth_background_mobile.png';
import {Box, Center, Flex, useMediaQuery, useTheme} from '@chakra-ui/react';
import {cloneElement, isValidElement, useEffect, useState} from 'react';
import {Spinner} from '../../ui-lib';
import {Footer} from './footer';
import {Navbar} from '../navbar';
import Register from '../auth/register';

import AgentRegister from '../../realtors_portal/components/auth/agent_register';
import useGetSession from '../../utils/hooks/getSession';
import ServiceDowntime from '../../pages/service_downtime';
import {declinceAppAccessDueToPayment, storeName} from '../../constants/routes';

export function AuthLayout({
  agent,
  authPage,
  screen,
  InnerComponent,
  disableClick = false,
  children,
  popupOnMount,
}) {
  const [loading, set_loading] = useState(false);
  const [clicked, set_clicked] = useState(authPage ? true : false);
  const [mount, set_mount] = useState(authPage ? true : false);
  const [auth_engaged, set_auth_engaged] = useState(false);
  const [isNotMobile] = useMediaQuery('(min-width: 992px)');
  const theme = useTheme();
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const handle_click = () => {
    if (authPage) return;
    if (isNotMobile || !auth_engaged) {
      if (!clicked) {
        set_mount(true);
        setTimeout(() => {
          set_clicked(true);
        }, 50);
      } else {
        set_clicked(false);
        setTimeout(() => {
          set_mount(false);
        }, 600);
      }
    } else if (clicked) {
      return;
    } else {
      set_clicked(true);
      set_loading(true);
      set_mount(true);
      setTimeout(() => {
        set_loading(false);
      }, 600);
    }
  };

  useEffect(() => {
    document.body.style.background = `${theme?.colors?.matador_background?.[`100`]}`;

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

  useEffect(() => {
    if (popupOnMount) {
      setTimeout(() => {
        handle_click();
      }, 5000);
    }
  }, []);

  return declinceAppAccessDueToPayment?.includes(storeName) ? (
    <ServiceDowntime />
  ) : LoggedinUser && !agent && (children || InnerComponent) ? (
    InnerComponent ? (
      isValidElement(InnerComponent) ? (
        cloneElement(InnerComponent, {
          openAuth: handle_click,
        })
      ) : (
        children
      )
    ) : (
      children
    )
  ) : loading ? (
    <Center h={`100vh`}>
      <Spinner />
    </Center>
  ) : (
    <Flex
      w="full"
      minH="100vh"
      h={clicked ? `100vh` : `100%`}
      overflow={clicked ? `hidden` : `auto`}
      position={`relative`}
      direction={`column`}
      color={`matador_text.100`}
    >
      {!authPage && (
        <Box zIndex={`2001`}>
          {/* {agent ? null : !isNotMobile && clicked ? null : (
            <Navbar navBarStyle={{zIndex: `3`}} handleGetStarted={handle_click} />
          )} */}
        </Box>
      )}

      {/* <Footer
        position={`fixed`}
        bottom={`0px`}
        left={`0px`}
        w={`100%`}
        bg={`matador_background.100`}
        opacity={`1`}
        zIndex={`2001`}
      /> */}
      {(mount || disableClick) && (
        <Flex
          position={'fixed'}
          alignItems={{md: `center`}}
          justifyContent={{md: `center`}}
          left={`0px`}
          top={`0px`}
          right={`0px`}
          bottom={`0px`}
          flexDir={`column`}
          bgImage={
            authPage
              ? auth_background_mobile.src
              : {base: auth_engaged ? auth_background_mobile.src : `none`, lg: `none`}
          }
          bgColor={
            authPage
              ? `#ffffff`
              : {base: auth_engaged ? `#ffffff` : `transparent`, lg: `transparent`}
          }
          transition={`.5s`}
          opacity={clicked ? `1` : `0`}
          zIndex={`2000`}
        >
          <Box
            position={`absolute`}
            top={`0px`}
            left={`0px`}
            bottom={`0px`}
            right={`0px`}
            width={`100%`}
            height={`100%`}
            bgColor={`matador_background.100`}
            opacity={
              authPage ? `.95` : clicked ? {base: auth_engaged ? `.95` : `.7`, lg: '.7'} : `0`
            }
            onClick={handle_click}
            transition={`.5s`}
            zIndex={`1`}
            cursor={!authPage ? `pointer` : `auto`}
          />
          {agent ? (
            <Box
              w={`100%`}
              overflow={`auto`}
              mt={{base: `0px`, md: `70px`}}
              mb={{base: `70px`}}
              zIndex={`1`}
            >
              <AgentRegister screen={screen} />
            </Box>
          ) : (
            <Box
              w={authPage ? `100%` : {base: `100%`, lg: `max-content`}}
              overflow={`auto`}
              mt={{base: `0px`, md: `70px`}}
              mb={{base: `70px`}}
              my={{base: authPage ? `15px` : !auth_engaged ? `auto` : `0px`, md: `70px`}}
            >
              <Register
                zIndex={disableClick && !clicked ? `0` : `1`}
                screen={screen}
                set_auth_engaged={set_auth_engaged}
                authPage={authPage}
              />
            </Box>
          )}
        </Flex>
      )}

      <Flex
        flex="1"
        h={`100%`}
        alignItems={{base: 'flex-start', md: `center`}}
        pointerEvents={disableClick ? `none` : `auto`}
      >
        {InnerComponent
          ? isValidElement(InnerComponent)
            ? cloneElement(InnerComponent, {
                openAuth: handle_click,
              })
            : children
          : children}
        {/* {children} */}
      </Flex>
    </Flex>
  );
}
