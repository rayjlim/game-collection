import React from 'react';
import PropTypes from 'prop-types';
import { TAG_SET } from '../constants';

const GameEditForm = (
  {
    formRef, current, saveGame, addRemoveTag,
  },
) => (
  <form ref={formRef} onSubmit={saveGame}>
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
      <input name="priority" defaultValue={current.priority} />
    </label>

    <label htmlFor="platform">
      Platform:
      <input name="platform" defaultValue={current.platform} />
    </label>

    <label htmlFor="status">
      Status:
      <input name="status" defaultValue={current.status} />
    </label>

    <label htmlFor="graphicStyle">
      Graphic Style:
      <input name="graphicStyle" defaultValue={current.graphic_style} />
    </label>

    <label htmlFor="tags">
      Tags:
      <input name="tags" defaultValue={current.tags} />
      {TAG_SET.map(tag => (
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
      <textarea name="thoughts" defaultValue={current.thoughts} />
    </label>
    <label htmlFor="playniteTitle" className="notesField">
      Playnite Title:
      <input name="playniteTitle" defaultValue={current.playnite_title} />
    </label>
    <button type="submit" className="saveBtn" id="saveBtn">Save</button>
  </form>
);

GameEditForm.propTypes = {
  formRef: PropTypes.object.isRequired,
  current: PropTypes.object.isRequired,
  saveGame: PropTypes.func.isRequired,
  addRemoveTag: PropTypes.func.isRequired,
};

export default GameEditForm;
