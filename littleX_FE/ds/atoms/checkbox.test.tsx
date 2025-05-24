import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("renders correctly with default props", () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it("renders as checked when defaultChecked is true", () => {
    render(<Checkbox defaultChecked />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeChecked()
  })

  it("renders as disabled when disabled is true", () => {
    render(<Checkbox disabled />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeDisabled()
  })

  it("calls onCheckedChange when clicked", async () => {
    const onCheckedChange = jest.fn()
    render(<Checkbox onCheckedChange={onCheckedChange} />)

    await userEvent.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).toHaveBeenCalledWith(true)

    // Reset mock and click again to test toggling
    onCheckedChange.mockReset()
    await userEvent.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it("works with controlled state", async () => {
    const onCheckedChange = jest.fn()
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()

    await userEvent.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)

    // Simulate parent component updating the state
    rerender(<Checkbox checked={true} onCheckedChange={onCheckedChange} />)
    expect(checkbox).toBeChecked()
  })

  it("applies custom className", () => {
    render(<Checkbox className="custom-class" />)
    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveClass("custom-class")
  })

  it("works with a label using htmlFor", async () => {
    render(
      <>
        <Checkbox id="test-checkbox" />
        <label htmlFor="test-checkbox">Test Label</label>
      </>,
    )

    const checkbox = screen.getByRole("checkbox")
    const label = screen.getByText("Test Label")

    expect(checkbox).toBeInTheDocument()
    expect(label).toBeInTheDocument()

    // Click on the label should check the checkbox
    await userEvent.click(label)
    expect(checkbox).toBeChecked()
  })
})

