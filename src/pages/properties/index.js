import Auth from '../../hoc/Auth';
import PropertiesPage from '../../components/properties/PropertiesPage';
import {useLayoutEffect} from 'react';
import {declinceAppAccessDueToPayment, storeName} from '../../constants/routes';
import {useRouter} from 'next/router';

const Properties = () => {
  const router = useRouter();

  return declinceAppAccessDueToPayment?.includes(storeName) ? (
    router.push('/service_downtime')
  ) : (
    <PropertiesPage />
  );
};

export default Auth(Properties);
