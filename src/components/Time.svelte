<script>
  import { onMount } from "svelte";
  import { openingTypes, data, chipClicked } from "./stores";
  import { calculateTotal } from "../helper/main";
  export let hours;
  export let pos;

  let editOpeningTypeClicked = false;

  const inputClasses =
    "border rounded w-full p-1 text-gray-700 focus:ring-2 focus:ring-blue-600";
  const inputOpts = {
    type: "text",
    class: inputClasses,
  };

  function handleDeleteClick() {
    const libraries = $data.map((o) => o.library);
    const libraryIndex = libraries.indexOf(hours.library);
    const newHours = $data[libraryIndex][hours.day].filter(
      (o) => o.id !== hours.id
    );
    const dataCopy = $data;
    dataCopy[libraryIndex][hours.day] = newHours;
    dataCopy[libraryIndex].total = calculateTotal(dataCopy[libraryIndex])
    data.set(dataCopy);
    chipClicked.set(false);
  }

  $: if (editOpeningTypeClicked) {
    openingTypes.update((types) => {
      types[types.length - 1] = hours.opening_type;
      return types;
    });
  }

  onMount(() => {
    document.querySelector("#start-time").focus();
  });
</script>

{#if hours}
  <div
    id="time"
    class="border rounded absolute p-4 bg-gray-50 shadow-lg"
    style={`top: ${pos.top - 5}px;left: ${
      pos.left
    }px; transform: translate(-50%, ${pos.translateY})`}
  >
    <div class="p-1">
      <label for="start-time" class="text-gray-500">Start time</label>
      <input {...inputOpts} id="start-time" bind:value={hours.start} />
    </div>
    <div class="p-1 mt-1">
      <label for="end-time" class="text-gray-500">End time</label>
      <input {...inputOpts} bind:value={hours.finish} />
    </div>
    <div class="p-1 mt-1">
      {#if !editOpeningTypeClicked}
        <!-- not editable -->
        <label for="opening-type" class="text-gray-500">Opening type</label>
        <select
          name="opening-types"
          id="opening-types"
          class={inputClasses}
          bind:value={hours.opening_type}
        >
          {#each $openingTypes as t}
            <option value={t} class="w-full p-1">{t}</option>
          {/each}
        </select>
      {:else}
        <!-- editable -->
        <label for="opening-type" class="text-gray-500">Opening type</label>
        <input
          id="edit-opening-types"
          class={inputClasses}
          placeholder={hours.opening_type}
          bind:value={hours.opening_type}
        />
      {/if}
    </div>
    <div class="p-1 mt-1">
      <button
        id="add-opening-type"
        class={"bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"}
        on:click={() => {
          editOpeningTypeClicked = true;
          openingTypes.update((array) => [...array, hours.opening_type]);
        }}
      >
        Edit opening type
      </button>
    </div>
    <div class="p-1 mt-1">
      <button
        id="delete-opening"
        class={"bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"}
        on:click={handleDeleteClick}
      >
        Delete
      </button>
    </div>
  </div>
{/if}

<style>
  input {
    width: 100px;
  }
  label {
    display: block;
  }
</style>
