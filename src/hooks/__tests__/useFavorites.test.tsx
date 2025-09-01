import { renderHook, act } from '@testing-library/react'
import { useFavorites } from '../useFavorites'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useFavorites', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  it('loads favorites from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('["item1","item2"]')
    
    const { result } = renderHook(() => useFavorites())
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('camino-favorites')
    expect(result.current.favorites).toEqual(['item1', 'item2'])
    expect(result.current.favoritesCount).toBe(2)
  })

  it('adds item to favorites', () => {
    localStorageMock.getItem.mockReturnValue('[]')
    
    const { result } = renderHook(() => useFavorites())
    
    act(() => {
      result.current.addToFavorites('item1')
    })
    
    expect(result.current.favorites).toContain('item1')
    expect(result.current.isFavorite('item1')).toBe(true)
  })

  it('removes item from favorites', () => {
    localStorageMock.getItem.mockReturnValue('["item1","item2"]')
    
    const { result } = renderHook(() => useFavorites())
    
    act(() => {
      result.current.removeFromFavorites('item1')
    })
    
    expect(result.current.favorites).not.toContain('item1')
    expect(result.current.isFavorite('item1')).toBe(false)
  })

  it('toggles favorites correctly', () => {
    localStorageMock.getItem.mockReturnValue('["item1"]')
    
    const { result } = renderHook(() => useFavorites())
    
    // Remove existing favorite
    act(() => {
      result.current.toggleFavorite('item1')
    })
    expect(result.current.isFavorite('item1')).toBe(false)
    
    // Add new favorite
    act(() => {
      result.current.toggleFavorite('item2')
    })
    expect(result.current.isFavorite('item2')).toBe(true)
  })
})