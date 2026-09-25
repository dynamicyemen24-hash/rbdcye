import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { Footer } from "@/app/components/Footer";
import { I18nProvider } from "@/shared/i18n";
import { subscribersApi } from "@/shared/services/api.service";

vi.mock("@/shared/services/api.service", () => ({
  subscribersApi: {
    subscribe: vi.fn(),
  },
}));

describe("Footer Component", () => {
  const setCurrentPage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  const renderFooter = () =>
    render(
      <I18nProvider>
        <Footer setCurrentPage={setCurrentPage} />
      </I18nProvider>
    );

  it("renders official brand identity, logo, and license 482", () => {
    renderFooter();

    expect(screen.getByAltText("رحماء بينهم")).toBeInTheDocument();
    expect(screen.getByText("رحماء بينهم")).toBeInTheDocument();
    expect(screen.getAllByText(/ترخيص رقم ٤٨٢/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/عمل إنساني موثوق وشفاف/)).toBeInTheDocument();
  });

  it("renders direct contact channels (phone, email, location)", () => {
    renderFooter();

    expect(screen.getByText("+967 780 777 007")).toBeInTheDocument();
    expect(screen.getByText("info@rbdcye.org")).toBeInTheDocument();
    expect(screen.getByText("صنعاء، اليمن")).toBeInTheDocument();

    const phoneLink = screen.getByRole("link", { name: /\+967 780 777 007/i });
    expect(phoneLink).toHaveAttribute("href", "tel:+967780777007");

    const emailLink = screen.getByRole("link", { name: /info@rbdcye\.org/i });
    expect(emailLink).toHaveAttribute("href", "mailto:info@rbdcye.org");
  });

  it("renders verified navigation links and calls setCurrentPage on click", () => {
    renderFooter();

    const aboutBtn = screen.getByRole("button", { name: "من نحن" });
    fireEvent.click(aboutBtn);
    expect(setCurrentPage).toHaveBeenCalledWith("about");

    const donateBtn = screen.getByRole("button", { name: "تبرع الآن" });
    fireEvent.click(donateBtn);
    expect(setCurrentPage).toHaveBeenCalledWith("donate");

    const governanceButtons = screen.getAllByRole("button", { name: "حوكمة العمل" });
    expect(governanceButtons.length).toBeGreaterThan(0);
    fireEvent.click(governanceButtons[0]);
    expect(setCurrentPage).toHaveBeenCalledWith("transparency");
  });

  it("submits newsletter form successfully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (subscribersApi.subscribe as any).mockResolvedValueOnce({ ok: true });

    renderFooter();

    const input = screen.getByPlaceholderText("بريدك الإلكتروني");
    fireEvent.change(input, { target: { value: "donor@example.com" } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    expect(subscribersApi.subscribe).toHaveBeenCalledWith(
      expect.objectContaining({ email: "donor@example.com", country: "YE" })
    );

    await waitFor(() => {
      expect(screen.getByText("تم الاشتراك بنجاح!")).toBeInTheDocument();
    });
  });

  it("handles newsletter submission error gracefully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (subscribersApi.subscribe as any).mockRejectedValueOnce(new Error("Network error"));

    renderFooter();

    const input = screen.getByPlaceholderText("بريدك الإلكتروني");
    fireEvent.change(input, { target: { value: "fail@example.com" } });

    const form = input.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("حدث خطأ، حاول مرة أخرى")).toBeInTheDocument();
    });
  });

  it("navigates to privacy and terms policies", () => {
    renderFooter();

    const privacyBtn = screen.getByRole("button", { name: "سياسة الخصوصية" });
    fireEvent.click(privacyBtn);
    expect(setCurrentPage).toHaveBeenCalledWith("privacy-policy");

    const termsBtn = screen.getByRole("button", { name: "الشروط والأحكام" });
    fireEvent.click(termsBtn);
    expect(setCurrentPage).toHaveBeenCalledWith("privacy-policy");
  });

  it("triggers smooth scroll to top when back-to-top button is clicked", () => {
    renderFooter();

    const topBtn = screen.getByRole("button", { name: "العودة إلى أعلى الصفحة" });
    fireEvent.click(topBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
