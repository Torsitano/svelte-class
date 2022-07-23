<script lang="ts">
    import { onMount } from "svelte"

    export let label: string = "",
        id: string = "",
        value: string = "",
        help: string | undefined,
        type: string = "text"

    let inputElement: HTMLInputElement

    onMount(() => {
        inputElement.type = type
    })
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <input
        bind:this={inputElement}
        {id}
        class="form-control"
        class:is-invalid={help}
        bind:value
    />
    {#if help}
        <span class="invalid-feedback" role="alert">{help}</span>
    {/if}
</div>
