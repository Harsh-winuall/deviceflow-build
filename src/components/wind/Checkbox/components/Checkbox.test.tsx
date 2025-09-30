import { render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox Testing", () => {
  const labelText = "CheckBox-test";

  it("Checkbox Button Render Successfully ", () => {
    render(<Checkbox value={1} label={labelText} />);
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  it("Checked Checkbox", () => {
    const { getByRole } = render(
      <Checkbox value={1} checked={true} label={labelText} />
    );
    expect(getByRole("checkbox", { hidden: true })).toBeChecked();
  });

  it("Disabled Checkbox", () => {
    const { getByRole } = render(
      <Checkbox value={1} disabled={true} label={labelText} />
    );
    expect(getByRole("checkbox", { hidden: true })).toBeDisabled();
  });

  it("Disabled and Checked", () => {
    const { getByRole } = render(
      <Checkbox value={1} checked={true} disabled={true} label={labelText} />
    );
    expect(getByRole("checkbox", { hidden: true })).toBeDisabled();
    expect(getByRole("checkbox", { hidden: true })).toBeChecked();
  });
});
