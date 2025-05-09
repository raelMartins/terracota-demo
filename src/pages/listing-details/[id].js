import {AuthLayout} from '@/components/page_layout/AuthLayout';
import {ListingPage} from '@/components/properties/listings/ListingPage';

const ListingDetails = () => {
  return <AuthLayout InnerComponent={<ListingPage />}></AuthLayout>;
};

export default ListingDetails;
