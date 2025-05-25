import {render, screen, fireEvent, renderHook} from "@testing-library/react";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";
import {LanguageProvider} from "../../../GlobalProviders/Language/LanguageProvider.tsx";
import React from "react";

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const Consumer = () => {
    const { language, changeLanguage, t, translate } = useLanguage();
    return (
        <div>
            <div data-testid="lang">{language}</div>
            <div data-testid="t">{t("mobileButton4")}</div>
            <div data-testid="translate">{translate("fuel", language === "POL" ? "Petrol" : "Benzyna")}</div>
            <button onClick={() => changeLanguage(language === "POL" ? "ENG" : "POL")}>Toggle Language</button>
        </div>
    );
};

describe("LanguageProvider", () => {
    it("should have default language as POL and correct translations", () => {
        render(
            <LanguageProvider>
                <Consumer />
            </LanguageProvider>
        );

        expect(screen.getByTestId("lang").textContent).toBe("POL");
        expect(screen.getByTestId("t").textContent).toBe("Konto"); // mobileButton4 in POL
        expect(screen.getByTestId("translate").textContent).toBe("Benzyna"); // fuel.Petrol in POL
    });

    it("should change language and update translations accordingly", () => {
        render(
            <LanguageProvider>
                <Consumer />
            </LanguageProvider>
        );

        expect(screen.getByTestId("lang").textContent).toBe("POL");
        expect(screen.getByTestId("t").textContent).toBe("Konto");
        expect(screen.getByTestId("translate").textContent).toBe("Benzyna");

        fireEvent.click(screen.getByText("Toggle Language"));

        expect(screen.getByTestId("lang").textContent).toBe("ENG");
        expect(screen.getByTestId("t").textContent).toBe("Account");
        expect(screen.getByTestId("translate").textContent).toBe("Petrol");
    });

    it("should initialize language from localStorage", () => {
        localStorage.setItem("app_language", "ENG");

        render(
            <LanguageProvider>
                <Consumer />
            </LanguageProvider>
        );

        expect(screen.getByTestId("lang").textContent).toBe("ENG");
        expect(screen.getByTestId("t").textContent).toBe("Account");
        expect(screen.getByTestId("translate").textContent).toBe("Petrol");
    });

    it("throws an error when used outside of LanguageProvider", () => {
        expect(() => renderHook(() => useLanguage())).toThrow("useLanguage must be used within an LanguageProvider");
    });

    it("should return context value when used inside LanguageProvider", () => {
        const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
            <LanguageProvider>{children}</LanguageProvider>
        );

        const { result } = renderHook(() => useLanguage(), { wrapper });

        expect(result.current.language).toBeDefined();
        expect(typeof result.current.changeLanguage).toBe("function");
        expect(typeof result.current.t).toBe("function");
        expect(typeof result.current.translate).toBe("function");
        expect(typeof result.current.translateForBackend).toBe("function");
    });
});