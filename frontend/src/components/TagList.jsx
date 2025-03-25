import React from 'react';
import { useContext } from 'react';
import { TagsContext } from '../contexts/TagsContext';

const TagList = () => {
  const { tags } = useContext(TagsContext);
  function getColorByLabel(label) {
    const tag = tags.find(item => item.label === label);
    return tag ? tag.color : null; // Return null if label is not found
  }

  return (
    <>
      {tags.map(tag => (
        <span key={tag.label} style={{ color: getColorByLabel(tag.label) }} className="tag-chip">{tag.label}</span>))}
    </>
  )
};
export default TagList;
