import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EnterpriseButton } from "@/shared/components/EnterpriseButton";
import { EnterpriseCard, EnterpriseCardHeader, EnterpriseCardFooter } from "@/shared/components/EnterpriseCard";
import { EnterpriseInput } from "@/shared/components/EnterpriseInput";
import { EnterpriseBadge } from "@/shared/components/EnterpriseBadge";
import { EnterpriseAlert } from "@/shared/components/EnterpriseAlert";
import { EnterpriseSkeleton, EnterpriseSpinner, EnterpriseProgress } from "@/shared/components/EnterpriseSkeleton";
import { EnterpriseAccordion } from "@/shared/components/EnterpriseAccordion";
import { EnterpriseTabs } from "@/shared/components/EnterpriseTabs";

describe("EnterpriseButton", () => {
  it("renders children and handles click", () => {
    const onClick = vi.fn();
    render(<EnterpriseButton onClick={onClick}>اضغط هنا</EnterpriseButton>);
    const button = screen.getByRole("button", { name: "اضغط هنا" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire click when disabled", () => {
    const onClick = vi.fn();
    render(<EnterpriseButton onClick={onClick} disabled>معطل</EnterpriseButton>);
    const button = screen.getByRole("button", { name: "معطل" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows loading text and sets aria-busy", () => {
    render(<EnterpriseButton loading loadingText="جارٍ الحفظ">حفظ</EnterpriseButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("جارٍ الحفظ")).toBeInTheDocument();
  });

  it("applies fullWidth class", () => {
    render(<EnterpriseButton fullWidth>عريض</EnterpriseButton>);
    expect(screen.getByRole("button").className).toContain("w-full");
  });
});

describe("EnterpriseCard", () => {
  it("renders children", () => {
    render(<EnterpriseCard>محتوى البطاقة</EnterpriseCard>);
    expect(screen.getByText("محتوى البطاقة")).toBeInTheDocument();
  });

  it("renders as button when clickable and fires onClick", () => {
    const onClick = vi.fn();
    render(<EnterpriseCard clickable onClick={onClick}>قابل للنقر</EnterpriseCard>);
    fireEvent.click(screen.getByRole("button", { name: "قابل للنقر" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("supports header and footer composition", () => {
    render(
      <EnterpriseCard
        header={<EnterpriseCardHeader title="العنوان" subtitle="الوصف" />}
        footer={<EnterpriseCardFooter>تذييل</EnterpriseCardFooter>}
      >
        الجسم
      </EnterpriseCard>
    );
    expect(screen.getByText("العنوان")).toBeInTheDocument();
    expect(screen.getByText("الوصف")).toBeInTheDocument();
    expect(screen.getByText("تذييل")).toBeInTheDocument();
  });
});

describe("EnterpriseInput", () => {
  it("renders label and calls onChange with string value", () => {
    const onChange = vi.fn();
    render(<EnterpriseInput label="الاسم" onChange={onChange} />);
    const input = screen.getByLabelText(/الاسم/);
    fireEvent.change(input, { target: { value: "محمد" } });
    expect(onChange).toHaveBeenCalledWith("محمد", expect.anything());
  });

  it("shows error message with alert role", () => {
    render(<EnterpriseInput label="البريد" error="بريد غير صالح" />);
    expect(screen.getByRole("alert")).toHaveTextContent("بريد غير صالح");
  });

  it("marks input invalid on error", () => {
    render(<EnterpriseInput label="الحقل" error="خطأ" />);
    expect(screen.getByLabelText(/الحقل/)).toHaveAttribute("aria-invalid", "true");
  });

  it("supports textarea type with rows", () => {
    render(<EnterpriseInput label="الرسالة" type="textarea" rows={4} />);
    const textarea = screen.getByLabelText(/الرسالة/);
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("rows", "4");
  });
});

describe("EnterpriseBadge", () => {
  it("renders text", () => {
    render(<EnterpriseBadge>جديد</EnterpriseBadge>);
    expect(screen.getByText("جديد")).toBeInTheDocument();
  });

  it("calls onRemove when removable remove clicked", () => {
    const onRemove = vi.fn();
    render(<EnterpriseBadge removable onRemove={onRemove}>وسم</EnterpriseBadge>);
    fireEvent.click(screen.getByRole("button", { name: "إزالة" }));
    expect(onRemove).toHaveBeenCalled();
  });
});

describe("EnterpriseAlert", () => {
  it("renders with role alert and content", () => {
    render(<EnterpriseAlert variant="success" title="نجاح">تم الحفظ</EnterpriseAlert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("نجاح");
    expect(alert).toHaveTextContent("تم الحفظ");
  });

  it("calls onDismiss when close clicked", () => {
    const onDismiss = vi.fn();
    render(
      <EnterpriseAlert dismissible onDismiss={onDismiss}>
        رسالة
      </EnterpriseAlert>
    );
    fireEvent.click(screen.getByRole("button", { name: "إغلاق التنبيه" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("EnterpriseSkeleton / Spinner / Progress", () => {
  it("skeleton renders multiple lines", () => {
    const { container } = render(<EnterpriseSkeleton variant="text" lines={3} />);
    expect(container.querySelectorAll(".skeleton-pulse").length).toBe(3);
  });

  it("spinner has status role", () => {
    render(<EnterpriseSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("progress exposes aria values", () => {
    render(<EnterpriseProgress value={40} showLabel />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});

describe("EnterpriseAccordion", () => {
  const items = [
    { value: "a", title: "العنصر الأول", content: <p>محتوى أ</p> },
    { value: "b", title: "العنصر الثاني", content: <p>محتوى ب</p> },
  ];

  it("expands an item on click", () => {
    render(<EnterpriseAccordion items={items} />);
    const header = screen.getByRole("button", { name: /العنصر الأول/ });
    expect(header).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("محتوى أ")).toBeInTheDocument();
  });
});

describe("EnterpriseTabs", () => {
  it("renders tabs and calls onChange", () => {
    const onChange = vi.fn();
    render(
      <EnterpriseTabs
        value="one"
        onChange={onChange}
        tabs={[
          { value: "one", label: "الأول" },
          { value: "two", label: "الثاني" },
        ]}
      />
    );
    expect(screen.getByRole("tab", { name: "الأول" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "الثاني" }));
    expect(onChange).toHaveBeenCalledWith("two");
  });
});
