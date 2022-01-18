import { ThemeProvider } from "styled-components"
import Loader from "../Loader"
import { theme } from '../../../../styles/theme';
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'

const MockIcon = () => {
    return (
        <ThemeProvider theme={theme}>
            <Loader />
        </ThemeProvider>
    )
}

it('should display logo', async () => {
    render(<MockIcon />);
    const iconElement = screen.getByText(/bezbekownia/i);
    expect(iconElement).toBeInTheDocument()
})
