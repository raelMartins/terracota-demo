import {Box, Center, Flex, Hide, Image, Show, SimpleGrid, Text, VStack} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import {fetchAllUnits} from '../../../api/listing';
import {CardTwo} from '../../../components/cards';
import {Spinner} from '../../../ui-lib';
import {useRouter} from 'next/router';
import ErrorState from '../../../components/appState/error-state';
import {formatToCurrency} from '../../../utils';
import {UnitCard} from '../../../components/cards/UnitCard';

const AllUnits = ({info}) => {
  const router = useRouter();
  const projectId = info?.id;
  const {data, isError, isLoading, error} = useQuery(
    ['fetchAllUnits', projectId],
    () => fetchAllUnits(parseInt(projectId)),
    {enabled: !!projectId}
  );

  const Units = () =>
    data?.data?.results?.map(unit => (
      <UnitCard key={unit?.id} unit={unit} projectID={projectId} sold_out={info?.is_sold_out} />
    ));

  return (
    <Box mt={{base: '20px', md: '50px'}} w={{base: '100%', md: '100%'}} mx="auto">
      <Text
        fontSize={{base: '16px', lg: '24px'}}
        fontWeight={400}
        color="matador_text.100"
        className="heading-text-bold"
      >
        Available Units
      </Text>
      <Box
        w={{base: `43px`, md: '70px'}}
        mt="4px"
        borderBottom="1.8px solid"
        borderColor={`matador_text.200` || `#191919`}
      />

      {isLoading ? (
        <Spinner noAbsolute />
      ) : isError ? (
        <ErrorState />
      ) : (
        <SimpleGrid
          mt={{base: '15px', md: '26px'}}
          gap={{base: '16px', md: '24px', '2xl': '54px'}}
          columns={{base: 1, md: 2, lg: 3}}
          justify={'center'}
          alignItems={'center'}
        >
          <Units />
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AllUnits;
