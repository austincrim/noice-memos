<script>
  import { onMount } from 'svelte'
  import { init } from './init'

  let audioEl,
    isRecording = false,
    recorder,
    chunks = [],
    memos = [{ src: '1231231', title: 'test' }]

  onMount(async () => {
    recorder = await init()
    recorder.ondataavailable = function (e) {
      chunks.push(e.data)
    }

    recorder.onstop = function (e) {
      let blob = new Blob(chunks, { type: 'audio/mp3' })
      memos = [...memos, { src: URL.createObjectURL(blob) }]
    }
  })

  function record() {
    if (!isRecording) {
      chunks = []
      recorder.start()
      isRecording = true
    } else {
      recorder.stop()
      isRecording = false
    }
  }
</script>

<main>
  <h1>Noice Memos 🎤</h1>
  <div class="control-area">
    {#each memos as memo}
      <div class="memo">
        <input bind:value={memo.title} />
        <span style="display: flex; align-items: center; gap: 1rem;">
          <audio bind:this={audioEl} src={memo.src} controls />
          <button on:click={() => (memos = memos.filter((m) => memo.src !== m.src))}>Delete</button>
        </span>
      </div>
    {/each}
    <button class:isRecording on:click={record}>{isRecording ? 'Stop' : 'Record'}</button>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10rem;
    padding: 4rem;
    max-width: 800px;
    margin: 0 auto;
  }

  button {
    border: 1px solid #333;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    background-color: white;
    transition: background-color 0.1s ease-out;
  }

  button:hover {
    border: 1px solid #333;
    background-color: #efefef;
  }

  button.isRecording {
    background-color: lightcoral;
  }

  .memo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  input {
    font-size: 1.3rem;
    border: none;
    border-radius: 7px;
    background-color: hsl(0 0% 97%);
    padding: 0.5rem 1rem;
  }

  input:hover {
    background-color: hsl(0 0% 95%);
  }

  .control-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
</style>
