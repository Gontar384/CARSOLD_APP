import { renderHook } from '@testing-library/react';
import {SearchContext, useSearch} from "../../../GlobalProviders/Search/useSearch.ts";

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useSearch', () => {
    it('throws an error when used outside SearchProvider', () => {
        expect(() => {
            renderHook(() => useSearch(), {
                wrapper: ({ children }) => <>{children}</>,
            });
        }).toThrow('useSearch must be used within an SearchProvider');
    });

    it('returns correct values from context', () => {
        const mockContextValue = {
            phrase: 'initial phrase',
            setPhrase: jest.fn(),
            trigger: false,
            setTrigger: jest.fn(),
            clicked: true,
            setClicked: jest.fn(),
            searched: false,
            setSearched: jest.fn(),
        };

        const { result } = renderHook(() => useSearch(), {
            wrapper: ({ children }) => (
                <SearchContext.Provider value={mockContextValue}>{children}</SearchContext.Provider>
            ),
        });

        expect(result.current).toEqual(mockContextValue);
    });
});