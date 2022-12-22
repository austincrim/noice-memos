<script>
  import { page } from '$app/stores'
  import { signOut } from '@auth/sveltekit/client'
</script>

<nav>
  <span>Noice Memos</span>
  <div>
    <img
      src={$page.data.session?.user?.image}
      alt="{$page.data.session?.user?.name}'s github avatar"
    />
    <button on:click={() => signOut()}>Sign out</button>
  </div>
</nav>

<slot />

<style>
  nav {
    background: whitesmoke;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-inline: 2rem;
    padding-block: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: normal;
  }

  img {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
  }

  button {
    border: none;
    padding: 0.5rem;
  }
</style>
