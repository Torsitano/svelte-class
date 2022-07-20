import SignUpPage from './SignUpPage.svelte'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import axios from 'axios'

describe( 'Sign Up Page', () => {
    describe( 'Layout', () => {
        it( 'has Sign Up Header', () => {
            render( SignUpPage )
            const header = screen.getByRole( 'heading', { name: 'Sign Up' } )
            expect( header ).toBeInTheDocument()
        } )

        it( 'has username input', () => {
            render( SignUpPage )
            const input: HTMLInputElement = screen.getByLabelText( 'Username' )
            expect( input ).toBeInTheDocument()
        } )

        it( 'has email input', () => {
            render( SignUpPage )
            const input: HTMLInputElement = screen.getByLabelText( 'E-mail' )
            expect( input ).toBeInTheDocument()
        } )

        it( 'has password input', () => {
            render( SignUpPage )
            const input: HTMLInputElement = screen.getByLabelText( 'Password' )
            expect( input ).toBeInTheDocument()
        } )

        it( 'has password type for password input', () => {
            render( SignUpPage )
            const input: HTMLInputElement = screen.getByLabelText( 'Password' )
            expect( input.type ).toBe( 'password' )
        } )

        it( 'has password repeat input', () => {
            render( SignUpPage )
            const input: HTMLInputElement = screen.getByLabelText( 'Repeat Password' )
            expect( input ).toBeInTheDocument()
        } )

        it( 'has password type for password repeat input', () => {
            render( SignUpPage )
            const input: HTMLInputElement = screen.getByLabelText( 'Repeat Password' )
            expect( input.type ).toBe( 'password' )
        } )

        it( 'has Sign Up button', () => {
            render( SignUpPage )
            const header = screen.getByRole( 'button', { name: 'Sign Up' } )
            expect( header ).toBeInTheDocument()
        } )

        it( 'has Sign Up button disabled', () => {
            render( SignUpPage )
            const button = screen.getByRole( 'button', { name: 'Sign Up' } )
            expect( button ).toBeDisabled()
        } )
    } )

    describe( 'Interactions', () => {
        it( 'enables the button when the password and password repeat fields have same value', async () => {
            render( SignUpPage )
            const passwordInput: HTMLInputElement = screen.getByLabelText( 'Password' )
            const passwordRepeatInput: HTMLInputElement = screen.getByLabelText( 'Repeat Password' )

            await userEvent.type( passwordInput, 'P4ssword' )
            await userEvent.type( passwordRepeatInput, 'P4ssword' )
            const button = screen.getByRole( 'button', { name: 'Sign Up' } )
            expect( button ).toBeEnabled()

        } )

        it( 'sends username, email, and password to backend after clicking button', async () => {
            render( SignUpPage )
            const usernameInput: HTMLInputElement = screen.getByLabelText( 'Username' )
            const emailInput: HTMLInputElement = screen.getByLabelText( 'E-mail' )
            const passwordInput: HTMLInputElement = screen.getByLabelText( 'Password' )
            const passwordRepeatInput: HTMLInputElement = screen.getByLabelText( 'Repeat Password' )

            await userEvent.type( usernameInput, 'user1' )
            await userEvent.type( emailInput, 'user1@email.com' )
            await userEvent.type( passwordInput, 'P4ssword' )
            await userEvent.type( passwordRepeatInput, 'P4ssword' )
            const button = screen.getByRole( 'button', { name: 'Sign Up' } )

            const mockFn = jest.fn()
            axios.post = mockFn

            await userEvent.click( button )
            const firstCall = mockFn.mock.calls[ 0 ]

            const body = firstCall[ 1 ]
            expect( body ).toEqual( {
                username: 'user1',
                email: 'user1@email.com',
                password: 'P4ssword'
            } )

        } )
    } )


} )
