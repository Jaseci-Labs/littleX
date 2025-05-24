"use client"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

describe("Select", () => {
  it("renders correctly with default props", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByTestId("select-trigger")
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent("Select an option")

    // SelectContent is not rendered until the trigger is clicked
    expect(screen.queryByText("Apple")).not.toBeInTheDocument()
  })

  it("opens the select dropdown when clicked", async () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByTestId("select-trigger")

    // Click to open the dropdown
    await userEvent.click(trigger)

    // Now the options should be visible
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("Banana")).toBeInTheDocument()
  })

  it("selects an item when clicked", async () => {
    const onValueChangeMock = jest.fn()

    render(
      <Select onValueChange={onValueChangeMock}>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )

    // Click to open the dropdown
    await userEvent.click(screen.getByTestId("select-trigger"))

    // Click on an option
    await userEvent.click(screen.getByText("Apple"))

    // Check if onValueChange was called with the correct value
    expect(onValueChangeMock).toHaveBeenCalledWith("apple")
  })

  it("renders with a default value", () => {
    render(
      <Select defaultValue="banana">
        <SelectTrigger data-testid="select-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    )

    // The trigger should show the selected value
    expect(screen.getByTestId("select-trigger")).toHaveTextContent("Banana")
  })

  it("renders as disabled when disabled prop is true", () => {
    render(
      <Select disabled>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )

    const trigger = screen.getByTestId("select-trigger")
    expect(trigger).toHaveAttribute("data-disabled")
  })

  it("applies custom className to trigger", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger-class" data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByTestId("select-trigger")).toHaveClass("custom-trigger-class")
  })
})

