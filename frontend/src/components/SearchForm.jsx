import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { TAG_SET } from '../constants';

const searchTags = [{ label: '<untagged>' }, ...TAG_SET];
const searchGenres = ['<untagged>', 'Adventure', 'Survival',
  'Puzzle', 'Managerial', 'RTS', 'Interactive movie', 'Shooter', 'Action'];
const sizeLimits = [5, 10, 25, 40, 60];

const SearchForm = (
  {
    onSubmit,
    onClear,
    onTitleChange,
    formRef,
  },
) => {
  const formTagChoices = useRef();
  const formGenresChoices = useRef();

  function genreChanged() {
    const genreInput = formRef.current.querySelector('input[name="genres"]');
    genreInput.value = formGenresChoices.current.value;
  }

  function tagChanged() {
    const tagInput = formRef.current.querySelector('input[name="tags"]');
    tagInput.value = formTagChoices.current.value;
    const orderSelect = formRef.current.querySelector('select[name="orderBy"]');
    orderSelect.value = 'priority';
  }
  function sizeMinChanged() {
    const sizeMinInput = formRef.current.querySelector('input[name="sizeMin"]');
    const sizeMinSelect = formRef.current.querySelector('select[name="sizeMinSelect"]');
    sizeMinInput.value = sizeMinSelect.value;
  }
  function sizeMaxChanged() {
    const sizeMaxInput = formRef.current.querySelector('input[name="sizeMax"]');
    const sizeMaxSelect = formRef.current.querySelector('select[name="sizeMaxSelect"]');
    sizeMaxInput.value = sizeMaxSelect.value;
  }

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <input name="startsWith" type="hidden" />
      <label htmlFor="searchTitle" className="searchField">
        Search Title:
        <input name="searchTitle" type="text" onChange={onTitleChange} />
      </label>
      <button type="submit">Search</button>
      <button type="button" onClick={onClear}>Clear</button>
      <label htmlFor="genres" className="searchField">
        Genre:
        <input name="genres" type="text" />
        <select
          ref={formGenresChoices}
          onChange={genreChanged}
        >
          <option value="">-</option>
          {searchGenres.map(tag => (
            <option value={tag} key={tag}>{tag}</option>
          ))}
        </select>
      </label>
      <label htmlFor="tags" className="searchField">
        Tag:
        <input name="tags" type="text" />
        <select
          ref={formTagChoices}
          onChange={tagChanged}
        >
          <option value="">-</option>
          {searchTags.map(tag => (
            <option value={tag.label} key={tag.label}>{tag.label}</option>
          ))}
        </select>
      </label>
      <label htmlFor="priority" className="searchField">
        Priority:
        <input name="priority" type="text" size="4" />
      </label>
      <label htmlFor="sizeMin" className="searchField">
        Size Min:
        <input name="sizeMin" type="text" size="5" />
        <select name="sizeMinSelect" onChange={sizeMinChanged}>
          <option value="">-</option>
          {sizeLimits.map(size => (
            <option value={size} key={size}>{size}</option>
          ))}
        </select>
      </label>
      <label htmlFor="sizeMax" className="searchField">
        Size Max:
        <input name="sizeMax" type="text" size="5" />
        <select name="sizeMaxSelect" onChange={sizeMaxChanged}>
          <option value="">-</option>
          {sizeLimits.map(size => (
            <option value={size} key={size}>{size}</option>
          ))}
        </select>
      </label>
      <label htmlFor="orderBy" className="searchField">
        Order By:
        <select name="orderBy">
          <option value="">Updated At</option>
          <option value="fg_article_date">Article Date</option>
          <option value="updated-at-asc">Updated At -  Asc</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </label>
      <div>
        Missing:
        <label htmlFor="missedInstalled" className="searchField" title="Priority<50 and not tagged I installed">
          Installed:
          <input name="missedInstalled" type="checkbox" />
        </label>
        <label htmlFor="missedToInstall" className="searchField" title="Priority 50 - 80 and not to-install">
          To-Install:
          <input name="missedToInstall" type="checkbox" />
        </label>
        <label htmlFor="missedToDownload" className="searchField" title="Priority 80 - 100 and not to-download">
          To-Download:
          <input name="missedToDownload" type="checkbox" />
        </label>
        <label htmlFor="missedTried" className="searchField" title="Priority 200 - 300 and not tried">
          Tried:
          <input name="missedTried" type="checkbox" />
        </label>
        <label htmlFor="missedPriority" className="searchField" title="tagged (to-download, to-install, installed) and no priority">
          Priority:
          <input name="missedPriority" type="checkbox" />
        </label>
      </div>
    </form>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  formRef: PropTypes.object.isRequired,
};

export default SearchForm;
