<script lang="ts">
    import axios from "axios"
    import type { AxiosResponse } from "axios"

    let disabled = true
    let password: string,
        passwordRepeat: string,
        username: string,
        email: string

    // Reactive
    $: disabled =
        password && passwordRepeat ? password !== passwordRepeat : true

    let apiProgress: Promise<AxiosResponse<any, any>>

    let signUpSuccess = false

    const submit = () => {
        disabled = true

        apiProgress = axios.post("/api/1.0/users", {
            username,
            email,
            password,
        })

        apiProgress
            .then(() => {
                signUpSuccess = true
            })
            //@ts-ignore
            .catch((err) => {
                console.log("There was an error")
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
                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        id="username"
                        class="form-control"
                        bind:value={username} />
                </div>

                <div class="form-group">
                    <label for="e-mail">E-mail</label>
                    <input
                        id="e-mail"
                        class="form-control"
                        bind:value={email} />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        class="form-control"
                        bind:value={password} />
                </div>

                <div class="form-group">
                    <label for="password-repeat">Repeat Password</label>
                    <input
                        id="password-repeat"
                        type="password"
                        class="form-control"
                        bind:value={passwordRepeat} />
                </div>

                <div class="text-center">
                    <button
                        class="btn btn-primary"
                        {disabled}
                        on:click|preventDefault={submit}>
                        {#await apiProgress}
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status" />
                        {/await}

                        Sign Up</button>
                </div>
            </div>
        </form>
    {:else}
        <div class="alert alert-success mt-3">
            Please check your e-mail to activate your account
        </div>
    {/if}
</div>
