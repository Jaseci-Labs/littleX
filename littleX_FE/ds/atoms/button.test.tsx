"use client"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"

describe("Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass("bg-primary")
  })

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-destructive")

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveClass("border-input")

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-secondary")

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).toHaveClass("hover:bg-accent")

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole("button")).toHaveClass("text-primary")
  })

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10")

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-9")

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-11")

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10 w-10")
  })

  it("handles click events", async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", async () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    )

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()

    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>,
    )

    const link = screen.getByRole("link", { name: "Link Button" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "https://example.com")
    expect(link).toHaveClass("bg-primary")
  })
})

