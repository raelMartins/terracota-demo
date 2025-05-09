import {ArrowBackIcon, CopyIcon} from '@chakra-ui/icons';
import {Box, Center, Flex, HStack, Stack, StackDivider, Text, useToast} from '@chakra-ui/react';
import {useState} from 'react';
import {formatToCurrency} from '../../utils';

export const FallBackBankTransfer = ({accounts, amount, ...rest}) => {
  const [account_number, set_account_number] = useState(null);
  const toast = useToast();

  const copy = acc_num => {
    set_account_number(acc_num);
    // onCopy();
    navigator.clipboard.writeText(acc_num);
    toast({
      title: 'Account Number Copied! 👍🏻',
      status: 'info',
      duration: 1500,
      isClosable: true,
      position: 'top-right',
    });
    setTimeout(() => {
      set_account_number(null);
    }, 2000);
  };
  return (
    <Stack w="full" gap={`12px`} color={`text`} {...rest}>
      <Center
        flexDir={`column`}
        gap={`4px`}
        borderRadius={`5px`}
        border={`1px solid`}
        borderColor={`matador_border_color.100`}
        bgColor={`matador_background.100`}
        p={`35px`}
      >
        <Text fontSize={{base: '13px', lg: '16px'}} fontWeight={400} lineHeight={`140%`}>
          You will pay
        </Text>
        <Text
          // className="heading-text-regular"
          fontWeight={{base: '500', lg: '700'}}
          fontSize={{base: '19px', lg: '24px'}}
          lineHeight={{base: `140%`}}
        >
          {formatToCurrency(amount)}
        </Text>
      </Center>
      <Box>
        <Text fontSize={`13px`} fontWeight={`500`} lineHeight={`140%`} mb={`8px`}>
          Choose the bank of your preference
        </Text>
        <Stack
          gap={`4px`}
          borderRadius={`5px`}
          border={`1px solid`}
          borderColor={`matador_border_color.100`}
          bgColor={`matador_background.100`}
          divider={<StackDivider borderColor={` #24242B`} />}
          p={`12.5px 10px`}
        >
          {accounts?.map((account, i) => (
            <HStack justify={`space-between`} p={`12px 10px`} key={i}>
              <Text fontSize={`12px`} fontWeight={`500`}>
                {account?.bank_name || account?.account_bank_name}
              </Text>
              <HStack gap={`10px`}>
                <Stack gap={`4px`} textAlign={`right`}>
                  <Text fontSize={`12px`} fontWeight={`500`}>
                    {account?.account_number}
                  </Text>
                  <Text fontSize={`10px`} fontWeight={`500`} opacity={`.9`}>
                    {account?.account_name}
                  </Text>
                </Stack>
                <CopyIcon
                  onClick={() => copy(account?.account_number)}
                  fontSize={'16px'}
                  color={
                    account_number === account?.account_number ? 'custom_color.color' : 'inherit'
                  }
                  cursor="pointer"
                  h={6}
                  w={6}
                />
              </HStack>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
