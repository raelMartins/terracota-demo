import LandingWrapper from '/src/hoc/LandingWrapper';
import {AuthLayout} from '../components/page_layout/AuthLayout';
import PropertiesPage from '../components/properties/PropertiesPage';
import {declinceAppAccessDueToPayment, fullScreenAuth, store_name} from '../constants/routes';
import {Center} from '@chakra-ui/react';
import {Spinner} from '../ui-lib';
import ServiceDowntime from './service_downtime';

function Home() {
  const storeName = store_name();
  return !storeName ? (
    <Center minH={`100vh`}>
      <Spinner />
    </Center>
  ) : (
    <AuthLayout
      authPage={fullScreenAuth}
      popupOnMount
      InnerComponent={
        declinceAppAccessDueToPayment?.includes(storeName) ? (
          <ServiceDowntime />
        ) : (
          <PropertiesPage />
        )
      }
    ></AuthLayout>
  );
}

export default LandingWrapper(Home);
