<script>
    import {
        parseData,
        unique,
        filterToCurrentData,
        postData,
        dataIsEqual,
    } from "../helper/main";
    import { openingTypes, data, chipClicked } from "./stores";
    import Table from "./Table.svelte";
    import Legend from "./Legend.svelte";
    export let initData;

    const originalData = () => {
        const filteredToCurrentData = filterToCurrentData(initData);
        return parseData(filteredToCurrentData);
    };

    const resetData = () => {
        const filteredToCurrentData = filterToCurrentData(initData);
        openingTypes.set(unique(filteredToCurrentData, "opening_type"));
        data.set(parseData(filteredToCurrentData));
    };
    // also initialises data
    resetData();

    function unparse(data) {
        // library, day, start, finish, opening_type
        const res = [];
        for (const r of data) {
            const { library, total, ...d } = r;
            for (const day of Object.keys(d)) {
                for (const { start, finish, opening_type } of d[day]) {
                    res.push({ library, day, start, finish, opening_type });
                }
            }
        }
        return res;
    }

    async function handleSaveClick() {
        if (dataIsEqual(originalData(), $data)) {
            alert("No changes made yet");
        } else {
            try {
                const res = await postData(
                    "api/newOpeningHours",
                    unparse($data)
                );
                console.log(res);
            } catch (e) {
                alert(e.message);
            }
        }
    }
</script>

<main class="container mx-auto p-4 content-center">
    <Legend />
    <Table />
</main>
<footer class="relative">
    <div class="fixed bottom-0 w-full bg-white p-4 text-center">
        <button
            id="save"
            class={$chipClicked
                ? "bg-blue-500 cursor-not-allowed text-white py-2 px-4 rounded-full opacity-50"
                : "bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"}
            disabled={$chipClicked}
            on:click={handleSaveClick}
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
