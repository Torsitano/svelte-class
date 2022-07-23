import SignUpPage from './SignUpPage.svelte'
import { render, screen, waitFor } from '@testing-library/svelte'
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

        let requestBody: any
        let counter = 0

        const server = setupServer(
            rest.post( '/api/1.0/users', async ( req, res, context ) => {
                requestBody = req.json()
                counter += 1
                await new Promise( ( resolve ) => setTimeout( resolve, 50 ) )

                return res( context.status( 200 ) )
            } )
        )

        beforeAll( () => server.listen() )

        beforeEach( () => {
            counter = 0
            server.resetHandlers()
        } )

        afterAll( () => server.close() )

        let button: HTMLElement, usernameInput: HTMLElement, passwordInput: HTMLElement, passwordRepeatInput: HTMLElement

        const setup = async () => {
            render( SignUpPage )
            usernameInput = screen.getByLabelText( 'Username' )
            const emailInput: HTMLInputElement = screen.getByLabelText( 'E-mail' )
            passwordInput = screen.getByLabelText( 'Password' )
            passwordRepeatInput = screen.getByLabelText( 'Repeat Password' )
            button = screen.getByRole( 'button', { name: 'Sign Up' } )

            await userEvent.type( usernameInput, 'user1' )
            await userEvent.type( emailInput, 'user1@email.com' )
            await userEvent.type( passwordInput, 'P4ssword' )
            await userEvent.type( passwordRepeatInput, 'P4ssword' )
        }


        it( 'enables the button when the password and password repeat fields have same value', async () => {
            await setup()
            expect( button ).toBeEnabled()

        } )


        it( 'sends username, email, and password to backend after clicking button', async () => {
            await setup()
            await userEvent.click( button )
            await screen.findByText( 'Please check your e-mail to activate your account' )

            expect( await requestBody ).toEqual( {
                username: 'user1',
                email: 'user1@email.com',
                password: 'P4ssword',
            } )

        } )

        it( 'disables the button when there is an ongoing api call', async () => {

            await setup()

            await userEvent.click( button )
            await userEvent.click( button )

            await screen.findByText( 'Please check your e-mail to activate your account' )

            expect( counter ).toBe( 1 )

        } )


        it( 'displays spinner while the API request is in progress', async () => {
            await setup()

            await userEvent.click( button )

            const spinner = screen.getByRole( 'status' )
            expect( spinner ).toBeInTheDocument()
        } )


        it( 'does not display spinner when there is no api quest', async () => {
            await setup()
            const spinner = screen.queryByRole( 'status' )
            expect( spinner ).not.toBeInTheDocument()
        } )


        it( 'displays account activation information after successful sign up request', async () => {
            await setup()

            await userEvent.click( button )

            const text = await screen.findByText( 'Please check your e-mail to activate your account' )
            expect( text ).toBeInTheDocument()
        } )


        it( 'does not display account activation message before sign up request', async () => {
            await setup()
            const text = screen.queryByText( 'Please check your e-mail to activate your account' )
            expect( text ).not.toBeInTheDocument()
        } )


        it( "does not display account activation information after failing sign up request", async () => {
            server.use(
                //@ts-ignore
                rest.post( "/api/1.0/users", ( req, res, ctx ) => {
                    return res( ctx.status( 400 ) )
                } )
            )

            await setup()
            await userEvent.click( button )

            const text = screen.queryByText(
                "Please check your e-mail to activate your account"
            )
            expect( text ).not.toBeInTheDocument()
        } )


        it( "hides sign up form after successful sign up request", async () => {
            await setup()

            const form = screen.getByTestId( 'form-sign-up' )
            await userEvent.click( button )

            await waitFor( () => {
                expect( form ).not.toBeInTheDocument()
            } )
        } )

        const generateValidationError = ( field: string, message: string ) => {
            //@ts-ignore
            return rest.post( "/api/1.0/users", ( req, res, ctx ) => {
                return res( ctx.status( 400 ), ctx.json( {
                    validationErrors: {
                        [ field ]: message
                    }
                } ) )
            } )
        }


        it.each`
        field | message
        ${'username'} | ${'Username cannot be null'}
        ${'email'} | ${'Email cannot be null'}
        ${'password'} | ${'Password cannot be null'}

        `( "displays $message error message for $field field", async ( { field, message }: { field: string, message: string } ) => {
            server.use( generateValidationError( field, message ) )

            await setup()
            await userEvent.click( button )

            const validationError = await screen.findByText( message )
            expect( validationError ).toBeInTheDocument()
        } )




        it( "hides spinner after response received", async () => {
            server.use( generateValidationError( 'username', 'Username cannot be null' ) )

            await setup()
            await userEvent.click( button )

            await screen.findByText(
                "Username cannot be null"
            )
            const spinner = screen.queryByRole( 'status' )
            expect( spinner ).not.toBeInTheDocument()
        } )


        it( "enables the button after response received", async () => {
            server.use( generateValidationError( 'username', 'Username cannot be null' ) )

            await setup()
            await userEvent.click( button )

            await screen.findByText(
                "Username cannot be null"
            )

            expect( button ).toBeEnabled()

        } )

        it( 'displays mismatch message for password repeat input', async () => {
            await setup()

            await userEvent.type( passwordInput, 'N3wP4ss' )
            await userEvent.type( passwordRepeatInput, 'anotherPa4s' )
            const validationError = await screen.findByText( 'Password mismatch' )
            expect( validationError ).toBeInTheDocument()
        } )

        it( 'does not display mismatch message initially', () => {
            render( SignUpPage )
            const validationError = screen.queryByText( 'Password mismatch' )
            expect( validationError ).not.toBeInTheDocument()

        } )

        interface ValidationUpdatedTestParams {
            field: string,
            message: string,
            label: string
        }

        it.each`
        field         | message                      | label
        ${'username'} | ${'Username cannot be null'} | ${'Username'}
        ${'email'}    | ${'Email cannot be null'}    | ${'E-mail'}
        ${'password'} | ${'Password cannot be null'} | ${'Password'}
        `( "clears validation error after $field field is updated", async ( { field, message, label }: ValidationUpdatedTestParams ) => {
            server.use( generateValidationError( field, message ) )

            await setup()
            await userEvent.click( button )

            const validationError = await screen.findByText( message )
            const input = screen.getByLabelText( label )
            await userEvent.type( input, 'updated' )

            expect( validationError ).not.toBeInTheDocument()

        } )

    } )
} )
