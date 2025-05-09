import React from 'react';
import {Box, Divider, Heading, Hide, Stack, Text} from '@chakra-ui/react';
import StaggeredSkeleton from '../../tables/assetTableSkeleton';
import AssetsTransactionTable from '../../tables/assetsTransactionTable';

const TransactionHistory = ({
  arrayData,
  shouldScroll,
  infiniteData,
  scrollToTop,
  isFetchingNextPage,
  numberOfTransactions,
  isLoading,
  Column,
  isError,
  error,
  children,
  hideHeader,
  ...rest
}) => {
  return (
    <Stack
      px={{base: '0px', xl: '18px'}}
      border={{base: 'none', xl: '1.125px solid'}}
      borderColor={`matador_border_color.100 !important`}
      p={{base: '0px', xl: '23.5px'}}
      bg={{base: 'transparent', xl: 'matador_background.200'}}
      spacing="none"
      h="fit-content"
      {...rest}
    >
      <Text
        as="header"
        className="heading-text-regular"
        position="sticky"
        bg="matador_background.200"
        backdropFilter="blur(1.5px)"
        display={{base: 'none', xl: 'inline-block'}}
        zIndex={2}
        top="23px"
        _after={{
          content: '""',
          position: 'absolute',
          left: '0',
          bottom: '28px',
          w: 'full',
          h: '29px',
          bg: 'matador_background.200',
        }}
        fontSize="22.517px"
        fontWeight="600"
        textTransform={`capitalize`}
      >
        Transaction History
      </Text>
      {!hideHeader && (
        <Text
          display={{base: `inline-block`, xl: `none`}}
          fontSize={`16px`}
          fontWeight={`500`}
          lineHeight={`140%`}
          textTransform={`uppercase`}
        >
          Transaction History
        </Text>
      )}
      {children}
      <Divider border="none" h="0.95px" bg="matador_border_color.100" />
      <Box>
        <StaggeredSkeleton isLoading={isLoading}>
          <AssetsTransactionTable
            shouldScroll={shouldScroll}
            scrollToTop={scrollToTop}
            isFetchingNextPage={isFetchingNextPage}
            forData={[isFetchingNextPage, infiniteData]}
            isLoading={isLoading}
            isError={isError}
            error={error}
            forColumn={[isFetchingNextPage, infiniteData]}
            pageSize={numberOfTransactions}
            DATA={arrayData}
            COLUMNS={Column}
          />
        </StaggeredSkeleton>
      </Box>
    </Stack>
  );
};

export default TransactionHistory;
