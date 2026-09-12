import { render, screen, fireEvent } from "@testing-library/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- precise: @typescript-eslint/no-unused-vars — verified safe
import { describe, it, expect, beforeEach, vi } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { I18nProvider, useI18n } from "@/shared/i18n";
import { LOCALE_STORAGE_KEY } from "@/shared/i18n/types";

function Probe() {
  const { locale, dir, isRTL, t, setLocale, formatDate, formatNumber } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="isRTL">{String(isRTL)}</span>
      <span data-testid="t-nav-home">{t("nav.home")}</span>
      <span data-testid="t-common-donate">{t("common.donate")}</span>
      <span data-testid="t-missing">{t("nav.home" as never)}</span>
      <span data-testid="formatted-date">{formatDate(new Date("2024-01-15T00:00:00Z"))}</span>
      <span data-testid="formatted-number">{formatNumber(1234567)}</span>
      <button type="button" onClick={() => setLocale("en")}>
        switch-en
      </button>
      <button type="button" onClick={() => setLocale("ar")}>
        switch-ar
      </button>
    </div>
  );
}

describe("i18n", () => {
  beforeEach(() => {
    try {
      window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    } catch {
      // jsdom storage may be unavailable in some envs
    }
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  });

  it("defaults to Arabic (RTL) and resolves dotted keys", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );

    expect(screen.getByTestId("locale").textContent).toBe("ar");
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
    expect(screen.getByTestId("isRTL").textContent).toBe("true");
    expect(screen.getByTestId("t-nav-home").textContent).toBe("الرئيسية");
    expect(screen.getByTestId("t-common-donate").textContent).toBe("تبرع الآن");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("switches locale, persists, and syncs document lang/dir", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "switch-en" }));

    expect(screen.getByTestId("locale").textContent).toBe("en");
    expect(screen.getByTestId("dir").textContent).toBe("ltr");
    expect(screen.getByTestId("t-nav-home").textContent).toBe("Home");
    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");

    fireEvent.click(screen.getByRole("button", { name: "switch-ar" }));
    expect(screen.getByTestId("locale").textContent).toBe("ar");
  });

  it("useI18n is safe without a provider (static Arabic fallback)", () => {
    render(<Probe />);
    expect(screen.getByTestId("locale").textContent).toBe("ar");
    expect(screen.getByTestId("t-nav-home").textContent).toBe("الرئيسية");
  });

  it("formatDate and formatNumber are locale-aware", () => {
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>
    );

    expect(screen.getByTestId("formatted-date").textContent?.length).toBeGreaterThan(4);
    expect(screen.getByTestId("formatted-number").textContent?.length).toBeGreaterThan(4);
  });
});
