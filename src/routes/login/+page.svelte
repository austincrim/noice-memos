<script>
  import { signIn } from '@auth/sveltekit/client'

  let signingIn = null
</script>

<main class="w-full h-full flex justify-center items-center">
  <div
    class="flex flex-col items-center justify-center gap-12 bg-[whitesmoke] shadow-lg p-16 rounded-md"
  >
    <h1 class="text-4xl">Welcome to Noice Memos!</h1>
    <button
      on:click={() => (signingIn = signIn('github'))}
      disabled={signingIn}
      class="p-3 border border-black rounded-md"
    >
      {#if !signingIn}
        Login with GitHub
      {:else}
        <span>Authenticating...</span>
      {/if}
    </button>
  </div>
</main>
