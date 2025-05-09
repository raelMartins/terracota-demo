import {HStack, Link, Text} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import {fetchPrivacyPolicy, fetchTerms} from '../../api/agents';
import {storeDetails} from '../../api/auth';

export const Footer = ({...rest}) => {
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  const TERMS = store_data?.customer_document;
  const PRIVACY_POLICY = store_data?.customer_privacy_policy;

  return (
    <HStack
      w="full"
      justify="space-between"
      borderTop="1px solid"
      borderColor={`matador_border_color.100`}
      px={{base: '18px', md: '100px'}}
      py="14px"
      fontSize={{base: 12, md: 15}}
      alignSelf="end"
      justifySelf="end"
      bg="background"
      color={`matador_form.label`}
      {...rest}
    >
      <Text
        as={Link}
        href={`https://www.myxellia.io/`}
        target="_blank"
        rel="noopener noreferrer"
        fontWeight="400"
      >
        Created with myxellia.io
      </Text>
      <HStack gap={{base: '16px', md: '40px'}}>
        {TERMS && (
          <Link
            onClick={!TERMS ? e => e.preventDefault() : null}
            href={`${TERMS ? TERMS : ''}`}
            target={TERMS ? '_blank' : ''}
            cursor="pointer"
            fontWeight="400"
          >
            Terms of Service
          </Link>
        )}
        {PRIVACY_POLICY && (
          <Link
            onClick={!PRIVACY_POLICY ? e => e.preventDefault() : null}
            href={PRIVACY_POLICY ? PRIVACY_POLICY : '#'}
            target={PRIVACY_POLICY ? '_blank' : ''}
            fontWeight="400"
          >
            Privacy Policy
          </Link>
        )}
      </HStack>
    </HStack>
  );
};
