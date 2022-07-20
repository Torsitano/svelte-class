<script lang="ts">
    let disabled = true
    let password: string
    let passwordRepeat: string

    const onChangePassword = (event: any) => {
        password = event.target.value
        refreshDisabled()
    }

    const onChangePasswordRepeat = (event: any) => {
        passwordRepeat = event.target.value
        refreshDisabled()
    }

    const refreshDisabled = () => {
        disabled = password === passwordRepeat
    }
</script>

<h1>Sign Up</h1>
<label for="username">Username</label>
<input id="username" />

<label for="e-mail">E-mail</label>
<input id="e-mail" />

<label for="password">Password</label>
<input id="password" type="password" on:input={onChangePassword} />

<label for="password-repeat">Repeat Password</label>
<input id="password-repeat" type="password" on:input={onChangePasswordRepeat} />

<button {disabled}>Sign Up</button>
