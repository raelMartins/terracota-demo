import React from 'react';
import {Center, DrawerCloseButton, Flex, Icon, Image, Link, Text} from '@chakra-ui/react';
import {VStack, Drawer, DrawerOverlay, DrawerContent, DrawerBody, Divider} from '@chakra-ui/react';
import logoMobile from '../../images/mobile-logo-white.png';
import {Button} from '../../ui-lib';
import {RxCross1} from 'react-icons/rx';
import {IoMdSettings} from 'react-icons/io';
import {FaFileLines} from 'react-icons/fa6';
import {PiMagnifyingGlassFill} from 'react-icons/pi';
import {useRouter} from 'next/router';
import ProfileIcon from '../../images/icons/user-profile.svg';

import feedbackIcon from '../../images/navar/feedback.svg';
import suggestIcon from '../../images/navar/suggest.svg';
import reportBugIcon from '../../images/navar/reportBug.svg';
import termsIcon from '../../images/navar/terms.svg';
import logoutIcon from '../../images/navar/logout.svg';
import settingIcon from '../../images/navar/settings.svg';

import {BiMessageAltAdd, BiSolidMessageDetail} from 'react-icons/bi';
import {deleteCookies} from '../../utils/sessionmanagers';
import useGetSession from '../../utils/hooks/getSession';
import {PaymentAccess} from '../payment/PaymentAccess';

export const MobileDrawerComp = ({
  feedBackModal,
  reportBugModal,
  suggestModal,
  onNotOpen,
  onAssetOpen,
  onWatchOpen,
  onWalOpen,
  isDrawerOpen,
  onDrawerClose,
  avatar,
  TERMS,
  handleGetStarted,
  PRIVACY_POLICY,
  about_us_link,
  wallet_features,
}) => {
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const router = useRouter();

  const auth_data = [
    {
      key: 'myAssets',
      title: 'Portfolio',
      // image: appCurrentTheme === LIGHT ? homeIcon : homeIconLight,
      onClick: () => {
        onDrawerClose();
        onAssetOpen();
      },
    },
    {
      key: 'watchlist',
      title: 'My watchlist',
      // image: appCurrentTheme === LIGHT ? watchlistIcon : watchlistIconLight,
      onClick: () => {
        onDrawerClose();
        onWatchOpen();
      },
    },
    {
      key: 'wallet',
      title: 'Wallet',
      // image: appCurrentTheme === LIGHT ? walletIcon : walletIconLight,
      onClick: () => {
        onDrawerClose();
        onWalOpen();
      },
      hide: !wallet_features,
    },
    {
      key: 'notifications',
      title: 'Notifications',
      // image: appCurrentTheme === LIGHT ? notificationIcon : notificationIconLight,
      onClick: () => {
        onDrawerClose();
        onNotOpen();
      },
    },
    {
      key: 'about',
      title: 'About Us',
      // image: appCurrentTheme === LIGHT ? notificationIcon : notificationIconLight,
      onClick: () => {
        onDrawerClose();
        window.open(about_us_link);
      },
    },
  ];

  const dropdown_data = [
    {
      key: 'settings',
      title: 'Settings',
      icon: <IoMdSettings />,
      image: settingIcon,
      onClick: () => {
        onDrawerClose();
        router.push('/settings');
      },
    },
    {
      key: 'feedback',
      title: 'Feedback',
      icon: <BiSolidMessageDetail />,
      image: feedbackIcon,
      onClick: () => {
        onDrawerClose();
        feedBackModal.onOpen();
      },
    },
    {
      key: 'terms',
      title: 'Terms of Service',
      icon: <FaFileLines />,
      image: termsIcon,
      onClick: () => window.open(`${TERMS ? TERMS : ''}`, '_blank'),
    },
    {
      key: 'terms',
      title: 'Privacy Policy',
      icon: <FaFileLines />,
      image: termsIcon,
      onClick: () => window.open(`${PRIVACY_POLICY ? PRIVACY_POLICY : ''}`, '_blank'),
    },
    {
      key: 'suggest',
      title: 'Suggest an idea',
      icon: <BiMessageAltAdd />,
      image: suggestIcon,
      onClick: () => {
        onDrawerClose();
        suggestModal.onOpen();
      },
    },
    {
      key: 'report',
      title: 'Report a bug',
      icon: <PiMagnifyingGlassFill />,
      image: reportBugIcon,
      onClick: () => {
        onDrawerClose();
        reportBugModal.onOpen();
      },
    },
  ];

  const handleLogout = () => {
    deleteCookies(['token', 'loggedIn']);
    // window.location.reload();
    location.assign('/');
  };

  return (
    <Drawer
      placement="right"
      isCentered={false}
      scrollBehavior="inside"
      isOpen={isDrawerOpen}
      onClose={onDrawerClose}
    >
      <DrawerOverlay />
      <DrawerContent bg="matador_background.200" color={`text`} maxW="300px">
        <DrawerCloseButton fontSize={'20px'} />
        {LoggedinUser ? (
          <DrawerBody px="24px" py="38px">
            <Flex w="full" h="50px" justify={'space-between'}>
              <Flex
                as={Link}
                href={`/settings`}
                textDecor={`none !important`}
                gap={'12px'}
                cursor={'pointer'}
                align={'center'}
                justifyContent={'center'}
              >
                <Image
                  alt="profile_icon"
                  w="64px"
                  h="64px"
                  borderRadius="full"
                  src={avatar ? avatar : ProfileIcon.src}
                  color={'black'}
                  size={'22px'}
                />
                <VStack gap="0px" align={'stretch'}>
                  <Text
                    color="text"
                    fontSize={'16px'}
                    fontWeight={500}
                    textTransform={`capitalize`}
                  >
                    {LoggedinUser?.first_name}
                  </Text>
                  {console.log({LoggedinUser})}
                  <Text color="text" fontSize={'12px'} fontWeight={400}>
                    {LoggedinUser?.customer_ref || `Profile`}
                  </Text>
                </VStack>
              </Flex>
              {/* <Icon as={RxCross1} fontSize={'20px'} color="text" onClick={onDrawerClose} /> */}
            </Flex>
            <VStack align={'flex-start'} mt="60px" spacing={'43px'}>
              {auth_data.map(
                data =>
                  !data?.hide && (
                    <PaymentAccess
                      key={data.key}
                      checkPayment={data.title?.toLowerCase()?.includes(`wallet`)}
                      checkWallet={data.title?.toLowerCase()?.includes(`wallet`)}
                      content={
                        <Flex
                          align={'center'}
                          gap="12px"
                          display={data.key === `about` && !about_us_link ? `none` : `flex`}
                        >
                          {/* <Image w='18px' h='18px' src={data.image?.src} /> */}
                          <Text
                            className="heading-text-regular"
                            onClick={data.onClick}
                            key={data.key}
                            color="text"
                            fontSize={'16px'}
                            fontWeight={400}
                          >
                            {data.title}
                          </Text>
                        </Flex>
                      }
                    />
                  )
              )}
            </VStack>
            <Divider my="40px" borderColor={`matador_border_color.100`} />
            <VStack align={'flex-start'} spacing={'43px'}>
              {dropdown_data.map(data => (
                <Flex align={'center'} gap="12px" key={data.key}>
                  <Center color="custom_color.color" fontSize={`16px`}>
                    {data.icon || <Image src={data.image?.src} />}
                  </Center>
                  <Text
                    onClick={data.onClick}
                    key={data.key}
                    color="text"
                    fontSize={'16px'}
                    fontWeight={400}
                  >
                    {data.title}
                  </Text>
                </Flex>
              ))}

              {/* <Flex align={'center'} gap='12px' mt='50px'>
                <Image h='full' src={reportBugIcon?.src} />
                <Text
                  cursor={'pointer'} onClick={() => router.push('/theme-toggler')}
                  color='text' fontSize={'16px'} fontWeight={400}
                >
                  Change Theme
                </Text>
              </Flex> */}
            </VStack>

            <Flex align={'center'} gap="12px" mt="50px">
              <Image h="full" src={logoutIcon?.src} />
              <Text
                cursor={'pointer'}
                onClick={handleLogout}
                color="#E6192A"
                fontSize={'16px'}
                fontWeight={400}
              >
                Sign Out
              </Text>
            </Flex>
          </DrawerBody>
        ) : (
          <DrawerBody px="24px" py="38px">
            <VStack align={'flex-start'} mt="60px" spacing={'33px'}>
              {/* <Text color="text" fontSize={'20px'} fontWeight={500}>
                Home
              </Text>
              <Text color="text" fontSize={'20px'} fontWeight={500}>
                Our Projects
              </Text> */}
              {about_us_link && (
                <Link
                  href={about_us_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text"
                  fontSize={'20px'}
                  fontWeight={500}
                >
                  About Us
                </Link>
              )}
              {/* <Text color="text" fontSize={'20px'} fontWeight={500}>
                Contact
              </Text> */}
            </VStack>

            <Button
              mt="50px"
              borderRadius="6px"
              color="custom_color.contrast"
              bg="custom_color.color"
              px="28px"
              py="24px"
              // onClick={() => router.push('/auth/login')}
              onClick={handleGetStarted}
            >
              <Text lineHeight={'28px'} fontWeight={'600'} fontSize={'18px'}>
                Get Started
              </Text>
            </Button>
          </DrawerBody>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawerComp;
