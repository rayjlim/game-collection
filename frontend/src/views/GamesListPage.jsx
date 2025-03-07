import React, { useRef, useEffect } from 'react';

import useSearchGames from '../hooks/useSearchGames';
import Game from '../components/Game';
import PaginationBar from '../components/PaginationBar';
import PnForm from '../components/PnForm';
import TagList from '../components/TagList';
import { TAG_SET } from '../constants';

import './GamesListPage.css';
import pkg from '../../package.json';

const searchTags = [{ label: '<untagged>' }, ...TAG_SET];

const searchGenres = ['<untagged>', 'Adventure', 'Survival',
  'Puzzle', 'Managerial', 'RTS', 'Interactive movie', 'Shooter', 'Action'];

const GamesListPage = () => {
  const searchForm = useRef();

  const formTagChoices = useRef();
  const formGenresChoices = useRef();

  const {
    loadGames,
    handlePageClick,
    searchLetter,
    clearFields,
    changeTitle,
    removeDuplicates,
    isLoading,
    games,
    page,
    pageMeta,
  } = useSearchGames(searchForm);

  useEffect(() => {
    (async () => {
      await loadGames();
    })();
  }, [page]);

  const letters = [];

  for (let i = 97; i <= 122; i++) {
    letters.push(String.fromCharCode(i));
  }

  function genreChanged() {
    const genreInput = searchForm.current.querySelector('input[name="genres"]');
    genreInput.value = formGenresChoices.current.value;
  }
  function tagChanged() {
    const tagInput = searchForm.current.querySelector('input[name="tags"]');
    tagInput.value = formTagChoices.current.value;
    const orderSelect = searchForm.current.querySelector('select[name="orderBy"]');
    orderSelect.value = 'priority';
  }
  return (
    <>
      <h1>Game Collection</h1>
      {isLoading && <h2>LOADING</h2>}

      <form ref={searchForm} onSubmit={loadGames}>
        <input name="startsWith" type="hidden" />
        <label htmlFor="searchTitle" className="searchField">
          Search Title:
          <input name="searchTitle" type="text" onChange={changeTitle} />
        </label>
        <button type="submit">Search</button>
        <button type="button" onClick={() => clearFields()}>Clear</button>
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
        </label>
        <label htmlFor="sizeMax" className="searchField">
          Size Max:
          <input name="sizeMax" type="text" size="5" />
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
      <div>
        {letters.map(letter => (
          <button key={letter} type="button" onClick={() => searchLetter(letter)} className="letter">{letter}</button>
        ))}
      </div>
      <PaginationBar pageCount={pageMeta.last_page} pageChange={handlePageClick} />

      <div>
        {`page: ${pageMeta.current_page} total: ${pageMeta.total}`}
      </div>
      {!isLoading && (
        games.map(entry => (
          <Game game={entry} key={entry.id} />
        ))
      )}
      <PaginationBar pageCount={pageMeta.last_page} pageChange={handlePageClick} />

      <button type="button" onClick={() => removeDuplicates()}>Remove Duplicates</button>
      <PnForm />
      <TagList />
      <div>{`version ${pkg.version}`}</div>
    </>
  );
};

export default GamesListPage;
