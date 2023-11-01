<!-- YourSvelteComponent.svelte -->
<script lang="ts">
  import { ProgressBar } from "@skeletonlabs/skeleton";
  // Sample data for ongoing orders
  export let data: any;
  console.log("here");
  console.log(data);
  let orders = data.orders;
  const statusColors = {
    "Order Placed": "bg-pink-900",
    "On Train": "bg-blue-900",
    "At Store": "bg-green-900",
    Delivery: "bg-yellow-900",
    Delivered: "bg-cyan-900",
    Cancelled: "bg-red-900",
    // ... other status colors
  };
</script>

<table class="min-w-full">
  <thead>
    <tr>
      <th
        class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
        >Order Number</th
      >
      <th
        class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
        >Capacity</th
      >
      <th
        class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
        >Price</th
      >
      <th
        class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
        >Delivery Date</th
      >
      <th
        class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
        >State</th
      >
    </tr>
  </thead>
  <tbody class="bg-zinc-600 divide-y divide-gray-500">
    {#each orders as order (order.Id)}
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
          >{order.Id}</td
        >
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
          >{order.orderCapacity}</td
        >
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
          >{order.price}</td
        >
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
          >{order.deliveryDate}</td
        >
        <td
          class={`px-6 py-4 whitespace-nowrap text-sm text-gray-100 ${
            statusColors[order.status] || ""
          }`}>{order.status}</td
        >
      </tr>
    {/each}
  </tbody>
</table>
