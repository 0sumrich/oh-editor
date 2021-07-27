<script>
    import { createEventDispatcher } from "svelte";
    import { dayLookup, getHoursFromString, timePos } from "../helper/main";
    import OhChip from "./OhChip.svelte";
    import Time from "./Time.svelte";
    import TotalChip from "./TotalChip.svelte";
    const dispatch = createEventDispatcher();
    export let data = [];
    export let openingTypes = [];
    const headers =
        data.length > 0
            ? Object.keys(data[0]).map((s) =>
                  ["library", "total"].includes(s) ? s : dayLookup(s)
              )
            : [];

    // state
    let clicked = false;
    let pos;
    let currOh;
    let currOhOriginal;
    let currTarget;
    let currentDataIndex;
    let currentDayIndex;

    function calculateTotal(row){
        const weekdays = Object.keys(row).filter(key => !['library','total'].includes(key))
        let total = {}
        for (const day of weekdays){
            for (const {start, finish, opening_type} of row[day]){
                const dayTotal = getHoursFromString(finish) - getHoursFromString(start)
                if (total.hasOwnProperty(opening_type)){
                    total[opening_type] += dayTotal
                } else {
                    total[opening_type] = dayTotal
                }
            }
        }
        return total
    }

    function reset() {
        data[currentDataIndex]['total'] = calculateTotal(data[currentDataIndex])
        clicked = false;
        currOh = undefined;
        currOhOriginal = undefined;
        pos = undefined;
        currTarget = undefined;
    }
    function handleTableChange() {
        dispatch("tableChange", { data, clicked });
    }

    function isValid(oh) {
        const { start, finish } = oh;
        const pattern = new RegExp("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");
        return ![start, finish].map((x) => pattern.test(x)).includes(false);
    }

    // click handlers
    const handleClickAway = (e) => {
        const time = document.querySelector("#time");
        if (time.contains(e.target) || e.target == time) {
            clicked = true;
        } else {
            if (isValid(currOh)) {
                reset();
                handleTableChange();
            }
        }
    };

    const handleEscPress = (e) => {
        if (
            e.key === "Escape" ||
            (document.activeElement.id === "opening-types" && e.key === "Enter")
        ) {
            if (isValid(currOh)) {
                reset();
                handleTableChange();
            }
            // else highlight problem
        }
    };

    const handleChipClick = ({ detail }) => {
        clicked = !clicked;
        handleTableChange();

        const { start, finish, opening_type, library, day, id, target } =
            detail;
        if (clicked) {
            pos = timePos(target);
            currOhOriginal = {
                start,
                finish,
                opening_type,
                library,
                id,
                day,
            };
            currOh = { start, finish, opening_type, library, id, day };
            currTarget = target;
            currentDataIndex = data
                .map((o) => o.library)
                .indexOf(currOh.library);
            currentDayIndex = data[currentDataIndex][currOh.day]
                .map((o) => o.id)
                .indexOf(currOh.id);
            document.addEventListener("click", handleClickAway, true);
            document.addEventListener("keydown", handleEscPress, true);
        }
    };
    $: if (clicked) {
        const { start, finish, opening_type, id, day } = currOh;
        data[currentDataIndex][day][currentDayIndex] = {
            start,
            finish,
            opening_type,
            id,
        };
    }
    $: if (!clicked) {
        document.removeEventListener("click", handleClickAway, true);
        document.removeEventListener("keydown", handleEscPress, true);
    }
</script>

<div class="relative">
    <table class="table-auto border border-collapse">
        <thead>
            {#each headers as header}
                <th
                    class="sticky top-0 font-medium capitalize p-2 border bg-white"
                    >{header}</th
                >
            {/each}
        </thead>
        <tbody>
            {#each data as { library, total, ...d }}
                <tr class="border border-collapse">
                    <!-- week days -->
                    <td class="p-2">{library}</td>
                    {#each Object.keys(d) as day}
                        <td class="p-2 align-top">
                            {#each d[day] as chipData}
                                <OhChip
                                    data={{ day, library, ...chipData }}
                                    {openingTypes}
                                    on:chipClick={handleChipClick}
                                />
                            {/each}
                        </td>
                    {/each}
                    <!-- total goes here -->
                    <td class="p-2">
                        {#each Object.keys(total) as openingType}
                            <TotalChip
                                {openingTypes}
                                {openingType}
                                total={total[openingType]}
                            />
                        {/each}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if clicked}
        <Time bind:hours={currOh} {pos} {openingTypes} />
    {/if}
</div>

<style>
    table {
        width: 100%;
    }
</style>
