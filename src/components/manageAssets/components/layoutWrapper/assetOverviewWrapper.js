import {
  Box,
  Divider,
  GridItem,
  HStack,
  Heading,
  Hide,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import isMobile from '../../../../utils/extras';

const AssetOverviewWrapper = ({overviewInfo, useTabs, children, ...rest}) => {
  const isXL = useBreakpointValue({base: false, xl: true});
  return (
    <Stack
      w="full"
      maxW="626.86px"
      pt={{base: '23.5px'}}
      p={{xl: '23.5px'}}
      border={{base: 'none', xl: '1.125px solid'}}
      borderColor={`matador_border_color.100 !important`}
      bg={{xl: 'matador_background.200', base: 'transparent'}}
      gap={{base: '21px', xl: '23.5px'}}
      sx={
        useTabs && {
          '& > *:not(style) ~ *:not(style)': {
            marginTop: ['23.5px', null, '24px'],
            '@media screen and (min-width: 80em)': {
              marginTop: '23.5px',
            },
          },
        }
      }
      overflowY="auto"
      {...rest}
    >
      {isXL ? (
        <Text
          as="header"
          fontSize="21.845px"
          fontWeight="600"
          color="text"
          lineHeight="31px"
          display={{base: 'none', xl: 'inline-block'}}
          className="heading-text-regular"
          textTransform={`capitalize`}
        >
          Overview
        </Text>
      ) : null}

      {isXL ? (
        <Divider
          display={{base: 'none', xl: 'inline-block'}}
          border="none"
          h="0.95px"
          bg="matador_border_color.100"
        />
      ) : null}

      {overviewInfo.map((info, idx) => {
        return info.hide ? null : (
          <HStack key={idx} justify="space-between" w="full">
            <Text
              fontSize={{base: '12px', md: '13.664px'}}
              lineHeight={{base: '14px', md: '17px'}}
              fontWeight="400"
              color="matador_form.label"
              maxW={{base: `180px`, md: `300px`}}
              flexWrap={`wrap`}
              textAlign={`left`}
            >
              {info.label}
            </Text>
            {info?.component || (
              <Text
                fontSize={{base: '12px', md: '13.664px'}}
                lineHeight={{base: '14px', md: '17px'}}
                fontWeight="400"
                color="text"
                maxW={{base: `180px`, md: `300px`}}
                flexWrap={`wrap`}
                textAlign={`right`}
              >
                {info?.value}
              </Text>
            )}
          </HStack>
        );
      })}

      <Divider
        border="none"
        h="0.95px"
        bg="matador_border_color.100"
        display={!useTabs && {base: `none`, lg: `block`}}
      />

      {isMobile && !useTabs ? null : <>{children}</>}
    </Stack>
  );
};

export default AssetOverviewWrapper;
