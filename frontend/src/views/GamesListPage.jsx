import React, { useRef, useEffect } from 'react';

import useSearchGames from '../hooks/useSearchGames';
import GameListItems from '../components/GameListItems';
import PaginationBar from '../components/PaginationBar';
import PnForm from '../components/PnForm';

import './GamesListPage.css';
import pkg from '../../package.json';

const searchTtags = ['<untagged>', 'to-download', 'to-install', 'installed', 'pink-paw', 'tried', 'to-review', 'skip', 'dl-high'];

const GamesListPage = () => {
  const searchForm = useRef();

  const formTagChoices = useRef();

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

  return (
    <>
      <h1>Game Collection</h1>
      {isLoading && <h2>LOADING</h2>}
      <div>
        <form ref={searchForm} onSubmit={loadGames}>
          <input name="startsWith" type="hidden" />
          <label htmlFor="searchTitle" className="searchField">
            Search Title:
            <input name="searchTitle" type="text" onChange={changeTitle} />
          </label>
          <button type="submit">Search</button>
          <button type="button" onClick={() => clearFields()}>Clear</button>
          <label htmlFor="tags" className="searchField">
            Tag:
            <input name="tags" type="text" />
            <select
              ref={formTagChoices}
              onChange={() => {
                const tagsInput = searchForm.current.querySelector('input[name="tags"]');
                tagsInput.value = formTagChoices.current.value;
              }}
            >
              <option value="">-</option>
              {searchTtags.map(tag => (
                <option value={tag}>{tag}</option>
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
        </form>
        {letters.map(letter => (
          <button type="button" onClick={() => searchLetter(letter)} className="letter">{letter}</button>
        ))}
      </div>
      <PaginationBar pageCount={pageMeta.last_page} pageChange={handlePageClick} />

      <div>
        page:
        {pageMeta.current_page}
        total:
        {pageMeta.total}
      </div>
      {!isLoading && (
        <GameListItems
          games={games}
        />
      )}
      <PaginationBar pageCount={pageMeta.last_page} pageChange={handlePageClick} />

      <button type="button" onClick={() => removeDuplicates()}>Remove Duplicates</button>
      <PnForm />
      <div>{`version ${pkg.version}`}</div>
    </>
  );
};

export default GamesListPage;
