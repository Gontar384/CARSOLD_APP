import {renderHook} from "@testing-library/react";
import {ItemsContext, useItems} from "../useItems.ts";

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useItems', () => {
    it('throws an error when used outside ItemsProvider', () => {
        expect(() => {
            renderHook(() => useItems(), {
                wrapper: ({children}) => <>{children}</>,
            });
        }).toThrow('useItems must be used within an ItemsProvider');
    });

    it('returns correct values from context', () => {
        const mockContextValue = {
            messages: 3,
            setMessages: jest.fn(),
            followed: 5,
            setFollowed: jest.fn(),
            profilePicChange: false,
            setProfilePicChange: jest.fn()
        };

        const { result } = renderHook(() => useItems(), {
            wrapper: ({children}) => (
                <ItemsContext.Provider value={mockContextValue}>{children}</ItemsContext.Provider>
            ),
        });

        expect(result.current).toEqual(mockContextValue);
    });
});