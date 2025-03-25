import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { parse, format } from 'date-fns';
import useGame from '../hooks/useGame';
import GameEditForm from './GameEditForm';
import { LARGE_GAME_SIZE, MEDIUM_GAME_SIZE, TAG_SET } from '../constants';

import './Game.css';

const Game = ({ game }) => {
  const formRef = useRef();

  const {
    saveGame,
    addRemoveTag,
    current,
    isEditing,
    setIsEditing,
  } = useGame(game, formRef);

  const getSizeClassName = () => {
    if (current.size_calculated > LARGE_GAME_SIZE) return 'large-size';
    if (current.size_calculated > MEDIUM_GAME_SIZE) return 'medium-size';
    return 'small-size';
  };

  const displayTags = current.tags.trim() ? current.tags.trim().split(/\s+/) : [];
  const sizeClassName = getSizeClassName();

  const handleExternalLink = url => {
    window.open(url, '_blank');
  };

  const getColorByLabel = label => {
    const tag = TAG_SET.find(item => item.label === label);
    return tag?.color || null;
  };

  const renderGameInfo = () => (
    <>
      <div className="manual">
        <span title="Priorities description...">
          Priority:
          {current.priority !== -1 && <span>{current.priority}</span>}
          {`, Platform: ${current.platform} Status: ${current.status} Graphic style: ${current.graphic_style}, `}
          Tags:
          {displayTags.length}
          {displayTags.length > 0 && displayTags.map(tag => (
            <span
              key={tag}
              style={{ color: getColorByLabel(tag) }}
              className="tag-chip"
              data-testid="game-tag"
            >
              {tag}
            </span>
          ))}
          <br />
          {`Thoughts: ${current.thoughts}`}
        </span>
      </div>
      {current.playnite_title && (
        <div>
          {`pn: ${current.playnite_title}`}
          {current.playnite_last && `, ${current.playnite_last}, ${current.playnite_added}, ${current.playnite_playtime}`}
        </div>
      )}
    </>
  );

  return (
    <section key={current.id} className="game-container" role="region">
      <img
        src={current.image}
        alt="game poster"
        className="game-image"
        onClick={() => handleExternalLink(current.fg_url)}
        aria-hidden="true"
      />
      <div className={`game-list-row ${sizeClassName}`}>
        <div className="manual game-info">
          <button
            id="editBtn"
            onClick={() => setIsEditing(!isEditing)}
            type="button"
            className="edit-button"
          >
            Edit
          </button>
          {current.title}
          <span>{`fg id: ${current.fg_id}`}</span>
        </div>
        <div>
          {current.genre && <span>{`Genre: ${current.genre}`}</span>}
          <span className={sizeClassName}>{` Size: ${current.size_calculated}`}</span>
          <span>
            {` Article date: (${format(
              parse(current.fg_article_date, 'yyyy-MM-dd', new Date()),
              'MMM-dd-yyyy',
            )})`}
          </span>
        </div>
        {isEditing ? (
          <GameEditForm
            formRef={formRef}
            current={current}
            saveGame={saveGame}
            addRemoveTag={addRemoveTag}
          />
        ) : renderGameInfo()}
      </div>
    </section>
  );
};

Game.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    fg_id: PropTypes.number.isRequired,
    fg_url: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    size_calculated: PropTypes.number.isRequired,
    genre: PropTypes.string,
    tags: PropTypes.string,
    // ... add other specific prop types
  }).isRequired,
};

export default Game;
