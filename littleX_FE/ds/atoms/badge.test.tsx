import { render, screen } from "@testing-library/react"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders correctly with default props", () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText("Default Badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-primary")
  })

  it("renders with different variants", () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText("Default")).toHaveClass("bg-primary")

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText("Secondary")).toHaveClass("bg-secondary")

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText("Destructive")).toHaveClass("bg-destructive")

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText("Outline")).toHaveClass("text-foreground")
  })

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    expect(screen.getByText("Custom Badge")).toHaveClass("custom-class")
  })

  it("passes additional props to the element", () => {
    render(<Badge data-testid="test-badge">Test Badge</Badge>)
    expect(screen.getByTestId("test-badge")).toBeInTheDocument()
  })

  it("renders with custom styles for task priorities", () => {
    render(
      <Badge variant="outline" className="bg-green-100 text-green-800">
        low
      </Badge>,
    )
    const badge = screen.getByText("low")
    expect(badge).toHaveClass("bg-green-100")
    expect(badge).toHaveClass("text-green-800")
  })
})

