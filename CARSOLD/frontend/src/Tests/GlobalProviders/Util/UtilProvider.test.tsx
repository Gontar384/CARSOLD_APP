import {render, waitFor, act, fireEvent, renderHook} from '@testing-library/react';
import {useUtil, UtilContext} from "../../../GlobalProviders/Util/useUtil.ts";
import {UtilProvider} from "../../../GlobalProviders/Util/UtilProvider.tsx";
import React from "react";
import {MemoryRouter} from "react-router-dom";

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const TestComponent = () => {
    const { darkMode, toggleDarkMode, mobileWidth, midWidth, bigWidth, isMobile, CreateDebouncedValue } = useUtil();
    const [inputValue, setInputValue] = React.useState('');
    const debouncedValue = CreateDebouncedValue(inputValue, 300);

    return (
        <div>
            <p>{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
            <button onClick={toggleDarkMode}>Toggle Dark Mode</button>

            <p>Mobile: {mobileWidth ? 'Yes' : 'No'}</p>
            <p>Mid: {midWidth ? 'Yes' : 'No'}</p>
            <p>Big: {bigWidth ? 'Yes' : 'No'}</p>

            <div>{isMobile ? 'Mobile' : 'PC'}</div>

            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>

            <p>Debounced Value: {debouncedValue}</p>
        </div>
    );
};

describe('UtilProvider', () => {
    it('should initialize dark mode based on localStorage', () => {
        localStorage.setItem('theme', 'dark');

        const { getByText } = render(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        expect(getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should toggle dark mode correctly', () => {
        const { getByText, getByRole } = render(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        expect(getByText('Light Mode')).toBeInTheDocument();

        act(() => {
            getByRole('button').click();
        });

        expect(getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should disable dark mode correctly', () => {
        localStorage.setItem('theme', 'dark');

        const { getByText, getByRole } = render(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        expect(getByText('Dark Mode')).toBeInTheDocument();

        act(() => {
            getByRole('button').click();
        });

        expect(getByText('Light Mode')).toBeInTheDocument();
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should update layout width states on window resize', async () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 });

        const { getByText, rerender } = render(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        expect(getByText('Mobile: Yes')).toBeInTheDocument();
        expect(getByText('Mid: No')).toBeInTheDocument();
        expect(getByText('Big: No')).toBeInTheDocument();

        act(() => {
            Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 });
            window.dispatchEvent(new Event('resize'));
        });

        rerender(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText('Mobile: No')).toBeInTheDocument();
            expect(getByText('Mid: Yes')).toBeInTheDocument();
            expect(getByText('Big: No')).toBeInTheDocument();
        });
    });

    it('should detect device type as mobile or PC', async () => {
        const { getByText } = render(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        expect(getByText('PC')).toBeInTheDocument();
    });

    it('should create and update debounced value correctly', async () => {
        const { getByText, getByRole } = render(
            <MemoryRouter>
                <UtilProvider>
                    <TestComponent />
                </UtilProvider>
            </MemoryRouter>
        );

        const input = getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Value' } });

        await waitFor(() => {
            expect(getByText('Debounced Value: New Value')).toBeInTheDocument();
        });
    });

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
            disableDarkMode: jest.fn(),
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