import React from 'react';
import { TAG_SET } from '../constants';

function getColorByLabel(label) {
  const tag = TAG_SET.find(item => item.label === label);
  return tag ? tag.color : null; // Return null if label is not found
}

const TagList = () => (
  <>
    {TAG_SET.map(tag => (
      <span key={tag.label} style={{ color: getColorByLabel(tag.label) }} className="tag-chip">{tag.label}</span>))}
  </>
);
export default TagList;
