import React from 'react';
import {Flex, Image, Text, MenuList, Menu, MenuButton, MenuItem, Button} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import {FaCaretDown} from 'react-icons/fa';
import ProfileIcon from '../../images/icons/user-profile.svg';
import ProfileIconLight from '../../images/icons/user-profile-light.png';
import {motion} from 'framer-motion';
import feedbackIcon from '../../images/icons/feedback.svg';
import feedbackIconLight from '../../images/icons/feedback-light.svg';
import suggestIcon from '../../images/icons/suggest.svg';
import suggestIconLight from '../../images/icons/suggest-light.svg';
import reportBugIcon from '../../images/icons/reportBug.svg';
import reportBugIconLight from '../../images/icons/reportBug-light.svg';
import termsIcon from '../../images/icons/terms.svg';
import termsIconLight from '../../images/icons/terms-light.svg';
import logoutIcon from '../../images/icons/logout.svg';
import settingIcon from '../../images/icons/settings.svg';
import settingIconLight from '../../images/icons/settings-light.svg';
import {appCurrentTheme} from '../../utils/localStorage';
import {LIGHT} from '../../constants/names';
import {TriangleDownIcon} from '@chakra-ui/icons';
import {deleteCookies} from '../../utils/sessionmanagers';

export const ProfileMenu = ({
  feedBackModal,
  reportBugModal,
  suggestModal,
  LoggedinUser,
  useLightItems,
  avatar,
  TERMS,
  PRIVACY_POLICY,
  about_us_link,
}) => {
  const router = useRouter();

  const handleSettings = () => {
    router.push('/settings');
  };
  const handleLogout = () => {
    deleteCookies(['token', 'loggedIn']);
    // window.location.reload();
    location.assign('/');
  };

  const handleAboutUs = () => {
    if (about_us_link) {
      window.open(about_us_link);
    }
  };

  return (
    <Menu h="fit-content" bg="card_bg">
      <MenuButton alignItems="center">
        <Button
          borderRadius={0}
          color={'custom_color.contrast'}
          className="heading-text-regular"
          bg="custom_color.color"
          py="11px"
          px="21px"
          gap={'8px'}
          as={motion.div}
          align={'center'}
          justifyContent={'center'}
          cursor={'pointer'}
          whileTap={{scale: 0.9}}
          whileHover={{scale: 1.1}}
          fontWeight={`400`}
          textTransform={`capitalize`}
          leftIcon={
            <Image
              alt="profile_icon"
              w="20px"
              h="20px"
              borderRadius="full"
              src={
                avatar ? avatar : appCurrentTheme === LIGHT ? ProfileIconLight.src : ProfileIcon.src
              }
              color={`custom_color.contrast`}
            />
          }
          rightIcon={<TriangleDownIcon color={`custom_color.contrast`} size={25} />}
        >
          {LoggedinUser?.first_name}
        </Button>
      </MenuButton>
      <MenuList
        className="heading-text-regular"
        display="flex"
        flexDirection="column"
        zIndex={200}
        bg="matador_background.200"
        gap="5px"
        border={`none`}
      >
        <MenuItem
          onClick={() => router.push('/settings')}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center" py="5px" onClick={handleSettings}>
            <Text color="text" fontWeight="400">
              Settings
            </Text>
          </Flex>
        </MenuItem>
        {about_us_link && (
          <MenuItem
            onClick={handleAboutUs}
            bg="matador_background.200"
            _hover={{bg: `matador_background.100`}}
            px="15px"
          >
            <Flex gap={3} align="center" py="5px">
              <Text color="text" fontWeight="400">
                About Us
              </Text>
            </Flex>
          </MenuItem>
        )}
        <MenuItem
          onClick={feedBackModal?.onOpen}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center" py="5px">
            <Text color="text" fontWeight="400">
              Feedback
            </Text>
          </Flex>
        </MenuItem>

        {/* about_us_link */}
        <MenuItem
          onClick={reportBugModal?.onOpen}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center" py="5px">
            <Text color="text" fontWeight="400">
              Report a bug
            </Text>
          </Flex>
        </MenuItem>
        <MenuItem
          onClick={PRIVACY_POLICY ? () => window.open(`${PRIVACY_POLICY}`, '_blank') : null}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center" py="5px">
            <Text color="text" fontWeight="400">
              Privacy Policy
            </Text>
          </Flex>
        </MenuItem>
        <MenuItem
          onClick={TERMS ? () => window.open(`${TERMS}`, '_blank') : null}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center" py="5px">
            <Text color="text" fontWeight="400">
              Terms of Service
            </Text>
          </Flex>
        </MenuItem>
        <MenuItem
          onClick={suggestModal?.onOpen}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center" py="5px">
            <Text color="text" fontWeight="400">
              Suggest an Idea
            </Text>
          </Flex>
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          bg="matador_background.200"
          _hover={{bg: `matador_background.100`}}
          px="15px"
        >
          <Flex gap={3} align="center">
            <Text color="#E6192A" fontWeight="400">
              Sign Out
            </Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
