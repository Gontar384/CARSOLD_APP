    export default {
        preset: 'ts-jest',
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
        moduleNameMapper: {
            "\\.(css|scss|less)$": "identity-obj-proxy",
            "\\.(svg|png|jpg|jpeg|gif)$": "<rootDir>/fileMock.js",
            "@/(.*)": "<rootDir>/src/$1"
        },
        transform: {
            "^.+\\.tsx?$": ["ts-jest", { useESM: true }]
        },
        testTimeout: 10000,
    };