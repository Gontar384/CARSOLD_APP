import { render, renderHook, act } from '@testing-library/react';
import {useSearch} from "../../../GlobalProviders/Search/useSearch.ts";
import {SearchProvider} from "../../../GlobalProviders/Search/SearchProvider.tsx";

describe('SearchProvider', () => {
    it('provides the correct initial values', () => {
        const { result } = renderHook(() => useSearch(), {
            wrapper: ({ children }) => <SearchProvider>{children}</SearchProvider>,
        });

        expect(result.current.phrase).toBe("");
        expect(result.current.trigger).toBe(false);
        expect(result.current.clicked).toBe(false);
        expect(result.current.searched).toBe(false);
        expect(typeof result.current.setPhrase).toBe('function');
        expect(typeof result.current.setTrigger).toBe('function');
        expect(typeof result.current.setClicked).toBe('function');
        expect(typeof result.current.setSearched).toBe('function');
    });

    it('updates phrase state correctly', () => {
        const { result } = renderHook(() => useSearch(), {
            wrapper: ({ children }) => <SearchProvider>{children}</SearchProvider>,
        });

        act(() => {
            result.current.setPhrase('new search term');
        });

        expect(result.current.phrase).toBe('new search term');
    });

    it('updates trigger state correctly', () => {
        const { result } = renderHook(() => useSearch(), {
            wrapper: ({ children }) => <SearchProvider>{children}</SearchProvider>,
        });

        act(() => {
            result.current.setTrigger(true);
        });

        expect(result.current.trigger).toBe(true);

        act(() => {
            result.current.setTrigger(false);
        });

        expect(result.current.trigger).toBe(false);
    });

    it('updates clicked state correctly', () => {
        const { result } = renderHook(() => useSearch(), {
            wrapper: ({ children }) => <SearchProvider>{children}</SearchProvider>,
        });

        act(() => {
            result.current.setClicked(true);
        });

        expect(result.current.clicked).toBe(true);

        act(() => {
            result.current.setClicked(false);
        });

        expect(result.current.clicked).toBe(false);
    });

    it('updates searched state correctly', () => {
        const { result } = renderHook(() => useSearch(), {
            wrapper: ({ children }) => <SearchProvider>{children}</SearchProvider>,
        });

        act(() => {
            result.current.setSearched(true);
        });

        expect(result.current.searched).toBe(true);

        act(() => {
            result.current.setSearched(false);
        });

        expect(result.current.searched).toBe(false);
    });

    it('provides the context values to its children', () => {
        const TestConsumer = () => {
            const searchContext = useSearch();
            return (
                <div>
                    <div data-testid="phrase">{searchContext.phrase}</div>
                    <div data-testid="trigger">{String(searchContext.trigger)}</div>
                    <div data-testid="clicked">{String(searchContext.clicked)}</div>
                    <div data-testid="searched">{String(searchContext.searched)}</div>
                    <button onClick={() => searchContext.setPhrase('test phrase')}>Set Phrase</button>
                    <button onClick={() => searchContext.setTrigger(true)}>Set Trigger</button>
                    <button onClick={() => searchContext.setClicked(true)}>Set Clicked</button>
                    <button onClick={() => searchContext.setSearched(true)}>Set Searched</button>
                </div>
            );
        };

        const { getByTestId, getByText } = render(
            <SearchProvider>
                <TestConsumer />
            </SearchProvider>
        );

        expect(getByTestId('phrase').textContent).toBe('');
        expect(getByTestId('trigger').textContent).toBe('false');
        expect(getByTestId('clicked').textContent).toBe('false');
        expect(getByTestId('searched').textContent).toBe('false');

        act(() => {
            getByText('Set Phrase').click();
        });
        expect(getByTestId('phrase').textContent).toBe('test phrase');

        act(() => {
            getByText('Set Trigger').click();
        });
        expect(getByTestId('trigger').textContent).toBe('true');

        act(() => {
            getByText('Set Clicked').click();
        });
        expect(getByTestId('clicked').textContent).toBe('true');

        act(() => {
            getByText('Set Searched').click();
        });
        expect(getByTestId('searched').textContent).toBe('true');
    });
});