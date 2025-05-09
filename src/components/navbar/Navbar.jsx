import {
  Flex,
  Text,
  HStack,
  useDisclosure,
  Box,
  Icon,
  Center,
  Button,
  Image,
} from '@chakra-ui/react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import MobileDrawer from './mobile_drawer';
import {useQuery} from 'react-query';
import {BiMenu} from 'react-icons/bi';
import {storeDetails} from '../../api/auth';
import {LIGHT} from '../../constants/names';
import {ChevronLeftIcon} from '@chakra-ui/icons';
import {getSettingsData} from '../../api/Settings';

import {appCurrentTheme} from '../../utils/localStorage';
import ProfileMenu from './profile_menu';
import {Notification} from '../notification_drawer';
import {Wallet} from '../wallet_drawer';
import Feedback from '../feedback/feedback';
import {ReportBug} from '../report_bug';
import {SuggestIdea} from '../suggest_idea';
import {MyAssets} from '../my_asset';
import {Watchlist} from '../watchlist_drawer';
import useGetSession from '../../utils/hooks/getSession';
import {PaymentAccess} from '../payment/PaymentAccess';

export const Navbar = ({navBarStyle, openAuth, activePage, handleGetStarted}) => {
  const {sessionData: LoggedinUser, fetching} = useGetSession('loggedIn');

  const settingsQuery = useQuery(
    ['getSettingsData', 'profile'],
    () => getSettingsData({profile: true}),
    {
      enabled: !!LoggedinUser,
    }
  );
  const avatar = settingsQuery?.data?.data?.data?.avatar;

  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  const TERMS = store_data?.customer_document;
  const PRIVACY_POLICY = store_data?.customer_privacy_policy; //useQuery(['privacy-policy'], fetchAgentPrivacyPolicy);
  const wallet_features = store_data?.wallet_features;

  const useLightItems = appCurrentTheme !== LIGHT;

  const router = useRouter();
  const {isOpen: isNotOpen, onOpen: onNotOpen, onClose: onNotClose} = useDisclosure();
  const {isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose} = useDisclosure();
  const {isOpen: isWalOpen, onOpen: onWalOpen, onClose: onWalClose} = useDisclosure();
  const {isOpen: isAssetOpen, onOpen: onAssetOpen, onClose: onAssetClose} = useDisclosure();
  const {isOpen: isWatchOpen, onOpen: onWatchOpen, onClose: onWatchClose} = useDisclosure();
  const feedBackModal = useDisclosure();
  const reportBugModal = useDisclosure();
  const suggestModal = useDisclosure();

  const auth_data = [
    {
      key: 'myAssets',
      title: 'Portfolio',
      onClick: () => onAssetOpen(),
    },
    {
      key: 'watchlist',
      title: 'Watchlist',
      onClick: () => onWatchOpen(),
    },
    {
      key: 'wallet',
      title: 'Wallet',
      onClick: () => onWalOpen(),
      hide: !wallet_features,
    },
    {
      key: 'notification',
      title: 'Notification',
      onClick: () => onNotOpen(),
    },
  ];

  return (
    <>
      {/* Desktop View */}
      <Flex
        display={{base: 'none', lg: 'flex'}}
        color="text"
        mr="auto"
        // h={'100px'}
        alignItems={'center'}
        justify={'space-between'}
        w="full"
        bg={'matador_background.100'}
        px={'80px'}
        py={`12px`}
        borderBottom={`1px solid`}
        borderColor={`matador_border_color.100`}
        zIndex={100}
        {...navBarStyle?.desktop}
        position={`sticky`}
        top={`0px`}
      >
        <Link href={LoggedinUser ? '/properties' : '/'}>
          <HStack gap={'20px'}>
            <Center
              w={`max-content`}
              maxW="177px"
              h="46px"
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
        </Link>
        {fetching ? (
          <></>
        ) : LoggedinUser ? (
          <>
            <Flex justify="flex-end" align="center" gap={'45px'} w={`100%`}>
              <Flex align={'center'} justify={'flex-end'} gap={`42px`}>
                {auth_data.map(
                  item =>
                    !item?.hide && (
                      <PaymentAccess
                        key={item?.key}
                        checkPayment={item?.title?.toLowerCase()?.includes(`wallet`)}
                        checkWallet={item?.title?.toLowerCase()?.includes(`wallet`)}
                        content={
                          <Text
                            className="heading-text-regular"
                            key={item.key}
                            cursor="pointer"
                            onClick={item.onClick}
                            fontSize="14px"
                            textTransform={'capitalize'}
                            fontWeight={400}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                            color={`text`}
                          >
                            {item.title}
                          </Text>
                        }
                      />
                    )
                )}
              </Flex>

              <ProfileMenu
                TERMS={TERMS}
                PRIVACY_POLICY={PRIVACY_POLICY}
                avatar={avatar}
                suggestModal={suggestModal}
                reportBugModal={reportBugModal}
                feedBackModal={feedBackModal}
                LoggedinUser={LoggedinUser}
                useLightItems={useLightItems}
                about_us_link={store_data?.about_us}
              />
            </Flex>
            <Notification
              onDrawerOpen={onDrawerOpen}
              isNotOpen={isNotOpen}
              onNotClose={onNotClose}
            />
            <Wallet
              onDrawerOpen={onDrawerOpen}
              avatar={avatar}
              isWalOpen={isWalOpen}
              onWalClose={onWalClose}
            />
            <Feedback onDrawerOpen={onDrawerOpen} feedModal={feedBackModal} />
            <ReportBug onDrawerOpen={onDrawerOpen} reportBugModal={reportBugModal} />
            <SuggestIdea onDrawerOpen={onDrawerOpen} suggestModal={suggestModal} />
            <MyAssets
              onDrawerOpen={onDrawerOpen}
              isAssetOpen={isAssetOpen}
              onAssetClose={onAssetClose}
            />
            <Watchlist
              onDrawerOpen={onDrawerOpen}
              isWatchOpen={isWatchOpen}
              onWatchClose={onWatchClose}
            />
          </>
        ) : (
          <Flex justify="center" align="center" gap={'45px'}>
            <Flex align={'center'} justify={'center'} gap={`42px`}>
              {store_data?.about_us && (
                <Text
                  as={Link}
                  href={store_data.about_us}
                  target="_blank"
                  rel="noopener norefferer"
                  className="heading-text-regular"
                  cursor="pointer"
                  fontSize="14px"
                  textTransform={'capitalize'}
                  fontWeight={400}
                  color={`text`}
                >
                  About Us
                </Text>
              )}
            </Flex>
            <Button
              borderRadius={0}
              color={'custom_color.contrast'}
              className="heading-text-regular"
              bg="custom_color.color"
              py="11px"
              px="21px"
              gap={'8px'}
              align={'center'}
              justifyContent={'center'}
              cursor={'pointer'}
              fontWeight={`400`}
              _hover={{opacity: `1`}}
              _active={{opacity: `1`}}
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </Flex>
        )}
      </Flex>
      {/* Mobile View */}

      <Box
        display={{base: 'flex', lg: 'none'}}
        {...navBarStyle?.mobile}
        mt={`0px !important`}
        borderBottom={`1px solid`}
        borderColor={`matador_border_color.100`}
        zIndex={100}
        position={`sticky`}
        top={`0px`}
      >
        <Flex
          px={'20px'}
          zIndex={100}
          color={'text'}
          w="full"
          bg={`matador_background.100`}
          justify={'space-between'}
          align={'center'}
          gap={`10px`}
          pb="15px"
          pt="10px"
        >
          <Flex align={'center'} gap="20px">
            {router.pathname === '/' ||
            router.pathname === '/properties' ||
            router.pathname === '/settings' ? (
              <Link href={LoggedinUser ? '/properties' : '/'}>
                <Center w={`100%`} maxW="89px" h="25px" position={`relative`} overflow={`hidden`}>
                  {store_data?.company_image && (
                    <Image
                      src={store_data?.company_image}
                      alt={'Company Image'}
                      fill
                      style={{objectFit: `contain`, height: `100%`, width: `auto`}}
                    />
                  )}
                </Center>
              </Link>
            ) : (
              <Box cursor={'pointer'} onClick={() => router.back()}>
                <ChevronLeftIcon fontSize={'38px'} color={'text'} />
              </Box>
            )}
            <Text color="text" fontSize={'20px'} fontWeight={500}>
              {activePage}
            </Text>
          </Flex>
          {fetching ? (
            <></>
          ) : LoggedinUser ? (
            <Icon as={BiMenu} color="text" onClick={onDrawerOpen} fontSize={'30px'} />
          ) : (
            <>
              <Flex justify="center" align="center" gap={'12px'}>
                <Flex align={'center'} justify={'center'} gap={`40px`}>
                  {store_data?.about_us && (
                    <Text
                      as={Link}
                      href={store_data.about_us}
                      target="_blank"
                      rel="noopener norefferer"
                      className="heading-text-regular"
                      cursor="pointer"
                      fontSize={`12px`}
                      textTransform={'capitalize'}
                      fontWeight={`600`}
                      color={`text`}
                    >
                      About Us
                    </Text>
                  )}
                </Flex>
                <Button
                  borderRadius={0}
                  color={'custom_color.contrast'}
                  className="heading-text-regular"
                  bg="custom_color.color"
                  py="12px"
                  px="20px"
                  h={`max-content`}
                  gap={'8px'}
                  align={'center'}
                  justifyContent={'center'}
                  cursor={'pointer'}
                  fontWeight={`600`}
                  fontSize={`10px`}
                  _hover={{opacity: `1`}}
                  _active={{opacity: `1`}}
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </Flex>
            </>
          )}
        </Flex>
        <MobileDrawer
          TERMS={TERMS}
          PRIVACY_POLICY={PRIVACY_POLICY}
          feedBackModal={feedBackModal}
          reportBugModal={reportBugModal}
          suggestModal={suggestModal}
          onNotOpen={onNotOpen}
          onAssetOpen={onAssetOpen}
          onWatchOpen={onWatchOpen}
          onWalOpen={onWalOpen}
          avatar={avatar}
          isDrawerOpen={isDrawerOpen}
          onDrawerClose={onDrawerClose}
          onDrawerOpen={onDrawerOpen}
          handleGetStarted={handleGetStarted}
          about_us_link={store_data?.about_us}
          wallet_features={wallet_features}
        />
      </Box>
    </>
  );
};

export default Navbar;
