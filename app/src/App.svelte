<script>
  import { onMount } from 'svelte'
  import { init } from './init'

  let audioEl,
    isRecording = false,
    recorder,
    chunks = [],
    memos = [],
    newTitle = '',
    tempTitle = ''

  onMount(async () => {
    recorder = await init()
    let timeout
    recorder.onstart = (e) => {
      timeout = setTimeout(() => {
        recorder.stop()
        isRecording = false
      }, 5000)
    }
    recorder.ondataavailable = function (e) {
      chunks.push(e.data)
    }

    recorder.onstop = async () => {
      let reader = new FileReader()
      let blob = new Blob(chunks, { type: 'audio/mp3' })
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        await fetch('http://localhost:8787', {
          method: 'POST',
          body: JSON.stringify({ src: reader.result, title: tempTitle })
        })
      }
      memos = [...memos, { src: URL.createObjectURL(blob), title: tempTitle }]
      clearTimeout(timeout)
    }

    const res = await fetch('http://localhost:8787')

    if (res.ok) {
      const fetchedMemos = await res.json()
      if (fetchedMemos && fetchedMemos.length > 0) {
        memos = fetchedMemos
      }
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
      tempTitle = newTitle
      newTitle = ''
    }
  }
</script>

<main>
  <h1>Noice Memos 🎤</h1>
  <div class="control-area">
    {#each memos as memo}
      <div class="memo">
        <h3>{memo.title}</h3>
        <span style="display: flex; align-items: center; gap: 1rem;">
          <audio bind:this={audioEl} src={memo.src} controls />
          <button on:click={() => (memos = memos.filter((m) => memo.src !== m.src))}>Delete</button>
        </span>
      </div>
    {/each}
  </div>
  <form class="new-recording">
    <label for="title"> Title </label>
    <input id="title" type="text" bind:value={newTitle} />
    <button disabled={newTitle.length === 0} class:isRecording on:click|preventDefault={record}
      >{isRecording ? 'Stop' : 'Record'}</button
    >
  </form>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 6rem;
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

  label {
    font-weight: bold;
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

  .new-recording {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 75%;
    margin-inline: auto;
  }
</style>
