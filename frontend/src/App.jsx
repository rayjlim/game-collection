import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import GamesListPage from './views/GamesListPage';
import { TagsProvider } from './contexts/TagsContext';

import './App.css';

const App = () => (
  <div id="container">
    <ToastContainer />
    <TagsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<GamesListPage />} />
        </Routes>
      </BrowserRouter>
    </TagsProvider>
  </div>
);
export default App;
