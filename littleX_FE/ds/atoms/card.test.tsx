import { render, screen } from "@testing-library/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

describe("Card Components", () => {
  it("renders Card correctly", () => {
    render(<Card data-testid="card">Card Content</Card>)
    const card = screen.getByTestId("card")
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass("rounded-lg border bg-card")
    expect(card).toHaveTextContent("Card Content")
  })

  it("renders CardHeader correctly", () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>)
    const header = screen.getByTestId("card-header")
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass("flex flex-col space-y-1.5 p-6")
    expect(header).toHaveTextContent("Header Content")
  })

  it("renders CardTitle correctly", () => {
    render(<CardTitle data-testid="card-title">Title Content</CardTitle>)
    const title = screen.getByTestId("card-title")
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass("text-2xl font-semibold")
    expect(title).toHaveTextContent("Title Content")
  })

  it("renders CardDescription correctly", () => {
    render(<CardDescription data-testid="card-description">Description Content</CardDescription>)
    const description = screen.getByTestId("card-description")
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass("text-sm text-muted-foreground")
    expect(description).toHaveTextContent("Description Content")
  })

  it("renders CardContent correctly", () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    const content = screen.getByTestId("card-content")
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass("p-6 pt-0")
    expect(content).toHaveTextContent("Content")
  })

  it("renders CardFooter correctly", () => {
    render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>)
    const footer = screen.getByTestId("card-footer")
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass("flex items-center p-6 pt-0")
    expect(footer).toHaveTextContent("Footer Content")
  })

  it("renders a complete card with all components", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card Description")).toBeInTheDocument()
    expect(screen.getByText("Card Content")).toBeInTheDocument()
    expect(screen.getByText("Card Footer")).toBeInTheDocument()
  })

  it("applies custom className to all components", () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
          <CardDescription className="custom-description">Description</CardDescription>
        </CardHeader>
        <CardContent className="custom-content">Content</CardContent>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByText("Title").parentElement?.parentElement).toHaveClass("custom-card")
    expect(screen.getByText("Title").parentElement).toHaveClass("custom-header")
    expect(screen.getByText("Title")).toHaveClass("custom-title")
    expect(screen.getByText("Description")).toHaveClass("custom-description")
    expect(screen.getByText("Content")).toHaveClass("custom-content")
    expect(screen.getByText("Footer")).toHaveClass("custom-footer")
  })
})

