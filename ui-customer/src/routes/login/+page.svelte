<script lang="ts">
  // Implement your login logic here
  // function login() {
  //   // Replace this with your actual login logic
  //   username = "";
  //   password = "";
  //   console.log("Login clicked");
  //   console.log(username, password);
  // }
  // let username: String;
  // let password: String;
</script>

<div
  class="min-h-screen flex items-center justify-center bg-opacity-20 bg-gray-100"
>
  <div class="bg-white bg-opacity-30 shadow-md rounded-lg p-8 w-96">
    <h1 class="text-2xl font-semibold mb-4">Login</h1>
    <form method="post">
      <div class="mb-4">
        <label class="text-gray-200">Username</label>
        <input
          class="border input rounded-md w-full py-2 px-3"
          type="text"
          name="username"
          placeholder="Username"
        />
      </div>
      <div class="mb-4">
        <label class="text-gray-200">Password</label>
        <input
          class="border input rounded-md w-full py-2 px-3"
          type="password"
          placeholder="Password"
          name="password"
        />
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-md"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</div>
