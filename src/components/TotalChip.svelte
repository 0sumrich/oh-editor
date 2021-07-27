<script>
    export let total;
    export let openingType;
    export let openingTypes;
    const idx = openingTypes.indexOf(openingType);
</script>

<div
    class={`legend rounded-full p-1 m-1 text-center ${
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
>
    {`${total} hours`}
</div>

<style>
    .legend {
        width: fit-content;
    }
</style>
