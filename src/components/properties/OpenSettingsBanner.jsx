import {CloseIcon} from '@chakra-ui/icons';
import {Center, Flex, HStack, Text, VStack} from '@chakra-ui/react';
import {appCurrentTheme} from '../../utils/localStorage';
import {LIGHT} from '../../constants/names';
import {ChatIconForInspectionFeedback} from '../assets/svgs';
import {useState} from 'react';
import {useRouter} from 'next/router';
import {Button} from '../../ui-lib';
import {useQuery} from 'react-query';
import {getSettingsData} from '../../api/Settings';

export const OpenSettingsBanner = ({user}) => {
  const [willDisplay, setWillDisplay] = useState(false);
  const router = useRouter();

  console.log({user});

  const profileQuery = useQuery(['getSettingsData'], () => getSettingsData({profile: true}), {
    onSuccess: res => {
      const [y, m, d] = res?.data?.data?.date_of_birth
        ? res?.data?.data?.date_of_birth?.split('-')
        : [``, ``, ``];
      console.log({res});

      const {date_of_birth, marital_status, highest_education, monthly_income, address} =
        res.data?.data;

      if (!date_of_birth && !marital_status && !highest_education && !monthly_income && !address) {
        setWillDisplay(true);
      }
    },
  });

  return (
    willDisplay && (
      <Flex
        w="85%"
        bg={appCurrentTheme === LIGHT ? '#101010' : 'matador_background.200'}
        mx="auto"
        boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
        justify="space-between"
        align={{base: `stretch`, sm: `center`}}
        direction={{base: `column`, sm: `row`}}
        p={{base: '16px', md: '12px'}}
        minH={{base: '48px', md: '72px'}}
        mb={{base: '8px', md: '15px'}}
        gap={`10px`}
      >
        <HStack
          w="80%"
          spacing={{base: '3px', md: '16px'}}
          align={{base: `flex-start`, sm: `center`}}
        >
          <Center p={{base: '3px', md: '10px'}}>
            <ChatIconForInspectionFeedback boxSize={{base: '24px', md: '40px'}} />
          </Center>

          <VStack color="#FBFCFC" align={'flex-start'} spacing={0}>
            <Text fontSize={{base: '12px', md: '16px'}} fontWeight={{base: 500, md: 600}}>
              Thanks for joining us!{' '}
            </Text>
            <Text fontSize={{base: '11px', md: '14px'}} fontWeight={300}>
              Head to Settings to complete your account setup and unlock everything we have to
              offer.{' '}
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={{base: '8px', md: '18px'}} pr="4px">
          <Button
            color="custom_color.contrast"
            bg="custom_color.color"
            onClick={() => {
              router.push('/settings');
            }}
            _hover={{opacity: 1}}
            _active={{opacity: 1}}
            boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
            h={{base: '23px', md: '44px'}}
            fontSize={{base: '13px', md: 'unset'}}
            fontWeight={{base: '500', md: 'unset'}}
            px="32px"
            py="13px"
            w={{base: `100%`, sm: `max-content`}}
          >
            Go To Settings
          </Button>
          <CloseIcon
            display={{base: 'none', md: 'block'}}
            fontSize="11px"
            color="#FBFCFC"
            onClick={() => setWillDisplay(false)}
            cursor="pointer"
          />
        </HStack>
      </Flex>
    )
  );
};
