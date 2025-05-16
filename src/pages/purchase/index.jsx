import {fetchAllUnits, fetchProjectsByIdServerside} from '@/api/listing';
import {DirectPurchasePage} from '@/components/directPurchaseFlow';
import {getServersideCookie} from '@/utils/sessionmanagers';

export default function PurchasePage({listing, unit, err}) {
  return <DirectPurchasePage listing={listing} unit={unit} err={err} />;
}

export async function getServerSideProps(ctx) {
  // Fetch data from external API
  try {
    // get store name
    const server_store_name = await getServersideCookie(ctx?.req?.cookies?.store_name);

    // get listing
    const res = await fetchProjectsByIdServerside(parseInt(ctx?.query?.listing), server_store_name);
    const listing = res?.data?.project;

    //get unit if unit id is provided
    let unit = null;
    if (ctx?.query?.unit) {
      const units = await fetchAllUnits(parseInt(ctx?.query?.listing));
      unit = units?.data?.results?.find(item => parseInt(item.id) == parseInt(ctx?.query?.unit));
    }

    // Pass data to the page via props
    return {
      props: {listing: listing || null, unit: unit || null, err: !unit && !listing ? true : false},
    };
  } catch (err) {
    console.log({err});

    return {props: {listing: null, unit: null, err: true}};
  }
}
