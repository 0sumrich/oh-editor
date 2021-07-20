<script>
    import { parseData, unique } from "../helper/main";
    import Table from "./Table.svelte";
    import Legend from "./Legend.svelte";
    export let initData;
    let validData = true;
    const openingTypes = unique(initData, "opening_type");
    let data = parseData(initData);
    let currentData;
    // to do - grey out save button if data not valid
    const handleTableChange = ({ detail }) => {
        // if the edit window is open and the ohchip is still in clicked, the data is not valid
        validData = !detail.clicked;
        currentData = detail.data;
    };
</script>

<main class="container mx-auto p-4 content-center">
    <Legend {openingTypes} />
    <Table {data} {openingTypes} on:tableChange={handleTableChange} />
</main>
<footer class="relative">
    <div class="fixed bottom-0 w-full bg-white p-4 text-center">
        <button
            id="save"
            class={validData
                ? "bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
                : "bg-blue-500 cursor-not-allowed text-white py-2 px-4 rounded-full opacity-50"}
            disabled={!validData}
        >
            Save changes
        </button>
    </div>
</footer>

<style>
    main {
        margin-bottom: 75px;
    }
</style>