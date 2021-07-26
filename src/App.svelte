<script>
    import Tailwind from "./Tailwindcss.svelte";
    import Main from './components/Main.svelte'
    const fetchData = async () =>
        await fetch("/api/data").then((res) => res.json());
</script>

<Tailwind />
{#await fetchData()}
    <div>loading...</div>
{:then initData}
    <Main {initData} />
{/await}
