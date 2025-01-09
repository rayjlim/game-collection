import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { parse, format } from 'date-fns';
import useGame from '../hooks/useGame';
import { LARGE_GAME_SIZE, MEDIUM_GAME_SIZE } from '../constants';

import './Game.css';

const tagsSet = ['to-download', 'to-install', 'installed', 'pink-paw', 'tried', 'to-review', 'skip', 'dl-high', 'finished'];

const Game = ({ game }) => {
  const formRef = useRef();

  const {
    saveGame,
    addRemoveTag,
    current,
    isEditing,
    setIsEditing,
  } = useGame(game, formRef);

  function externalLink(url) {
    window.open(url, '_blank');
  }

  let sizeClassName = '';
  switch (true) {
    case current.size_calculated > LARGE_GAME_SIZE:
      sizeClassName = 'large-size';
      break;
    case current.size_calculated > MEDIUM_GAME_SIZE:
      sizeClassName = 'medium-size';
      break;
    default:
      sizeClassName = 'small-size';
  }

  return (
    <section
      key={current.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        border: '1px solid lightgrey',
        alignItems: 'center',
      }}
    >
      <img
        src={current.image}
        alt="game poster"
        className="game-image"
        onClick={() => externalLink(current.fg_url)}
        aria-hidden="true"
      />
      <div className={`game-list-row ${sizeClassName}`}>
        <div className="manual" style={{ margin: '.2rem' }}>
          <button
            id="editBtn"
            onClick={() => setIsEditing(!isEditing)}
            type="button"
            style={{ margin: '0 .2rem' }}
          >
            Edit
          </button>
          {current.title}
          <span>
            {`fg id: ${current.fg_id}`}
          </span>
        </div>
        <div>
          {current.genre
            && (
              <span>
                {`Genre: ${current.genre}`}
              </span>
            )}

          <span className={sizeClassName}>
            {` Size: ${current.size_calculated}`}
          </span>
          <span>
            {` Article date: (${format(
              parse(current.fg_article_date, 'yyyy-MM-dd', new Date()),
              'MMM-dd-yyyy',
            )})`}
          </span>
        </div>
        {isEditing ? (
          <div className="manual">
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
                {tagsSet.map(tag => (
                  <button key={tag} type="button" onClick={() => addRemoveTag(tag)} className="tagBtn">
                    {tag}
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
          </div>
        ) : (
          <>
            <div className="manual">
              <span title="Priorities description
-1
- 1 - 20  Top tier to play
- 50 - 80  Next to install
- 80 - 100  Next to download + install
- 200 finished, installed, uninstalled,
- 300 Errors / Issues
- 400 There's a newer version
- 500 Not interested"
              >
                Priority:
                {current.priority !== -1 && (
                  <span>
                    {current.priority}
                  </span>
                )}
                {`, Platform: ${current.platform} Status: ${current.status} Graphic style: ${current.graphic_style}, `}
                {`Tags: ${current.tags} Thoughts: ${current.thoughts}`}
              </span>
            </div>
            {current.playnite_title !== '' && (
              <div>
                {`pn: ${current.playnite_title}`}
                {current.playnite_last !== '' && `, ${current.playnite_last}, ${current.playnite_added}, ${current.playnite_playtime}`}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
export default Game;

Game.propTypes = {
  game: PropTypes.object.isRequired,
};
