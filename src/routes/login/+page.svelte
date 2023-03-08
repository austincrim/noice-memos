<script>
  import { signIn } from '@auth/sveltekit/client'
</script>

<main class="w-full h-full flex justify-center items-center">
  <div
    class="flex flex-col items-center justify-center gap-12 bg-[whitesmoke] shadow-lg p-16 rounded-md"
  >
    <h1 class="text-4xl">Welcome to Noice Memos!</h1>
    <button
      on:click={() => signIn('github')}
      class="p-3 border border-black rounded-md"
    >
      Login with GitHub
    </button>
  </div>
</main>
