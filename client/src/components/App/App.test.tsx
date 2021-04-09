
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './index';

test('app renders `Home`', () => {
    render(<App />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
});

