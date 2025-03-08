import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { TAG_SET } from '../constants';

const searchTags = [{ label: '<untagged>' }, ...TAG_SET];
const searchGenres = ['<untagged>', 'Adventure', 'Survival',
  'Puzzle', 'Managerial', 'RTS', 'Interactive movie', 'Shooter', 'Action'];
const sizeLimits = [5, 10, 25, 40, 60];
const orderByOptions = [
  { value: '', label: 'Updated At' },
  { value: 'fg_article_date', label: 'Article Date' },
  { value: 'updated-at-asc', label: 'Updated At - Asc' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

const FormField = ({
  label,
  name,
  type = 'text',
  size,
  children,
}) => (
  <label htmlFor={name} className="searchField">
    {label}
    :
    <input name={name} type={type} size={size} />
    {children}
  </label>
);

const SelectWithInput = ({
  name,
  options,
  onChange,
  reference,
}) => (
  <select
    name={`${name}Select`}
    onChange={onChange}
    ref={reference}
  >
    <option value="">-</option>
    {options.map(opt => (
      <option
        value={typeof opt === 'object' ? opt.label : opt}
        key={typeof opt === 'object' ? opt.label : opt}
      >
        {typeof opt === 'object' ? opt.label : opt}
      </option>
    ))}
  </select>

);

const SearchForm = ({
  onSubmit,
  onClear,
  onTitleChange,
  formRef,
}) => {
  const formTagChoices = useRef();
  const formGenresChoices = useRef();

  const handleSelectChange = inputName => () => {
    const input = formRef.current.querySelector(`input[name="${inputName}"]`);
    const select = formRef.current.querySelector(`select[name="${inputName}Select"]`);
    input.value = select.value;

    if (inputName === 'tags') {
      const orderSelect = formRef.current.querySelector('select[name="orderBy"]');
      orderSelect.value = 'priority';
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <input name="startsWith" type="hidden" />

      <FormField label="Search Title" name="searchTitle">
        <input name="searchTitle" type="text" onChange={onTitleChange} />
      </FormField>

      <button type="submit">Search</button>
      <button type="button" onClick={onClear}>Clear</button>

      <FormField label="Genre" name="genres" size={5}>
        <SelectWithInput
          name="genres"
          options={searchGenres}
          onChange={handleSelectChange('genres')}
          reference={formGenresChoices}
        />
      </FormField>

      <FormField label="Tag" name="tags" size={15}>
        <SelectWithInput
          name="tags"
          options={searchTags}
          onChange={handleSelectChange('tags')}
          reference={formTagChoices}
        />
      </FormField>

      <FormField label="Priority" name="priority" size="3" />

      <FormField label="Size Min" name="sizeMin" size={3}>
        <SelectWithInput
          name="sizeMin"
          options={sizeLimits}
          onChange={handleSelectChange('sizeMin')}
          inputSize={5}
        />
      </FormField>

      <FormField label="Size Max" name="sizeMax" size={3}>
        <SelectWithInput
          name="sizeMax"
          options={sizeLimits}
          onChange={handleSelectChange('sizeMax')}
        />
      </FormField>

      <label htmlFor="orderBy" className="searchField">
        Order By:
        <select name="orderBy">
          {orderByOptions.map(opt => (
            <option value={opt.value} key={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <div>
        Missing:
        {['Installed', 'To-Install', 'To-Download', 'Tried', 'Priority'].map(type => (
          <FormField
            key={type}
            label={type}
            name={`missed${type}`}
            type="checkbox"
          />
        ))}
      </div>
    </form>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.node,
};
FormField.defaultProps = {
  type: 'text',
  size: '',
  children: null,
};
SelectWithInput.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  reference: PropTypes.object,
};
SelectWithInput.defaultProps = {
  reference: null,
};
SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  formRef: PropTypes.object.isRequired,
};

export default SearchForm;
