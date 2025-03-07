import React, { useRef, useEffect } from 'react';

import useSearchGames from '../hooks/useSearchGames';
import Game from '../components/Game';
import PaginationBar from '../components/PaginationBar';
import PnForm from '../components/PnForm';
import TagList from '../components/TagList';
import SearchForm from '../components/SearchForm';
import './GamesListPage.css';
import pkg from '../../package.json';

const GamesListPage = () => {
  const searchForm = useRef();

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
    loadGames();
  }, [page]);

  const letters = [];
  for (let i = 97; i <= 122; i++) {
    letters.push(String.fromCharCode(i));
  }

  return (
    <>
      <h1>Game Collection</h1>
      {isLoading && <h2>LOADING</h2>}

      <SearchForm
        onSubmit={loadGames}
        onClear={clearFields}
        onTitleChange={changeTitle}
        formRef={searchForm}
      />

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
