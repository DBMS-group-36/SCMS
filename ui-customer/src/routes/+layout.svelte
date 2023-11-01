<script lang="ts">
  import "../app.postcss";
  import { AppShell, AppBar } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  export let data: any;
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="/">
          <h1 class="h1">
            <span
              class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
              >SCMS 1.0</span
            >
          </h1>
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if data.visited != "true"}
          <a
            class="btn btn-sm variant-filled-primary"
            href="/login"
            rel="noreferrer"
            aria-current={$page.url.pathname === "/login"}
          >
            Login
          </a>
        {:else}
          <a
            class="btn btn-sm variant-filled-primary"
            href="/dashboard"
            rel="noreferrer"
            aria-current={$page.url.pathname === "/dashboard"}
          >
            Dashboard
          </a>
          <a
            class="btn btn-sm variant-filled-primary"
            href="/"
            rel="noreferrer"
            aria-current={$page.url.pathname === "/"}
          >
            Home
          </a>
        {/if}
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <slot />
</AppShell>
