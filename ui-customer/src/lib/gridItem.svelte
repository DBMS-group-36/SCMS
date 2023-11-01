<!-- GridItem.svelte -->

<script lang="ts">
  import { myArrayStore, addItem } from "./store.js";
  export let title: string;
  export let price: number;
  export let weight: number;
  export let id: number;
  let quantity: number;
  console.log("fukc");
  let show = false;
</script>

<div class="card rounded-lg bg-opacity-50 p-4">
  <div
    on:click={() => {
      console.log("clicked");
      if (show) {
        show = false;
      } else {
        show = true;
      }
    }}
  >
    <h3>{title}</h3>
    <img src="https://via.placeholder.com/150" alt="Placeholder" />
    <div class="flex justify-between">
      <h5>$ {price}</h5>
      <h5>{weight} kg</h5>
    </div>
  </div>

  {#if show}
    <div class="flex items-center mt-2 space-x-2">
      <input
        type="text"
        class="border rounded-md px-4 py-2 input focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Quantity"
        bind:value={quantity}
      />
      <button
        class="bg-blue-500 btn hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        on:click={() => {
          addItem({
            name: title,
            quantity: quantity,
            weight: weight,
            price: price,
            id: id,
          });
          show = false;
        }}
      >
        Add
      </button>
    </div>
  {/if}
</div>
