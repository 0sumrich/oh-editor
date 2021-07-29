<script>
  import { onMount } from "svelte";
  import { openingTypes } from "./stores";
  export let hours;
  export let pos;

  let clicked = false;
  // const pattern = "([01]d|2[0-3]):?[0-5]d";
  const inputClasses =
    "border rounded w-full p-1 text-gray-700 focus:ring-2 focus:ring-blue-600";
  const inputOpts = {
    type: "text",
    class: inputClasses,
  };

  $: if (clicked) {
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
      {#if !clicked}
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
          clicked = true;
          openingTypes.update((array) => [...array, hours.opening_type]);
        }}
      >
        Edit opening type
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
