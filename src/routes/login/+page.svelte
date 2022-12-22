<script>
  import { signIn } from '@auth/sveltekit/client'
</script>

<main class="w-full h-full flex justify-center items-center">
  <div
    class="flex flex-col items-center justify-center gap-4 bg-[whitesmoke] shadow-lg p-20 rounded-md"
  >
    <h1 class="text-4xl text-center">Welcome to Noice Memos!</h1>
    <button
      on:click={() =>
        signIn('github', { callbackUrl: 'http://localhost:5173/' })}
      class="px-2 py-4 border border-black rounded-md"
    >
      Login with GitHub
    </button>
  </div>
</main>
