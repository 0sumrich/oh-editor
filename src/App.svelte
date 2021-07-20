<!-- <script context="module">
    export async function load({ fetch }) {
        const res = await fetch("/api/data");
        if (res.ok) {
            return {
                props: { initData: await res.json().then((res) => res.data) },
            };
        }
        return {
            status: res.status,
            error: new Error(`Could not load the dataaaa`),
        };
    }
</script> -->
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
