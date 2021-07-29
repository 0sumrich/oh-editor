<script>
    import { parseData, unique, filterToCurrentData } from "../helper/main";
    import { openingTypes } from "./stores";
    import Table from "./Table.svelte";
    import Legend from "./Legend.svelte";
    export let initData;
    const filteredToCurrentData = filterToCurrentData(initData);
    let validData = true;
    let data = parseData(filteredToCurrentData);
    openingTypes.set(unique(filteredToCurrentData, "opening_type"));
    let currentData;
    const handleTableChange = ({ detail }) => {
        // if the edit window is open and the ohchip is still in clicked, the data is not valid
        validData = !detail.clicked;
        currentData = detail.data;
    };
    // to do - min requirements
    // 1. add an opening type
    // 3. save changes
    // 4. revert to a historic version and undo
    function dataIsEqual(a, b) {
        const jsonA = JSON.stringify(a);
        const jsonB = JSON.stringify(b);
        return jsonA === jsonB;
    }
    // $: if(currentData) {
    //     console.log(dataIsEqual(parseData(filteredToCurrentData), data))
    // }
    function resetData() {
        const originalData = parseData(filteredToCurrentData);
        if ((!dataIsEqual(originalData), data)) {
            data = originalData;
        }
    }
</script>

<main class="container mx-auto p-4 content-center">
    <Legend />
    <Table {data} on:tableChange={handleTableChange} />
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
        <button
            id="undo"
            class={"bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-full"}
            on:click={resetData}
        >
            Undo changes
        </button>
    </div>
</footer>

<style>
    main {
        margin-bottom: 75px;
    }
</style>
