// import { renderHook } from '@testing-library/react';
// import { AuthContext, useAuth } from "../../../GlobalProviders/Auth/useAuth.ts";
//
// beforeEach(() => {
//     jest.clearAllMocks();
//     jest.spyOn(console, 'error').mockImplementation(() => {});
// });
//
// afterEach(() => {
//     jest.restoreAllMocks();
// });
//
// describe('useAuth', () => {
//     it('throws an error when used outside AuthProvider', () => {
//         expect(() => {
//             renderHook(() => useAuth(), {
//                 wrapper: ({ children }) => <>{children}</>,
//             });
//         }).toThrow('useAuth must be used within an AuthProvider');
//     });
//
//     it('returns correct values from context', () => {
//         const mockContextValue = {
//             isAuthenticated: true,
//             handleCheckAuth: jest.fn(),
//             handleLogout: jest.fn(),
//             loadingAuth: false,
//             preventFetch: false,
//         };
//
//         const { result } = renderHook(() => useAuth(), {
//             wrapper: ({ children }) => (
//                 <AuthContext.Provider value={mockContextValue}>{children}</AuthContext.Provider>
//             ),
//         });
//
//         expect(result.current).toEqual(mockContextValue);
//     });
// });