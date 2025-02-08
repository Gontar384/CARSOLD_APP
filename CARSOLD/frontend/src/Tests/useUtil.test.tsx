import {renderHook} from "@testing-library/react";
import {useUtil, UtilContext} from "../GlobalProviders/Util/useUtil.ts";

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
})

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useUtil', () => {
    it('throws an error when outside UtilProvider', () => {
       expect(() => {
           renderHook(() => useUtil(), {
              wrapper: ({children}) => <>{children}</>,
           });
       }).toThrow('useUtil must be used within an UtilProvider');
    });

    it('returns correct values from context', () => {
        const mockContextValue = {
            darkMode: false,
            toggleDarkMode: jest.fn(),
            lowerBar: false,
            setLowerBar: jest.fn(),
            midBar: false,
            setMidBar: jest.fn(),
            mobileWidth: false,
            midWidth: false,
            bigWidth: true,
            CreateDebouncedValue: jest.fn(),
            isMobile: false
        };

        const { result } = renderHook(() => useUtil(), {
            wrapper: ({children}) => (
                <UtilContext.Provider value={mockContextValue}>{children}</UtilContext.Provider>
            ),
        });

        expect(result.current).toEqual(mockContextValue);
    });
});