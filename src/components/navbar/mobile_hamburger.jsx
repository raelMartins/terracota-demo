import {Icon, useDisclosure} from '@chakra-ui/react';
import React from 'react';
import {BiMenu} from 'react-icons/bi';
import MobileDrawer from './mobile_drawer';

import {useQuery} from 'react-query';
import {getSettingsData} from '../../api/Settings';
import {fetchAgentPrivacyPolicy, fetchAgentTerms} from '../../api/agents';
import {Notification} from '../notification_drawer';
import {Wallet} from '../wallet_drawer';
import Feedback from '../feedback/feedback';
import {ReportBug} from '../report_bug';
import {SuggestIdea} from '../suggest_idea';
import {MyAssets} from '../my_asset';
import {Watchlist} from '../watchlist_drawer';
import {storeDetails} from '../../api/auth';
import useGetSession from '../../utils/hooks/getSession';

// import Feedback from '../feedback/feedback';
// import {SuggestIdea} from '../drawers/suggest_idea';
// import {Notification} from '../notification';
// import {MyAssets} from '../drawers/my_asset';
// import {Watchlist} from '../watchlist_drawer';
// import {ReportBug} from '../drawers/report_bug';
// import {Wallet} from '../wallet_drawer';

export const MobileHamburger = ({isAssetOpen, onAssetClose, onAssetOpen}) => {
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const settingsQuery = useQuery(
    ['getSettingsData', 'profile'],
    () => getSettingsData({profile: true}),
    {
      enabled: !!LoggedinUser,
    }
  );
  const avatar = settingsQuery?.data?.data?.data?.avatar;
  const STOREINFO = useQuery(['storeInfo'], storeDetails);
  const store_data = STOREINFO.data?.data?.data;

  const TERMS = store_data?.customer_document;
  const PRIVACY_POLICY = store_data?.customer_privacy_policy;

  const {isOpen: isNotOpen, onOpen: onNotOpen, onClose: onNotClose} = useDisclosure();
  const {isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose} = useDisclosure();
  const {isOpen: isWalOpen, onOpen: onWalOpen, onClose: onWalClose} = useDisclosure();
  const {isOpen: isWatchOpen, onOpen: onWatchOpen, onClose: onWatchClose} = useDisclosure();
  const feedBackModal = useDisclosure();
  const reportBugModal = useDisclosure();
  const suggestModal = useDisclosure();
  return (
    <>
      <Icon as={BiMenu} color="text" onClick={onDrawerOpen} fontSize={'30px'} />
      <MobileDrawer
        TERMS={TERMS}
        PRIVACY_POLICY={PRIVACY_POLICY}
        feedBackModal={feedBackModal}
        reportBugModal={reportBugModal}
        suggestModal={suggestModal}
        onNotOpen={onNotOpen}
        onAssetOpen={onAssetOpen}
        onWatchOpen={onWatchOpen}
        onWalOpen={onWalOpen}
        avatar={avatar}
        isDrawerOpen={isDrawerOpen}
        onDrawerClose={onDrawerClose}
        onDrawerOpen={onDrawerOpen}
      />
      <Notification onDrawerOpen={onDrawerOpen} isNotOpen={isNotOpen} onNotClose={onNotClose} />
      <Wallet
        onDrawerOpen={onDrawerOpen}
        avatar={avatar}
        isWalOpen={isWalOpen}
        onWalClose={onWalClose}
      />
      <Feedback onDrawerOpen={onDrawerOpen} feedModal={feedBackModal} />
      <ReportBug onDrawerOpen={onDrawerOpen} reportBugModal={reportBugModal} />
      <SuggestIdea onDrawerOpen={onDrawerOpen} suggestModal={suggestModal} />
      <MyAssets onDrawerOpen={onDrawerOpen} isAssetOpen={isAssetOpen} onAssetClose={onAssetClose} />
      <Watchlist
        onDrawerOpen={onDrawerOpen}
        isWatchOpen={isWatchOpen}
        onWatchClose={onWatchClose}
      />
    </>
  );
};

export default MobileHamburger;
