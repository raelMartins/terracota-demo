import React, {useState} from 'react';
import {LayoutView} from '../../components/page_layout';
import {themeStyles} from '../../theme';
import {
  Box,
  Flex,
  GridItem,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Profile from './sections/Profile';
import NextOfKin from './sections/NextOfKin';
import Payments from './sections/Payments';
import {useRouter} from 'next/router';
import Auth from '../../hoc/Auth';
import filterBG from '../../images/filter-bg.png';
import {declinceAppAccessDueToPayment, storeName} from '../../constants/routes';
import {ServiceDowntime} from '../service_downtime';
import {PaymentAccess} from '@/components/payment/PaymentAccess';

const tabs = [
  {
    tablist: 'Profile',
    component: <Profile />,
  },
  {
    tablist: 'Next Of Kin',
    component: <NextOfKin />,
  },
  {
    tablist: 'Payments',
    component: <Payments />,
  },
];

const Settings = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = index => {
    setTabIndex(index);
    router.query = {
      id: index,
      tabName: tabs[index].tablist,
    };
  };

  return declinceAppAccessDueToPayment?.includes(storeName) ? (
    <ServiceDowntime />
  ) : (
    <LayoutView noPadding>
      <Box
        w="full"
        h={{base: `135px`, lg: '30vh'}}
        // bgImage={filterBG.src}
        bgPosition={'center'}
        bgSize={'cover'}
        position={'relative'}
        display={`none`}
      >
        {/* <Box position={'absolute'} opacity={0.5} bg="#0E0E0E" h="full" w="full" /> */}
        <Flex
          position={'absolute'}
          h={'full'}
          w="full"
          px="100px"
          py="40px"
          direction={'column'}
          zIndex={20}
          align={'center'}
          justify={'center'}
        >
          <Text
            className="heading-text-regular"
            fontSize={{base: `23px`, lg: '40px'}}
            pb={{base: `0px`, lg: '32px'}}
            px={`20px`}
            // color="#FFF"
            color="custom_color.color"
            borderBottom={'2.688px solid'}
            // borderColor={'#ffffff'}
            borderColor={'custom_color.color'}
            w={{base: 'max-width', lg: '403.188px'}}
            textAlign={'center'}
          >
            Settings
          </Text>
        </Flex>
      </Box>

      <Box w="full" px={{base: '20px', lg: '80px'}} py={{base: '20px'}}>
        <Tabs onChange={handleTabChange} isLazy>
          <TabList
            borderBottom={{base: 'none', md: 'unset'}}
            // minH={{ base: 'auto', md: '80vh' }}
            flexDirection={{base: 'row', md: 'row'}}
            px="16px"
            py="12px"
            // bg="#F0F0F0"
            bg="matador_background.200"
            gap={{base: '8px', md: '10px'}}
            fontWeight="600"
            fontSize="18px"
          >
            {tabs.map((item, index) => (
              <PaymentAccess
                checkPayment={item?.tablist?.toLowerCase()?.includes('payment')}
                key={index}
                content={
                  <Tab key={index} borderBottom={{base: 'none', md: 'unset'}} s>
                    {tabIndex === index ? (
                      <Text
                        fontSize={{base: 14, md: 16}}
                        w={'full'}
                        fontWeight={700}
                        pb="8px"
                        borderColor={'text'}
                        color="text"
                        borderBottom={'1px solid'}
                        letterSpacing={{base: '0.16px', md: ''}}
                        whiteSpace={'nowrap'}
                        className="heading-text-regular"
                      >
                        {item.tablist}
                      </Text>
                    ) : (
                      <Text
                        fontSize={{base: 14, md: 16}}
                        w={'full'}
                        fontWeight={400}
                        pb="8px"
                        // color="#667085"
                        color="matador_text.400"
                        letterSpacing={{base: '0.56px', md: ''}}
                        whiteSpace={'nowrap'}
                      >
                        {item.tablist}
                      </Text>
                    )}
                  </Tab>
                }
              />
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((item, index) => (
              <PaymentAccess
                checkPayment={item?.tablist?.toLowerCase()?.includes('payment')}
                key={index}
                content={
                  <TabPanel key={index} px="0px">
                    {item.component}
                  </TabPanel>
                }
              />
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </LayoutView>
  );
};

export default Auth(Settings);
