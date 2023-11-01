<script lang="ts">
  /**
   * INSTALL
   * yarn add dayjs
   *
   * USAGE
   * import DatePicker from './DatePicker.svelte'
   * function datepicked (e) { console.log(e.detail.datepicked) }
   *
   * <DatePicker
   *  on:datepicked={datepicked}
   *  customclass=""                  (facultative) css class
   * />
   */
  import { goto } from "$app/navigation";
  import { writable, derived } from "svelte/store";
  import { myArrayStore, deleteArr, creds } from "$lib/store";
  import { createEventDispatcher, onMount } from "svelte";
  import dayjs from "dayjs";
  import "dayjs/locale/fr";
  // Import your writable store here

  // Create a reactive object to store the calculated values
  let totalPrice = 0;
  export let token: any;
  export let userName: string;
  export let isOpen = false;
  let totalWeight = 0;
  let stores: any[] = [];
  let orderId: number;
  let routes: any[] = [];
  let deliveryAddress: string;
  fetch("http://localhost:5000/api/admin/store")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      stores = data.stores;
    });
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

  const dispatch = createEventDispatcher();
  let elModal: any; // HTMLElement
  let inputTxt: any;
  let location: string;
  let route: string; // string, défault date = now
  let isOpenCalendar = false; // true: show calendar
  const arrDays = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
  const currentDay = +dayjs().format("D"); // 1..31
  const currentMonth = +dayjs().format("M"); // 1..12
  const currentYear = +dayjs().format("YYYY"); // 2021...
  let selectedMonth = +dayjs().format("M"); // 1..12
  let selectedYear = +dayjs().format("YYYY"); // 2021...
  let rows = initRows();

  // props
  async function locationOnChange() {
    console.log(location);
    isOpen = true;
    await fetch("http://localhost:5000/api/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storeId: location,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        routes = json.routes;
        console.log(routes);
      });
    isOpen = false;
  }
  // reactivity, on inputTxt changes
  $: dispatch("datepicked", {
    datepicked: inputTxt,
  });

  // life cycle
  onMount(() => {
    dayjs.locale("fr"); // use locale
    inputTxt = dayjs().format("YYYY-MM-DD"); // current day month year in input
    affecteRows();
    calculateTotals();

    // Set up an observer to recalculate totals when the store changes
    const unsubscribe = myArrayStore.subscribe(() => {
      calculateTotals();
    });
  });

  // functions
  /**
   * Click outside of the modal will close it
   * @param e
   */
  function handleClickModal(e: any) {
    if (e.target === elModal) {
      isOpenCalendar = false;
    }
  }
  console.log("creds", $creds);
  function initRows() {
    return [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
  }
  let currentDatePlus14Days = dayjs().add(7, "day");

  // ... (your existing code)

  function isHighlightedDay(year: any, month: any, day: any) {
    const selectedDate = dayjs(`${year}-${month}-${day}`);
    console.log(year, month, day);
    console.log(selectedDate.isBefore(currentDatePlus14Days, "day"));
    return selectedDate.isBefore(currentDatePlus14Days, "day");
  }
  function affecteRows() {
    rows = initRows();
    const firstDayOfCurrentMonth = ucFirst(
      dayjs(selectedYear + "-" + selectedMonth)
        .startOf("month")
        .format("dd")
    ); // 'Lu'
    const lastDayOfCurrentMonth = +dayjs(selectedYear + "-" + selectedMonth)
      .endOf("month")
      .format("D"); // 31
    let iRow = 0;
    let iCol = 0;
    let start = false;
    let cpt = 0;
    for (iRow = 0; iRow < 6; iRow++) {
      arrDays.forEach((daystr) => {
        if (cpt > lastDayOfCurrentMonth) {
          return;
        }
        if (!start && daystr === firstDayOfCurrentMonth) {
          cpt++;
          start = true;
        }
        rows[iRow][iCol] = cpt;
        iCol++;
        if (start) {
          cpt++;
        }
      });
      iCol = 0;
    }
  }

  function ucFirst(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function previousMonth() {
    selectedMonth--;
    if (selectedMonth <= 0) {
      selectedMonth = 12;
      selectedYear--;
    }
    affecteRows();
  }

  function nextMonth() {
    selectedMonth++;
    if (selectedMonth > 12) {
      selectedMonth = 1;
      selectedYear++;
    }
    affecteRows();
  }
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month starts from 0
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  function selectDate(y: any, m: any, d: any) {
    inputTxt = dayjs(y + "-" + m + "-" + d).format("YYYY-MM-DD");
    console.log(inputTxt);
    isOpenCalendar = false;
  }

  let showMessage = false;

  function showSuccessMessage() {
    showMessage = true;
    // Automatically hide the message after a certain time (e.g., 3 seconds)
    let data = {
      orderItems: $myArrayStore.map((item) => {
        return {
          itemId: Number(item.id),
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
        };
      }),
      routeId: route,
      deliveryDate: inputTxt,
      orderDate: getCurrentDate(),
      deliveryAddressId: deliveryAddress,
      orderCapacity: totalWeight,
      price: totalPrice,
      storeId: location,
      userName: $creds[1],
    };

    console.log(data);
    fetch("http://localhost:5000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + $creds[0],
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });

    setTimeout(() => {
      showMessage = false;
      deleteArr();
      goto("/dashboard");
    }, 2000);
  }
</script>

{#if isOpen}
  <div class="modal">
    <div class="modal-content">
      <div class="loading-indicator" />
      <p class="text-black">Loading...</p>
    </div>
  </div>
{/if}
{#if isOpenCalendar}
  <div
    class="fixed z-40 left-0 top-0 w-full h-full overflow-auto bg-zinc-700 bg-opacity-40"
    bind:this={elModal}
    on:click={handleClickModal}
  >
    <div class="flex items-center justify-center py-8 px-4">
      <div class="max-w-sm w-full shadow-lg">
        <div class="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
          <div class="px-4 flex items-center justify-between">
            <!-- Month year -->
            <span class="focus:outline-none text-base font-bold text-gray-100"
              >{ucFirst(
                dayjs(selectedYear + "-" + selectedMonth).format("MMMM YYYY")
              )}</span
            >
            <div class="flex items-center">
              <!-- bnt previous -->
              <button
                on:click={previousMonth}
                aria-label="calendar backward"
                class="text-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-chevron-left"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <!-- bnt next -->
              <button
                on:click={nextMonth}
                aria-label="calendar forward"
                class="ml-3 text-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-chevron-right"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-red-500">you can't select highlighted dates</p>
          <div class="flex items-center justify-between pt-12 overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr>
                  {#each arrDays as day}
                    <th>
                      <div class="w-full flex justify-center">
                        <p
                          class="text-base font-medium text-center text-gray-800"
                        >
                          {day}
                        </p>
                      </div>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each rows as col}
                  <tr>
                    {#each col as i}
                      <td class="pt-4">
                        <div
                          class="px-2 py-2 cursor-pointer flex w-full justify-center"
                        >
                          {#if i > 0}
                            {#if i === currentDay && selectedMonth === currentMonth && selectedYear === currentYear}
                              <button
                                on:click={() => {
                                  selectDate(selectedYear, selectedMonth, i);
                                }}
                                class="rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:bg-indigo-500 hover:bg-indigo-500 text-base w-8 h-8 flex items-center justify-center font-medium text-white bg-indigo-700"
                                >{i}</button
                              >
                            {:else if isHighlightedDay(selectedYear, selectedMonth, i)}
                              <p class="text-base text-red-500 font-medium">
                                <button class="border-none" on:click={() => {}}>
                                  {i}
                                </button>
                              </p>
                            {:else}
                              <p class="text-base text-gray-500 font-medium">
                                <button
                                  class="border-none"
                                  on:click={() => {
                                    selectDate(selectedYear, selectedMonth, i);
                                  }}
                                >
                                  {i}
                                </button>
                              </p>
                            {/if}
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="flex flex-col items-center justify-center m-4">
  <h1 class="h4 bg-gradient-to-br box-decoration-clone">
    Select expected date and location
  </h1>
  <div class="md:w-2/3 w-full bg-slate-400 bg-opacity-50">
    <div class="flex flex-col items-center justify-center">
      <label class="text-gray-200">Delivery Address</label>
      <label class="label">
        <input
          class="input w-64 mb-4"
          type="text"
          placeholder="Address"
          bind:value={deliveryAddress}
        />
      </label>
      <label class="text-gray-200">Select Location</label>
      <label class="label">
        <!-- <span>Select Location</span> -->
        <select
          class="select w-64"
          bind:value={location}
          on:change={() => {
            locationOnChange();
          }}
        >
          {#each stores as s}
            <option value={s.id}>{s.city} - {s.id}</option>
          {/each}
          <!-- <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
          <option value="5">Option 5</option> -->
        </select>
      </label>
      <label class="text-gray-200">Select Route</label>
      <label class="label">
        <!-- <span>Select Location</span> -->
        <select class="select w-64" bind:value={route}>
          {#each routes as r}
            <option value={r.Id}
              >{r.Id} : max-duration {r.MaximumTimeForCompletion}</option
            >
          {/each}
          <!-- <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
          <option value="5">Option 5</option> -->
        </select>
      </label>
      <label class="text-gray-200">Select Date</label>
      <input
        type="text"
        bind:value={inputTxt}
        class="input w-64 mb-4"
        on:click={() => {
          isOpenCalendar = true;
        }}
      />
      {#if showMessage}
        <div class="bg-green-400 text-black p-4 mb-4 rounded-md shadow-md">
          Success! Your action was successful.
        </div>
      {/if}
      <a
        type="button"
        class=" m-2 w-64 btn float-right variant-filled cursor-pointer"
        on:click={showSuccessMessage}
        >Confirm Order
      </a>
    </div>
  </div>
  <div class="md:w-2/3 w-full bg-slate-400 bg-opacity-50 m-3">
    <h3 class="h3 pl-6">Order Summery</h3>
    <section class="w-full max-h-[400px] p-4 overflow-y-auto space-y-4">
      <div class="m-2 bg-zinc-700 text-black">
        <p class="m-1 text-white">Order Details</p>
        <div class="flex">
          <p class="m-1 bg-white p-1">Total Price : $ {totalPrice}</p>
          <p class="m-1 bg-white p-1">Total Weight : {totalWeight} Kg</p>
          <p class="m-1 bg-white p-1">Expected Date : {inputTxt}</p>
          <p class="m-1 bg-white p-1">Delivery Location : {location}</p>
        </div>
      </div>
      {#each $myArrayStore as bubble, i}
        <!-- Host Message Bubble -->
        <div class="m-2 bg-zinc-700 text-white">
          <p class="m-1">Item : {bubble.name}</p>
          <p class="m-1">Quantity : {bubble.quantity}</p>
          <p class="m-1">Total Price : $ {bubble.quantity * bubble.price}</p>
          <p class="m-1">Total Weight : {bubble.quantity * bubble.weight} Kg</p>
        </div>
      {/each}
    </section>
  </div>
</div>

<style>
  /* Style the modal and loading indicator as needed */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }

  .loading-indicator {
    /* Add your loading indicator styles (e.g., spinner, animation) */
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
