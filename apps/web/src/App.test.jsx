import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import { describe, it, expect } from "vitest";

describe('App Component', () => {
  it('renders heading text and handles interactions', async () => {
    // 1. Arrange
    render(<App />);
    const user = userEvent.setup();

    // 2. Act & Assert
    // Assuming your Vite app has a counter button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    await user.click(button);
    expect(button).toHaveTextContent(/count is 1/i);
  });
});