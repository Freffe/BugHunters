import React from 'react';
import { Grid, Search } from 'semantic-ui-react';
import { ITicket } from '../../../app/models/tickets';

// Initial version only searches the title.
// Todo: Expand to include description aswell later on.
const initialState = {
  loading: false,
  results: [],
  value: '',
};

function exampleReducer(
  state: {
    loading: boolean;
    results: never[];
    value: string;
  },
  action: any
) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState;
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query };
    case 'FINISH_SEARCH':
      return { ...state, loading: false };
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection };

    default:
      throw new Error();
  }
}

interface IProps {
  titleList: ITicket[];
  handleSearchResults: (ticketIds: string[]) => void;
}

const SearchList: React.FC<IProps> = ({ titleList, handleSearchResults }) => {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState);
  const { loading, value } = state;
  //console.log('Received titleList: ', titleList);
  const handleSearchChange = React.useCallback(
    (e, data) => {
      dispatch({ type: 'START_SEARCH', query: data.value });

      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' });
        handleSearchResults([]);
        return;
      }

      const re = new RegExp(data.value, 'i');
      const isMatch = (result: any) => re.test(result.title);
      // Filter all titleList.tickets for the regex
      // With the returning array, we also need to get the ticket.Ids
      // Then callback that array to caller component.
      const titleResults = titleList
        .filter((ticket) => isMatch(ticket))
        .map((ticket) => ticket.id);

      dispatch({
        type: 'FINISH_SEARCH',
      });
      handleSearchResults(titleResults);
    },
    [titleList, handleSearchResults]
  );

  return (
    <Grid>
      <Grid.Column width={6}>
        <Search
          disabled={titleList.length === 0}
          placeholder='Search title...'
          loading={loading}
          onSearchChange={handleSearchChange}
          value={value}
          showNoResults={false}
        />
      </Grid.Column>
    </Grid>
  );
};

export default SearchList;
