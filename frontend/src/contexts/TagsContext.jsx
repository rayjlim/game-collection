import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { REST_ENDPOINT } from '../constants';

const TAG_SET = [
  {
    label: 'to-download',
    color: 'blue',
  },
  {
    label: 'to-install',
    color: 'green',
  },
  {
    label: 'installed',
    color: 'red',
  },
  {
    label: 'pink-paw',
    color: 'magenta',
  },
  {
    label: 'tried',
    color: 'orange',
  },
  {
    label: 'to-review',
    color: 'purple',
  },
  {
    label: 'skip',
    color: 'lime',
  },
  {
    label: 'dl-high',
    color: 'maroon',
  },
  {
    label: 'finished',
    color: 'grey',
  },
  {
    label: 'storyline',
    color: 'purple',
  },
  {
    label: 'techtree',
    color: 'purple',
  },
  {
    label: 'levels',
    color: 'purple',
  },
];

export const TagsContext = createContext([]);

export function TagsProvider({ children }) {
  const [tags, setTags] = useState(TAG_SET);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${REST_ENDPOINT}/api/tags`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Merge API tags with existing tags, preserving colors
        const mergedTags = data.map(apiTag => {
          console.log(apiTag);
          const existingTag = TAG_SET.find(tag => tag.label === apiTag);
          return {
            label: apiTag,
            color: existingTag?.color || 'gray' // Default color if not found
          };
        });
        console.log(mergedTags);
        setTags(mergedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <TagsContext.Provider value={{ tags, setTags }}>
      {children}
    </TagsContext.Provider>
  );
}

TagsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
