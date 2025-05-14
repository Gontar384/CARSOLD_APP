// import { renderHook } from '@testing-library/react';
// import {UserUtilContext, useUserUtil} from "../../../GlobalProviders/UserUtil/useUserUtil.ts";
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
// describe('useUserUtil', () => {
//     it('throws an error when used outside UserUtilProvider', () => {
//         expect(() => {
//             renderHook(() => useUserUtil(), {
//                 wrapper: ({ children }) => <>{children}</>,
//             });
//         }).toThrow('useUserUtil must be used within an UserUtilProvider');
//     });
//
//     it('returns correct values from context', () => {
//         const mockContextValue = {
//             username: 'testuser',
//             profilePic: 'testpic.jpg',
//             usernameFetched: true,
//             profilePicFetched: false,
//             setProfilePicChanged: jest.fn(),
//         };
//
//         const { result } = renderHook(() => useUserUtil(), {
//             wrapper: ({ children }) => (
//                 <UserUtilContext.Provider value={mockContextValue}>{children}</UserUtilContext.Provider>
//             ),
//         });
//
//         expect(result.current).toEqual(mockContextValue);
//     });
// });