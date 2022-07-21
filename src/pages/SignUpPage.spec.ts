import SignUpPage from './SignUpPage.svelte'
import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { rest } from 'msw'


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

        const setup = async () => {
            render( SignUpPage )
            const usernameInput: HTMLInputElement = screen.getByLabelText( 'Username' )
            const emailInput: HTMLInputElement = screen.getByLabelText( 'E-mail' )
            const passwordInput: HTMLInputElement = screen.getByLabelText( 'Password' )
            const passwordRepeatInput: HTMLInputElement = screen.getByLabelText( 'Repeat Password' )

            await userEvent.type( usernameInput, 'user1' )
            await userEvent.type( emailInput, 'user1@email.com' )
            await userEvent.type( passwordInput, 'P4ssword' )
            await userEvent.type( passwordRepeatInput, 'P4ssword' )
        }


        it( 'enables the button when the password and password repeat fields have same value', async () => {
            await setup()

            const button = screen.getByRole( 'button', { name: 'Sign Up' } )
            expect( button ).toBeEnabled()

        } )



        it( 'sends username, email, and password to backend after clicking button', async () => {
            let requestBody: any

            const server = setupServer(
                rest.post( '/api/1.0/users', async ( req, res, context ) => {
                    requestBody = req.json()
                    return res( context.status( 200 ) )
                } )
            )

            server.listen()

            await setup()

            const button = screen.getByRole( 'button', { name: 'Sign Up' } )
            await userEvent.click( button )
            await server.close()

            expect( await requestBody ).toEqual( {
                username: 'user1',
                email: 'user1@email.com',
                password: 'P4ssword',
            } )

        } )

        it( 'disables the button when there is an ongoing api call', async () => {
            let counter = 0

            const server = setupServer(
                //@ts-ignore
                rest.post( '/api/1.0/users', async ( req, res, context ) => {
                    counter += 1
                    return res( context.status( 200 ) )
                } )
            )

            server.listen()

            await setup()


            const button = screen.getByRole( 'button', { name: 'Sign Up' } )
            await userEvent.click( button )
            await userEvent.click( button )

            await server.close()

            expect( counter ).toBe( 1 )

        } )

        it( 'displays spinner while the API request is in progress', async () => {

            const server = setupServer(
                //@ts-ignore
                rest.post( '/api/1.0/users', async ( req, res, context ) => {
                    return res( context.status( 200 ) )
                } )
            )

            server.listen()
            await setup()

            const button = screen.getByRole( 'button', { name: 'Sign Up' } )
            await userEvent.click( button )
            const spinner = screen.getByRole( 'status' )
            expect( spinner ).toBeInTheDocument()
        } )


        it( 'does not display spinner when there is no api quest', async () => {
            await setup()
            const spinner = screen.queryByRole( 'status' )
            expect( spinner ).not.toBeInTheDocument()
        } )


    } )


} )
