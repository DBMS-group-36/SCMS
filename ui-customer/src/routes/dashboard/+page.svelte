<!-- YourSvelteComponent.svelte -->
<script>
  import { ProgressBar } from "@skeletonlabs/skeleton";
  // Sample data for ongoing orders
  let orders = [
    {
      id: 1,
      orderNumber: "ORD123",
      progress: 50, // Progress in percentage (0-100)
      state: "In Progress",
    },
    {
      id: 2,
      orderNumber: "ORD456",
      progress: 75,
      state: "In Progress",
    },
    {
      id: 3,
      orderNumber: "ORD789",
      progress: 100,
      state: "Completed",
    },
  ];
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
        >Progress</th
      >
      <th
        class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
        >State</th
      >
    </tr>
  </thead>
  <tbody class="bg-zinc-600 divide-y divide-gray-500">
    {#each orders as order (order.id)}
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
          >{order.orderNumber}</td
        >
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <div class="w-56 h-2 bg-gray-300 rounded-full">
            <ProgressBar
              label="Progress Bar"
              value={order.progress}
              max={100}
            />
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
          >{order.state}</td
        >
      </tr>
    {/each}
  </tbody>
</table>
