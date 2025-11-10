import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { TagsContext } from '../contexts/TagsContext';

const GameEditForm = (
  {
    formRef, current, saveGame, addRemoveTag,
  },
) => {
  const { tags } = useContext(TagsContext);
  const [priorityError, setPriorityError] = useState(false);
  const priorityInputRef = useRef(null);
  return (
    <form ref={formRef} onSubmit={(e) => {
      e.preventDefault();
      const priorityValue = e.target.priority.value;
      const isInteger = /^-?\d+$/.test(priorityValue);
      
      if (!isInteger) {
        setPriorityError(true);
        priorityInputRef.current.focus();
        priorityInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      
      setPriorityError(false);
      saveGame(e);
    }} role="form">
      <label
        htmlFor="priority"
        title="Priorities description
-1
- 1 - 20  Top tier to play
- 50 - 80  Next to install
- 80 - 100  Next to download + install
- 200  finished, installed, uninstalled,
- 300  Errors / Issues
- 400  There's a newer version"
      >
        Priority:
        <input
          ref={priorityInputRef}
          id="priority"
          name="priority"
          defaultValue={current.priority}
          data-testid="priority-input"
          className={priorityError ? 'error' : ''}
          onChange={(e) => {
            const value = e.target.value;
            const isInteger = /^-?\d+$/.test(value);
            setPriorityError(!isInteger);
          }}
        />
      </label>

      <label htmlFor="platform">
        Platform:
        <input id="platform" name="platform" defaultValue={current.platform} data-testid="platform-input" />
      </label>

      <label htmlFor="status">
        Status:
        <input id="status" name="status" defaultValue={current.status} />
      </label>

      <label htmlFor="graphicStyle">
        Graphic Style:
        <input id="graphicStyle" name="graphicStyle" defaultValue={current.graphic_style} />
      </label>

      <label htmlFor="tags">
        Tags:
        <input id="tags" name="tags" defaultValue={current.tags} />
        {tags.map(tag => (
          <button key={tag.label} type="button" onClick={() => addRemoveTag(tag.label)} className="tagBtn">
            {tag.label}
          </button>
        ))}
      </label>
      <label htmlFor="thoughts" className="notesField">
        Notes:
        <a
          href="#a"
          title="progression types: level (Geometry Wars);
              storyline: Pine, Lightbringer, In Nightmare;
              Tech-tree (Craft the world, Old World, Patron)"
        >
          I
        </a>
        <textarea id="thoughts" name="thoughts" defaultValue={current.thoughts} />
      </label>
      <label htmlFor="playniteTitle" className="notesField">
        Playnite Title:
        <input id="playniteTitle" name="playniteTitle" defaultValue={current.playnite_title} />
      </label>
      <button type="submit" className="saveBtn" id="saveBtn">Save</button>
    </form>
  )
};

GameEditForm.propTypes = {
  formRef: PropTypes.object.isRequired,
  current: PropTypes.object.isRequired,
  saveGame: PropTypes.func.isRequired,
  addRemoveTag: PropTypes.func.isRequired,
};

export default GameEditForm;
