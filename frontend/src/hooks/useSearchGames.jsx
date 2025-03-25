import { useState } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';

export default function useSearchGames(searchForm) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [pageMeta, setPageMeta] = useState({ last_page: 1 });
  async function loadGames(event) {
    console.log(event);
    event?.preventDefault();

    const formData = new FormData(searchForm.current);
    const formValues = Object.fromEntries(formData); // Extracts all form values at once

    const endpoint = `${REST_ENDPOINT}/api/games/?page=${page}`;

    const searchFields = Object.entries(formValues)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => `&${key.replace(/_/g, '-')}=${encodeURIComponent(value)}`)
      .join('');

    setIsLoading(true);

    try {
      const response = await fetch(`${endpoint}${searchFields}`);

      // console.log('response:', response);
      if (!response.ok) {
        console.log('response.status:', response.status);
        throw new Error(response.status);
      }

      const data = await response.json();
      console.log('data:', data);

      // Ensure platform is set
      const localGames = data.data.map(game => ({
        ...game,
        platform: game.platform ?? 1, // Uses nullish coalescing for clarity
      }));

      setGames(localGames);
      setPageMeta(data);
    } catch (err) {
      console.error(`Error: ${err}`);
      toast.error(`Loading error: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function removeDuplicates() {
    toast.error('Removing...');
    const endpoint = `${REST_ENDPOINT}/api/games/removeDuplicates/`;

    try {
      const response = await fetch(`${endpoint}`);
      if (!response.ok) {
        console.log('response.status :', response.status);
        throw new Error(response.status);
      } else {
        toast.error('Duplicates removed');
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      toast.error(`loading error : ${err}`);
    }
  }

  /** Search functions */

  const handlePageClick = event => {
    const newOffset = (event.selected * pageMeta.itemsPerPage) % games.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    // setItemOffset(newOffset);
    setPage(event.selected + 1);
  };
  const searchLetter = async letter => {
    console.log(letter);

    const startsWith = searchForm.current.querySelector('input[name="startsWith"]');
    startsWith.value = letter;
    const orderBy = searchForm.current.querySelector('select[name="orderBy"]');
    orderBy.value = 'title';
    setPage(1);
    await loadGames();
  };
  const clearFields = async () => {
    const form = searchForm.current;
    const fields = form.querySelectorAll('input[name], select[name]');

    [...fields].forEach(field => {
      // eslint-disable-next-line no-param-reassign
      field.value = '';
    });

    setPage(1);
    await loadGames();
  };

  const changeTitle = () => {
    const startsWith = searchForm.current.querySelector('input[name="startsWith"]');
    startsWith.value = ''; // clear the search by letter field
  };
  return {
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
  };
}
