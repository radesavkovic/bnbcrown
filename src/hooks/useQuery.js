import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const queryContext = createContext();

export const useQuery = () => useContext(queryContext);

const useProvideQuery = () => {
  const { search } = useLocation();
  const [query] = useState(new URLSearchParams(search));
  return query;
};

export function ProvideQuery({ children }) {
  const query = useProvideQuery();
  return <queryContext.Provider value={query}>{children}</queryContext.Provider>;
}
ProvideQuery.propTypes = {
  children: PropTypes.node.isRequired,
};
