<script>
    import { createEventDispatcher } from "svelte";
    import { openingTypes } from "./stores";
    export let data;
    const dispatch = createEventDispatcher();
    function handleClick({ target }) {
        dispatch("chipClick", {
            ...data,
            target,
        });
    }
    let idx = 0;
    $: if (data.opening_type) {
        idx = $openingTypes.indexOf(data.opening_type);
    }
    // need to include the whole tailwind css class in the html, otherwise purge will purge it in production
</script>

{#if data.start}
    <div
        class={`oh-chip rounded-full p-1 m-1 text-center ${
            [
                "bg-green-300",
                "bg-purple-300",
                "bg-indigo-300",
                "bg-pink-300",
                "bg-blue-300",
                "bg-yellow-300",
                "bg-red-300",
            ][idx]
        }  ${
            [
                "border-green-400",
                "border-purple-400",
                "border-indigo-400",
                "border-pink-400",
                "border-blue-400",
                "border-yellow-400",
                "border-red-400",
            ][idx]
        } border-2`}
        on:click={handleClick}
    >
        {`${data.start} - ${data.finish}`}
    </div>
{/if}

<style>
    .oh-chip {
        cursor: pointer;
        border-width: 3px;
    }
    .oh-chip:hover {
        box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
    }
</style>
