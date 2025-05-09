import {useEffect, useState} from 'react';
import {useToast} from '@chakra-ui/react';
import {useMutation, useQuery} from 'react-query';
import {fetchBankDetails, makeEquityDeposit, makeEquityPayment} from '../../api/payment';
import {BUSINESS_ID, STORE__DOMAIN, storeName} from '../../constants/routes';
import openExternalUrl from '../../utils/openExternalLink';

import {displayToast} from '../ui-lib.components/Toast/createToast';
import {getSession} from '../../utils/sessionmanagers';

export const useAssetPayment = ({
  paymentType,
  amountToPay,
  modal,
  paymentDetails,
  onSuccessful,
  // fractionPayloadForBankTransfer,
  refetch,
  auth_code,
  asset_id,
}) => {
  const toast = useToast();
  const [authUrl, setAuthUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('index');
  const [trasferDetails, setTransferDetails] = useState(null);

  // const business_id = BUSINESS_ID();
  // const [business_id] = useLocalStorage('businessId');

  const addToast = displayToast();

  const toastError = msg =>
    toast({
      title: `${msg ?? 'An error occured'}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

  const toastSuccess = msg =>
    toast({
      title: `${msg ?? 'Successful'}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });

  const depositMutation = useMutation(formData => makeEquityDeposit(formData), {
    onSettled: () => setLoading(false),
    onSuccess: res => {
      refetch ? refetch() : null;
      onSuccessful ? onSuccessful(res.data) : null;
      setAuthUrl(res?.data?.data?.data?.link ?? res?.data?.data?.link);
      const details = res?.data?.bank_details;
      const link =
        res?.data?.data?.link || res?.data?.data?.data?.link || res?.data?.data?.data?.data?.link;
      const message = res?.data?.message;
      if (message) {
        // toastSuccess(message)
      }
      if (details) {
        setTransferDetails(details);
      }
      if (link) {
        modal?.onClose();
        openExternalUrl(link, '_blank');
      }
    },
    onError: err => {
      // toastError(err?.response?.data?.message)
      addToast({
        position: 'top-right',
        variant: 'error',
        errMsg: err,
        title: 'Transaction Failed!',
      });
    },
  });

  const paymentMutation = useMutation(formData => makeEquityPayment(formData), {
    onSettled: () => setLoading(false),
    onSuccess: res => {
      refetch ? refetch() : null;

      onSuccessful ? onSuccessful(res.data) : null;
      setAuthUrl(res?.data?.data?.data?.link ?? res?.data?.data?.link);
      const details = res?.data?.bank_details;
      console.log({details, res});
      const link =
        res?.data?.data?.link || res?.data?.data?.data?.link || res?.data?.data?.data?.data?.link;
      const message = res?.data?.message;
      if (message) {
        // toastSuccess(message)
      }
      if (details) {
        setTransferDetails(details);
      }
      if (link) {
        modal?.onClose();
        openExternalUrl(link, '_blank');
      }
    },
    onError: err => {
      // toastError(err?.response?.data?.message);
      addToast({
        position: 'top-right',
        variant: 'error',
        errMsg: err,

        title: 'Transaction Failed!',
      });
    },
  });

  const BANK_TRANSFER = useMutation(id => fetchBankDetails(id), {
    // onSettled: () => setLoading(false),
    onSuccess: async res => {
      const details = res?.data?.results;
      if (details?.length > 0) {
        setTransferDetails(details);
        setLoading(false);
      } else {
        const business_id = await getSession('businessId');
        const newPaymentDetails = {
          ...paymentDetails,
          auth_code,
          redirect_url: `https://${STORE__DOMAIN}`,
          payment_option: 'virtual_bank',
          amount_to_pay: Number(amountToPay),
          store_name: storeName,
          from_store: true,
          business_id,
          // ...(fractionPayloadForBankTransfer ? fractionPayloadForBankTransfer : {}),
        };

        switch (paymentType) {
          case 'deposit':
            return depositMutation.mutate(newPaymentDetails);
          case 'asset':
            return paymentMutation.mutate(newPaymentDetails);
          default:
            return;
        }
      }
    },
    onError: err => {
      addToast({
        position: 'top-right',
        variant: 'error',
        errMsg: err,
        title: 'Error fetching account details',
      });
    },
  });

  const handlePaywithCard = async () => {
    const business_id = await getSession('businessId');
    setLoading(true);
    const newPaymentDetails = {
      ...paymentDetails,
      auth_code,
      redirect_url: `https://${STORE__DOMAIN}`,
      payment_option: 'card',
      amount_to_pay: Number(amountToPay),
      store_name: storeName,
      from_store: true,
      business_id,
    };

    switch (paymentType) {
      case 'deposit':
        return depositMutation.mutate(newPaymentDetails);
      case 'asset':
        return paymentMutation.mutate(newPaymentDetails);
      default:
        return;
    }
  };

  const handleBankTransfer = async () => {
    const business_id = await getSession('businessId');
    setPaymentStep('bankDetails');
    setLoading(true);
    // if (asset_id) {
    //   BANK_TRANSFER.mutate(parseInt(asset_id));
    // } else {
    const newPaymentDetails = {
      ...paymentDetails,
      auth_code,
      redirect_url: `https://${STORE__DOMAIN}`,
      payment_option: 'virtual_bank',
      amount_to_pay: Number(amountToPay),
      store_name: storeName,
      from_store: true,
      business_id,
      // ...(fractionPayloadForBankTransfer ? fractionPayloadForBankTransfer : {}),
    };

    switch (paymentType) {
      case 'deposit':
        return depositMutation.mutate(newPaymentDetails);
      case 'asset':
        return paymentMutation.mutate(newPaymentDetails);
      default:
        return;
    }
    // }
  };

  const handlePayFromWallet = async () => {
    const business_id = await getSession('businessId');
    setLoading(true);
    const newPaymentDetails = {
      ...paymentDetails,
      auth_code,
      redirect_url: `https://${STORE__DOMAIN}`,
      payment_option: 'store_wallet',
      amount_to_pay: Number(amountToPay),
      store_name: storeName,
      from_store: true,
      business_id,
    };
    switch (paymentType) {
      case 'deposit':
        return depositMutation.mutate(newPaymentDetails);
      case 'asset':
        return paymentMutation.mutate(newPaymentDetails);
      default:
        return;
    }
  };

  const handleEndTransaction = () => {
    depositMutation?.reset();
    paymentMutation?.reset();
  };

  const formattedAmount = amountToPay && amountToPay?.toString()?.replace(',', '');
  const isAboveLimit = parseInt(formattedAmount) > 500000;

  return {
    handleBankTransfer,
    handlePayFromWallet,
    handlePaywithCard,
    authUrl,
    setAuthUrl,
    isLoading,
    setLoading,
    paymentStep,
    setPaymentStep,
    trasferDetails,
    setTransferDetails,
    formattedAmount,
    isAboveLimit,
    paymentMutation,
    depositMutation,
    handleEndTransaction,
  };
};
