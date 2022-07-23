<script lang="ts">
    import axios from "axios"
    import Input from "../components/Input.svelte"

    let disabled = true
    let password: string,
        passwordRepeat: string,
        username: string,
        email: string

    interface ValidationErrors {
        username?: string
        email?: string
        password?: string
    }

    let passwordMismatch = false

    // Reactive
    $: disabled =
        password && passwordRepeat ? password !== passwordRepeat : true

    $: passwordMismatch = password !== passwordRepeat

    $: {
        if (username) {
        }
        errors.username = ""
    }

    $: {
        if (email) {
        }
        errors.email = ""
    }

    $: {
        if (password) {
        }
        errors.password = ""
    }

    let apiProgress = false
    let signUpSuccess = false
    let errors: ValidationErrors = {}

    const submit = () => {
        apiProgress = true
        axios
            .post("/api/1.0/users", {
                username,
                email,
                password,
            })
            .then(() => {
                signUpSuccess = true
            })
            //@ts-ignore
            .catch((error) => {
                apiProgress = false
                if (error.response.status === 400) {
                    if (error.response.data.validationErrors) {
                        errors = error.response.data.validationErrors
                    }
                }
            })
    }
</script>

<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    {#if !signUpSuccess}
        <form class="card mt-5" data-testid="form-sign-up">
            <div class="card-header">
                <h1 class="text-center">Sign Up</h1>
            </div>

            <div class="card-body">
                <Input
                    id="username"
                    label="Username"
                    help={errors.username}
                    bind:value={username}
                />

                <Input
                    id="e-mail"
                    label="E-mail"
                    help={errors.email}
                    bind:value={email}
                />

                <Input
                    id="password"
                    label="Password"
                    help={errors.password}
                    bind:value={password}
                    type="password"
                />

                <Input
                    id="password-repeat"
                    label="Repeat Password"
                    help={passwordMismatch ? "Password mismatch" : ""}
                    bind:value={passwordRepeat}
                    type="password"
                />

                <div class="text-center">
                    <button
                        class="btn btn-primary"
                        disabled={disabled || apiProgress}
                        on:click|preventDefault={submit}
                    >
                        {#if apiProgress}
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                            />
                        {/if}

                        Sign Up</button
                    >
                </div>
            </div>
        </form>
    {:else}
        <div class="alert alert-success mt-3">
            Please check your e-mail to activate your account
        </div>
    {/if}
</div>
