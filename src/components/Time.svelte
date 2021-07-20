<script>
  import { onMount } from "svelte";
  export let hours;
  export let pos;
  export let openingTypes;
  // const pattern = "([01]d|2[0-3]):?[0-5]d";
  const inputClasses =
    "border rounded w-full p-1 text-gray-700 focus:ring-2 focus:ring-blue-600";
  const inputOpts = {
    type: "text",
    class: inputClasses,
  };

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
      <label for="opening-type" class="text-gray-500">Opening type</label>
      <select
        name="opening-types"
        id="opening-types"
        class={inputClasses}
        bind:value={hours.opening_type}
      >
        {#each openingTypes as t}
          <option value={t} class="w-full p-1">{t}</option>
        {/each}
      </select>
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
