import {CopyIcon} from '@chakra-ui/icons';
import {Center, Flex, HStack, Stack, Text, useToast} from '@chakra-ui/react';
import {useState} from 'react';
import {formatToCurrency} from '@/utils';
import {Button} from '@/ui-lib';
import {UploadPurchaseReceipt} from './UploadReceipt';

export const InstantBankTransfer = ({accounts, equityID, amount, handleClose, ...rest}) => {
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
    <>
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
        {accounts?.map((account, i) => (
          <Stack
            gap={`12px`}
            p={`12px 16px`}
            key={i}
            borderRadius={`5px`}
            border={`1px solid`}
            borderColor={`matador_border_color.100`}
            bgColor={`matador_background.100`}
          >
            <Flex gap={`10px`} justify={`space-between`}>
              <Text fontSize={`14px`} fontWeight={`500`} lineHeight={`135%`} letterSpacing={`4%`}>
                Account Name
              </Text>

              <Text
                fontSize={`16px`}
                fontWeight={`600`}
                lineHeight={`140%`}
                letterSpacing={`1%`}
                textAlign={`right`}
              >
                {account?.account_name}
              </Text>
            </Flex>

            <Flex gap={`10px`} justify={`space-between`}>
              <Text fontSize={`14px`} fontWeight={`500`} lineHeight={`135%`} letterSpacing={`4%`}>
                Bank Info
              </Text>
              <Stack gap={`4px`} textAlign={`right`}>
                <HStack>
                  <Text
                    fontSize={`16px`}
                    fontWeight={`600`}
                    lineHeight={`140%`}
                    letterSpacing={`1%`}
                    textAlign={`right`}
                  >
                    {account?.account_number}
                  </Text>
                  <CopyIcon
                    onClick={() => copy(account?.account_number)}
                    fontSize={'16px'}
                    color={
                      account_number === account?.account_number ? 'custom_color.color' : 'inherit'
                    }
                    cursor="pointer"
                  />
                </HStack>
                <Text
                  color={`matador_form.label`}
                  lineHeight={`135%`}
                  letterSpacing={`4%`}
                  fontSize={`14px`}
                  fontWeight={`500`}
                  opacity={`.9`}
                  textTransform={`uppercase`}
                >
                  {account?.bank_name || account?.account_bank_name}
                </Text>
              </Stack>
            </Flex>
          </Stack>
        ))}
        <Text
          color={`matador_text.300`}
          fontSize={`16px`}
          fontWeight={`400`}
          lineHeight={`140%`}
          letterSpacing={`4%`}
        >
          Have you made the payment? Kindly upload the receipt.
        </Text>
        <UploadPurchaseReceipt equityID={equityID} handleSuccess={handleClose} />
        <Button variation={`primary`} w={`100%`} onClick={handleClose}>
          Done
        </Button>
      </Stack>
    </>
  );
};
