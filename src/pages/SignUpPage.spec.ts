import SignUpPage from './SignUpPage.svelte'
import { render, screen } from '@testing-library/svelte'
import '@testing-library/jest-dom'


it( 'has Sign Up Header', () => {
    render( SignUpPage )
    const header = screen.getByRole( 'heading', { name: 'Sign Up' } )
    expect( header ).toBeInTheDocument()
} )