<script lang="ts">
  import DatePicker from "$lib/DatePicker.svelte";
  import { myArrayStore, creds, addCreds } from "$lib/store";
  import GridItem from "../lib/gridItem.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  // Create a reactive object to store the calculated values
  let totalPrice = 0;
  let totalWeight = 0;

  // Function to calculate totals based on the store's data
  function calculateTotals() {
    totalPrice = $myArrayStore.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.price * currentValue.quantity,
      0
    );
    totalWeight = $myArrayStore.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.weight * currentValue.quantity,
      0
    );
  }
  // life cycle
  onMount(() => {
    calculateTotals();

    // Set up an observer to recalculate totals when the store changes
    const unsubscribe = myArrayStore.subscribe(() => {
      calculateTotals();
    });
  });
  export let data: any;
  addCreds(data.token, data.userName);
  console.log(data);
  // let items = [
  //   { title: "Item 1", price: 4, weight: 12 },
  //   { title: "Item 2", price: 1, weight: 10 },
  //   { title: "Item 3", price: 3, weight: 15 },
  //   { title: "Item 4", price: 5, weight: 18 },
  //   { title: "Item 5", price: 3, weight: 12 },
  //   { title: "Item 6", price: 1, weight: 20 },
  //   // Add more items as needed
  // ];
</script>

<div class="flex flex-col items-center justify-center">
  {#if data.visited != "true"}
    <h1 class="h1 mt-3">WELCOME CUSTOMER!</h1>
    <h3 class="h3 text-cyan-200">Login to continue..</h3>
    <a
      class="btn btn-lg w-64 variant-filled-secondary"
      href="/login"
      rel="noreferrer"
    >
      Login
    </a>
  {:else}
    <h1 class="h4 mt-3 box-decoration-clone">Order</h1>
    <div class="md:w-2/3 w-full bg-slate-400 bg-opacity-50">
      <div class="flex text-black pt-4 pl-4">
        <p class="m-1 bg-white p-1">Total Price : $ {totalPrice}</p>
        <p class="m-1 bg-white p-1">Total Weight : {totalWeight} Kg</p>
      </div>
      <div
        class=" snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10"
      >
        {#each $myArrayStore as item (item)}
          <div class="snap-start shrink-0 card py-2 px-5 text-center">
            <div>
              <h3 class="h3 text-green-300">X {item.quantity}</h3>
              <h3>{item.name}</h3>
              <img src="https://via.placeholder.com/150" alt="Placeholder" />
              <div class="flex justify-between">
                <h5>$ {item.price}</h5>
                <h5>{item.weight} kg</h5>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <a
        type="button"
        class=" m-5 w-1/3 rounded-lg btn float-right variant-filled"
        href="/date"
        >Proceed
      </a>
    </div>
    <h1 class="h4 box-decoration-clone">Items Available</h1>
    <div class="md:w-2/3 w-full bg-slate-400 bg-opacity-50">
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 max-w-screen-xl mx-auto overflow-x-auto"
      >
        {#each data.products as item (item.id)}
          <GridItem
            title={item.name}
            price={Number(item.price)}
            weight={item.CapacityPerUnit}
            id={item.id}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
