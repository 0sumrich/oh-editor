<script>
    import { createEventDispatcher } from "svelte";
    import { dayLookup, timePos, calculateTotal } from "../helper/main";
    import { data, chipClicked,  } from "./stores";
    import OhChip from "./OhChip.svelte";
    import Time from "./Time.svelte";
    import TotalChip from "./TotalChip.svelte";
    const dispatch = createEventDispatcher();
    const headers =
        $data.length > 0
            ? Object.keys($data[0]).map((s) =>
                  ["library", "total"].includes(s) ? s : dayLookup(s)
              )
            : [];

    // state
    // let $chipClicked = false;
    let pos;
    let currOh;
    let currOhOriginal;
    let currTarget;
    let currentDataIndex;
    let currentDayIndex;

    function reset() {
        $data[currentDataIndex]["total"] = calculateTotal(
            $data[currentDataIndex]
        );
        chipClicked.set(false)
        currOh = undefined;
        currOhOriginal = undefined;
        pos = undefined;
        currTarget = undefined;
    }

    function isValid(oh) {
        // checks whether the Time.svelte form is a valid time or not
        const { start, finish } = oh;
        const pattern = new RegExp("^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$");
        return ![start, finish].map((x) => pattern.test(x)).includes(false);
    }

    // click handlers
    const handleClickAway = (e) => {
        const time = document.querySelector("#time");
        if (time.contains(e.target) || e.target == time) {
            $chipClicked = true;
        } else {
            if (isValid(currOh)) {
                reset();
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
            }
            // else highlight problem
        }
    };

    const handleChipClick = ({ detail }) => {
        chipClicked.update(clickState => !clickState);

        const { start, finish, opening_type, library, day, id, target } =
            detail;
        if ($chipClicked) {
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
            currentDataIndex = $data
                .map((o) => o.library)
                .indexOf(currOh.library);
            currentDayIndex = $data[currentDataIndex][currOh.day]
                .map((o) => o.id)
                .indexOf(currOh.id);
            document.addEventListener("click", handleClickAway, true);
            document.addEventListener("keydown", handleEscPress, true);
        }
    };

 $: if ($chipClicked) {
        const { start, finish, opening_type, id, day } = currOh;
        $data[currentDataIndex][day][currentDayIndex] = {
            start,
            finish,
            opening_type,
            id,
        };
    }
    $: if (!$chipClicked) {
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
            {#each $data as { library, total, ...d }}
                <tr class="border border-collapse">
                    <!-- week days -->
                    <td class="p-2">{library}</td>
                    {#each Object.keys(d) as day}
                        <td class="p-2 align-top">
                            <!-- if d[day] is an array full of chipdata objects eg. start, finish, openingtype -->
                            {#each d[day] as chipData}
                                <OhChip
                                    data={{ day, library, ...chipData }}
                                    on:chipClick={handleChipClick}
                                />
                            {:else}
                                <!-- TODO: else d[day] is an empty array -->
                                <!-- needs to be clickable with a form, to do -->
                                <div />
                            {/each}
                        </td>
                    {/each}
                    <!-- total goes here -->
                    <td class="p-2">
                        {#each Object.keys(total) as openingType}
                            <TotalChip
                                {openingType}
                                total={total[openingType]}
                            />
                        {/each}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    {#if $chipClicked}
        <Time bind:hours={currOh} {pos} />
    {/if}
</div>

<style>
    table {
        width: 100%;
        margin-bottom: 25vh;
    }
</style>
