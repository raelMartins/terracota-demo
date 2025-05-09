import {useState} from 'react';
import {
  Flex,
  HStack,
  Text,
  Box,
  Select,
  useToast,
  FormControl,
  Spinner,
  Textarea,
  Stack,
} from '@chakra-ui/react';
import {themeStyles} from '../../theme';
import {Button, FormInput} from '../../ui-lib/ui-lib.components';
import {useFormik} from 'formik';
import {storeName, store_name} from '../../constants/routes';
import {useMutation, useQuery} from 'react-query';
import {fetchSupportedBanks, walletWithdrawal} from '../../api/Wallet';
import * as Yup from 'yup';
import {ArrowBackIcon, CloseIcon} from '@chakra-ui/icons';
import {formatToCurrency} from '../../utils';
import {scrollBarStyles} from '../common/ScrollBarStyles';
import {MY_COUNTRY} from '@/constants/country';

const formSchema = Yup.object().shape({
  account_number: Yup.string()
    .matches(/^\d+$/, 'Account number must contain only digits')
    .length(10, 'Account number should be exactly 10 digits')
    .required('Please enter your account number'),
  amount: Yup.string().required('Please enter an amount'),
  bank_code: Yup.string().required('Please select a bank'),
});

export const WithdrawalWallet = ({setPage, onWalClose}) => {
  const toast = useToast();
  const [bankName, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const LIST_ALL_BANKS = useQuery(['fetchSupportedBanks'], fetchSupportedBanks);

  const SUPPORTED_OFFICIAL_BANKS = LIST_ALL_BANKS?.data?.data?.message?.length
    ? LIST_ALL_BANKS?.data?.data?.message
    : [];

  const mutation = useMutation(formData => walletWithdrawal(formData), {
    onSuccess: res => {
      onWalClose();
      toast({
        description: `Withdrawal successful`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: err => {
      toast({
        description: `${
          err?.response?.data?.message ??
          err?.response?.message ??
          err?.response?.data[0] ??
          'Something went wrong'
        }`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });
  const storeName = store_name();

  const formik = useFormik({
    initialValues: {
      store_name: storeName,
      account_number: '',
      amount: '',
      description: '',
      bank_code: '',
    },
    validationSchema: formSchema,
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: values => {
      let withdrawalPayload = {
        ...values,
        account_number: `${values.account_number}`,
        amount: Number(values.amount.replace(',', '')),
      };
      mutation.mutate(withdrawalPayload);
    },
  });

  const handleSelectBank = e => {
    const bank_ = SUPPORTED_OFFICIAL_BANKS?.find(bank => bank?.code === e.target.value);
    if (bank_) {
      setBank(bank_?.name);
      formik.setFieldValue('bank_code', bank_?.code);
    }
  };

  const handleInput = e => {
    const input = e.target;
    let val = input.value;

    const cleanedString = val.replace(/[^\d]/g, ''); // Remove non-numeric characters
    val = cleanedString.replace(/^0+(?=\d)/, '');

    const length = val.length;

    if (length <= 2) {
      val = '0.' + val.padStart(2, '0');
    } else {
      const integerPart = val.slice(0, length - 2);
      const decimalPart = val.slice(-2);
      val = integerPart + '.' + decimalPart;
    }
    formik.setFieldValue('amount', val);
    setAmount(val);
  };
  console.log(formik.errors);
  return (
    <Stack
      h="full"
      px={{base: '15px', lg: '24px'}}
      py={{base: '10px', lg: '20px'}}
      css={scrollBarStyles}
    >
      <Flex display={{base: 'none', lg: 'flex'}} justify={'space-between'} align={'center'}>
        <HStack spacing="8px">
          <ArrowBackIcon
            fontSize={'22px'}
            cursor="pointer"
            color="text"
            onClick={() => setPage('wallet')}
          />
          <Text fontSize={'23px'} fontWeight={500} color="text" className="heading-text-regular">
            Make a withdrawal
          </Text>
        </HStack>
        <CloseIcon
          display={{base: 'none', md: 'flex'}}
          fontSize={'15px'}
          cursor="pointer"
          color="text"
          onClick={onWalClose}
        />
      </Flex>

      <form onSubmit={formik.handleSubmit}>
        <Flex gap="8px" direction="column" align={'start'} my="10px">
          <FormControl>
            <Stack align="center" justify="center" py={8} w="full" bg="matador_background.200">
              <Text
                textAlign={'center'}
                color="text"
                fontSize={16}
                fontWeight={{base: '400'}}
              >{`Enter Amount to withdraw`}</Text>
              <FormInput
                color="text"
                bg="matador_background.100"
                border={`1px solid`}
                borderColor={`matador_border_color.100`}
                textAlign="center"
                leftAddon={
                  <Text top="10px" fontSize={'28px'} color={amount ? 'text' : '#606060'}>
                    {MY_COUNTRY?.symbol}
                  </Text>
                }
                onChange={handleInput}
                value={amount ? formatToCurrency(amount).replace(MY_COUNTRY?.symbol, '') : ''}
                error={amountError}
                onBlur={formik.handleBlur('amount')}
                maxW="75%"
                justify="center"
                w="100%"
                h="60px"
                boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                fontSize={28}
                leftAddonStyle={{
                  top: '10px',
                  left: {base: '75px', sm: '120px', lg: '60px'},
                }}
                group={{
                  justifyContent: 'center',
                }}
                placeholder="0.00"
                _placeholder={{
                  fontSize: 28,
                  color: '#606060',
                }}
              />
            </Stack>
            <Text
              className="sub-text-regular"
              my={'8px'}
              color="text"
              fontSize={12}
              fontWeight={400}
            >{`Account Number`}</Text>
            <FormInput
              color="text"
              bg="matador_background.100"
              border={`1px solid`}
              borderColor={`matador_border_color.100`}
              error={formik.touched.account_number && formik.errors.account_number}
              onChange={formik.handleChange('account_number')}
              value={formik.values.account_number}
              onBlur={formik.handleBlur('account_number')}
              h="48px"
              placeholder="Enter Account Number"
              rounded="5px"
              errorSize="11px"
            />
            <Text
              className="sub-text-regular"
              color="text"
              my={'8px'}
              fontSize={12}
              fontWeight={400}
            >{`Select Bank`}</Text>
            <Select
              // border={
              //   formik.touched.bank_code && formik.errors.bank_code
              //     ? `2px solid ${themeStyles.color.matador__red} !important`
              //     : '1px solid #D0D5DD !important'
              // }
              placeholder={bankName || 'Select bank name'}
              color="text"
              bg="matador_background.100"
              border={`1px solid`}
              borderColor={
                formik.touched.bank_code && formik.errors.bank_code
                  ? themeStyles.color.matador__red
                  : `matador_border_color.100`
              }
              value={bankName}
              onChange={handleSelectBank}
              onBlur={formik.handleBlur('bank_code')}
              rounded="5px"
              h="48px"
              fontSize={13}
              _placeholder={{
                letterSpacing: '0.52px',
                fontWeight: 500,
              }}
            >
              {SUPPORTED_OFFICIAL_BANKS?.length ? (
                SUPPORTED_OFFICIAL_BANKS.map((bank, index) => (
                  <option style={{color: 'black'}} key={index} value={bank?.code}>
                    {bank?.name}
                  </option>
                ))
              ) : (
                <option style={{color: 'black'}} value={''}>
                  Fetching supported banks...
                </option>
              )}
            </Select>
            <Text color={themeStyles.color.matador__red} my={'5px'} fontSize={'11px'}>
              {formik.touched.bank_code && formik.errors.bank_code}
            </Text>
          </FormControl>
          <Text
            className="sub-text-regular"
            my={'8px'}
            textAlign={'center'}
            color="text"
            fontSize={12}
            fontWeight={400}
          >{`Description (optional)`}</Text>
          <Textarea
            color="text"
            bg="matador_background.100"
            border={`1px solid`}
            borderColor={`matador_border_color.100`}
            type="text"
            onChange={formik.handleChange('description')}
            value={formik.values.description}
            h="95px"
            rounded="5px"
            resize="none"
          />
        </Flex>
        <Button
          isDisabled={mutation?.isLoading || !formik.isValid}
          w="full"
          color="custom_color.contrast"
          mt={'20px'}
          type="submit"
          bg="custom_color.color"
          h="50px"
        >
          {mutation?.isLoading ? <Spinner color="white" /> : 'Proceed'}
        </Button>
      </form>
    </Stack>
  );
};

export default WithdrawalWallet;
