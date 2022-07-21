<script lang="ts">
    import axios from "axios"
    let disabled = true
    let password: string,
        passwordRepeat: string,
        username: string,
        email: string

    // Reactive
    $: disabled =
        password && passwordRepeat ? password !== passwordRepeat : true

    const submit = async () => {
        axios.post("/api/1.0/users", {
            username,
            email,
            password,
        })
    }
</script>

<h1>Sign Up</h1>

<form>
    <label for="username">Username</label>
    <input id="username" bind:value={username} />

    <label for="e-mail">E-mail</label>
    <input id="e-mail" bind:value={email} />

    <label for="password">Password</label>
    <input id="password" type="password" bind:value={password} />

    <label for="password-repeat">Repeat Password</label>
    <input id="password-repeat" type="password" bind:value={passwordRepeat} />

    <button {disabled} on:click|preventDefault={submit}>Sign Up</button>
</form>
