import {render, waitFor, act, fireEvent} from '@testing-library/react';
import {useUtil} from "../../GlobalProviders/Util/useUtil";
import {UtilProvider} from "../../GlobalProviders/Util/UtilProvider";
import React from "react";

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
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        expect(getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should toggle dark mode correctly', () => {
        const { getByText, getByRole } = render(
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        expect(getByText('Light Mode')).toBeInTheDocument();

        act(() => {
            getByRole('button').click();
        });

        expect(getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should update layout width states on window resize', async () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 });

        const { getByText, rerender } = render(
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        expect(getByText('Mobile: Yes')).toBeInTheDocument();
        expect(getByText('Mid: No')).toBeInTheDocument();
        expect(getByText('Big: No')).toBeInTheDocument();

        act(() => {
            Object.defineProperty(window, 'innerWidth', { writable: true, value: 600 });
            window.dispatchEvent(new Event('resize'));
        });

        rerender(
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        await waitFor(() => {
            expect(getByText('Mobile: No')).toBeInTheDocument();
            expect(getByText('Mid: Yes')).toBeInTheDocument();
            expect(getByText('Big: No')).toBeInTheDocument();
        });
    });

    it('should detect device type as mobile or PC', async () => {
        const { getByText, rerender } = render(
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        expect(getByText('PC')).toBeInTheDocument();

        act(() => {
            Object.defineProperty(window, 'ontouchstart', { value: true, writable: true });
            window.dispatchEvent(new Event('resize'));
        });

        rerender(
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        await waitFor(() => {
            expect(getByText('Mobile')).toBeInTheDocument();
        });
    });

    it('should create and update debounced value correctly', async () => {
        const { getByText, getByRole } = render(
            <UtilProvider>
                <TestComponent />
            </UtilProvider>
        );

        const input = getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Value' } });

        await waitFor(() => {
            expect(getByText('Debounced Value: New Value')).toBeInTheDocument();
        });
    });
});