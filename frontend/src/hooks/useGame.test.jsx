import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import useGame from './useGame';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('useGame', () => {
  const mockGame = {
    id: 1,
    title: 'Test Game',
    priority: '50',
    platform: 'PC',
    status: 'Active',
    graphic_style: 'Pixel',
    tags: 'action rpg',
    thoughts: 'Great game',
    playnite_title: 'Test'
  };

  const mockFormRef = {
    current: {
      querySelector: vi.fn(selector => ({
        value: 'test-value'
      }))
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('initializes with provided game data', () => {
    const { result } = renderHook(() => useGame(mockGame, mockFormRef));

    expect(result.current.current).toEqual(mockGame);
    expect(result.current.isEditing).toBe(false);
  });

  it('handles save game with missing priority', async () => {
    const mockEvent = {
      preventDefault: vi.fn()
    };

    const mockFormData = {
      get: vi.fn(field => field === 'priority' ? '' : 'test-value')
    };
    global.FormData = vi.fn(() => mockFormData);

    const { result } = renderHook(() => useGame(mockGame, mockFormRef));

    await act(async () => {
      await result.current.saveGame(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Missing Priority value');
  });

  it('successfully saves game data', async () => {
    const mockEvent = {
      preventDefault: vi.fn()
    };

    const mockFormData = {
      get: vi.fn(field => 'test-value')
    };
    global.FormData = vi.fn(() => mockFormData);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    const { result } = renderHook(() => useGame(mockGame, mockFormRef));

    await act(async () => {
      await result.current.saveGame(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('handles save game error', async () => {
    const mockEvent = {
      preventDefault: vi.fn()
    };

    const mockFormData = {
      get: vi.fn(field => 'test-value')
    };
    global.FormData = vi.fn(() => mockFormData);

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGame(mockGame, mockFormRef));

    await act(async () => {
      await result.current.saveGame(mockEvent);
    });

    expect(toast.error).toHaveBeenCalled();
  });

  it('adds tag when not present', () => {
    const { result } = renderHook(() => useGame(mockGame, mockFormRef));

    act(() => {
      result.current.addRemoveTag('new-tag');
    });

    expect(mockFormRef.current.querySelector).toHaveBeenCalledWith('input[name="tags"]');
  });

  it('handles keyboard shortcut for save', () => {
    const { result } = renderHook(() => useGame(mockGame, mockFormRef));

    const mockSaveButton = document.createElement('button');
    mockSaveButton.id = 'saveBtn';
    mockSaveButton.click = vi.fn();
    document.getElementById = vi.fn(() => mockSaveButton);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 's',
        altKey: true
      }));
    });

    expect(document.getElementById).toHaveBeenCalledWith('saveBtn');
  });
});