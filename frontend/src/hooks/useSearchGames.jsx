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
    const searchTitle = formData.get('searchTitle');
    const tags = formData.get('tags');
    const sizeMin = formData.get('sizeMin');
    const sizeMax = formData.get('sizeMax');
    const orderBy = formData.get('orderBy');
    const startsWith = formData.get('startsWith');
    const priority = formData.get('priority');

    const endpoint = `${REST_ENDPOINT}/api/games/?page=${page}`;
    let searchFields = '';
    if (searchTitle !== '') {
      searchFields += `&search_title=${searchTitle}`;
    }
    if (tags !== '') {
      searchFields += `&tags=${tags}`;
    }
    if (sizeMin !== '') {
      searchFields += `&size_min=${sizeMin}`;
    }
    if (sizeMax !== '') {
      searchFields += `&size_max=${sizeMax}`;
    }
    if (orderBy !== '') {
      searchFields += `&order_by=${orderBy}`;
    }
    if (startsWith !== '') {
      searchFields += `&starts_with=${startsWith}`;
    }
    if (priority !== '') {
      searchFields += `&priority=${priority}`;
    }
    setIsLoading(true);
    // TODO: if production, then pass mode: 'no-cors', in fetch options

    try {
      const response = await fetch(`${endpoint}${searchFields}`, {

      });
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        throw new Error(response.status);
      } else {
        const data = await response.json();
        console.log('data :', data);
        const localGames = data.data.map(x => {
          const newVal = { ...x };
          if (x.platform === null) {
            newVal.platform = 1;
          }
          return newVal;
        });
        setGames(localGames);
        setPageMeta(data);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      toast.error(`loading error : ${err}`);
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
    const searchTitle = searchForm.current.querySelector('input[name="searchTitle"]');
    searchTitle.value = '';
    const startsWith = searchForm.current.querySelector('input[name="startsWith"]');
    startsWith.value = '';
    const orderBy = searchForm.current.querySelector('select[name="orderBy"]');
    orderBy.value = '';
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
