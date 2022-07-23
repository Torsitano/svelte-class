<script lang="ts">
    export let label: string = "",
        id: string = "",
        entry: string = "",
        help: string | undefined
</script>

<div class="form-group">
    <label for={id}>{label}</label>
    <input
        {id}
        class={help ? "form-control is-invalid" : "form-control"}
        bind:value={entry} />
    {#if help}
        <span class="invalid-feedback" role="alert">{help}</span>
    {/if}
</div>
