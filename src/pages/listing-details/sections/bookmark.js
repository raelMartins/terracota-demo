import {Box, Tooltip} from '@chakra-ui/react';
import {WatchlistBookmark} from '../../../components/cards/watchlistBookmark';
import useWatchlist from '../../../ui-lib/ui-lib.hooks/useWatchlist';
import React from 'react';
import {BsBookmarkDash, BsBookmarkDashFill} from 'react-icons/bs';
import useGetSession from '@/utils/hooks/getSession';

const BookmarkProperty = ({info, openAuth, refetch, InnerComponent, ...rest}) => {
  const {sessionData: LoggedinUser} = useGetSession('loggedIn');

  const {toggleWatchlist, isWatchlisted, isWatchlistLoading} = useWatchlist({info, refetch});

  const handleClick = () => {
    if (LoggedinUser) {
      toggleWatchlist();
    } else {
      openAuth();
    }
  };

  return (
    <>
      {InnerComponent ? (
        React.isValidElement(InnerComponent) ? (
          React.cloneElement(InnerComponent, {
            onClick: handleClick,
            isDisabled: isWatchlistLoading,
            _hover: {opacity: isWatchlistLoading ? `auto` : `1`},
          })
        ) : null
      ) : (
        <Tooltip hasArrow label={isWatchlisted ? `Remove From Watchlist` : 'Add To Watchlist'}>
          <Box
            cursor="pointer"
            borderRadius="4.444px"
            px="10px"
            py="8px"
            border="0.9px solid"
            color={'matador_text.200'}
            // borderColor={'matador_text.200'} //confirm style change from Ahmed before deleting
            borderColor={'matador_border_color.100'}
            boxShadow={`0px 0.889px 1.778px 0px rgba(16, 24, 40, 0.05)`}
            onClick={handleClick}
            fontSize={'28px'}
            // bg={`transparent !important`} //confirm style change from Ahmed before deleting
            bg={`matador_background.200 !important`}
            {...rest}
          >
            {isWatchlisted ? <BsBookmarkDashFill /> : <BsBookmarkDash />}
          </Box>
        </Tooltip>
      )}
    </>
  );
};

export default BookmarkProperty;
