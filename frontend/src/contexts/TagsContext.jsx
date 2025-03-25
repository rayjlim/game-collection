import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const TagsContext = createContext([]);

export function TagsProvider({ children }) {
  const [tags, setTags] = useState([]);

  return (
    <TagsContext.Provider value={{ tags, setTags }}>
      {children}
    </TagsContext.Provider>
  );
}

TagsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// TODO:
// - get the tags from the api in to the context
// - logical location for the color to tag mapping