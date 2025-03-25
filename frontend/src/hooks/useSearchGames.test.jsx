import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import useSearchGames from './useSearchGames';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('useSearchGames', () => {
  const mockFormRef = {
    current: {
      querySelector: vi.fn().mockReturnValue({ value: '' }),
      querySelectorAll: vi.fn().mockReturnValue([
        { value: 'test' },
        { value: 'value' }
      ])
    }
  };

  const mockFormData = {
    searchTitle: 'test',
    priority: '50',
    tags: 'action',
    startsWith: ''
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();

    // Mock FormData implementation
    global.FormData = vi.fn(() => ({
      *[Symbol.iterator]() {
        for (const [key, value] of Object.entries(mockFormData)) {
          yield [key, value];
        }
      },
      entries() {
        return this[Symbol.iterator]();
      }
    }));
  });

  const mockGameData = {
    data: [
      { id: 1, title: 'Game 1' },
      { id: 2, title: 'Game 2', platform: 'PC' }
    ],
    last_page: 3,
    current_page: 1,
    total: 10
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSearchGames(mockFormRef));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.games).toEqual([]);
    expect(result.current.page).toBe(1);
    expect(result.current.pageMeta).toEqual({ last_page: 1 });
  });

  it.skip('loads games successfully', async () => {
    global.FormData = vi.fn(() => ({
      entries: () => [['searchTitle', 'test']]
    }));

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGameData)
    });

    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      await result.current.loadGames({ preventDefault: vi.fn() });
    });

    expect(result.current.games).toHaveLength(2);
    expect(result.current.pageMeta).toEqual(mockGameData);
    expect(result.current.isLoading).toBe(false);
  });

  it.skip('handles load games error', async () => {
    global.FormData = vi.fn(() => ({
      entries: () => [['searchTitle', 'test']]
    }));

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      await result.current.loadGames({ preventDefault: vi.fn() });
    });

    expect(toast.error).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles page change', async () => {
    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      result.current.handlePageClick({ selected: 2 });
    });

    expect(result.current.page).toBe(3);
  });

  it('searches by letter', async () => {
    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      await result.current.searchLetter('a');
    });

    expect(mockFormRef.current.querySelector).toHaveBeenCalledWith('input[name="startsWith"]');
    expect(mockFormRef.current.querySelector).toHaveBeenCalledWith('select[name="orderBy"]');
  });

  it('clears search fields', async () => {
    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      await result.current.clearFields();
    });

    expect(mockFormRef.current.querySelectorAll).toHaveBeenCalledWith('input[name], select[name]');
    expect(result.current.page).toBe(1);
  });

  it('removes duplicates successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true
    });

    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      await result.current.removeDuplicates();
    });

    expect(toast.error).toHaveBeenCalledWith('Duplicates removed');
  });

  it('handles remove duplicates error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useSearchGames(mockFormRef));

    await act(async () => {
      await result.current.removeDuplicates();
    });

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('loading error'));
  });
});