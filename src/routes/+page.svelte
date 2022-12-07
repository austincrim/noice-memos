<script>
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { init } from './init'

  let audioEl,
    isRecording = false,
    recorder,
    chunks = [],
    memos = [],
    newTitle = '',
    tempTitle = '',
    initialFetchCompleted = false

  onMount(async () => {
    recorder = await init()

    let timeout
    recorder.onstart = (e) => {
      timeout = setTimeout(() => {
        document.getElementById('record-btn').click()
        isRecording = false
      }, 5000)
    }

    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }

    recorder.onstop = async () => {
      let reader = new FileReader()
      let blob = new Blob(chunks, { type: 'audio/mp3' })
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        memos = [...memos, { src: reader.result, title: tempTitle }]
      }
      clearTimeout(timeout)
    }

    const res = await fetch('/memos')

    if (res.ok) {
      initialFetchCompleted = true
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

  $: {
    if (initialFetchCompleted) {
      fetch('/memos', {
        method: 'PUT',
        body: JSON.stringify(memos)
      }).then((res) => {
        if (!res.ok) {
          console.error(JSON.stringify(res))
        }
      })
    }
  }
</script>

<main>
  <h1>Noice Memos</h1>
  <form class="new-recording">
    <label for="title"> Title </label>
    <input
      disabled={isRecording}
      id="title"
      type="text"
      bind:value={newTitle}
    />
    <button
      id="record-btn"
      disabled={newTitle.length === 0}
      class:isRecording
      on:click|preventDefault={record}
    >
      {isRecording ? 'Stop' : 'Record'}
    </button>
  </form>
  <div class="control-area">
    {#each memos as memo}
      <div class="memo" transition:slide={{ duration: 200 }}>
        <h2>{memo.title}</h2>
        <span style="display: flex; align-items: center; gap: 1rem;">
          <audio bind:this={audioEl} src={memo.src} controls />
          <button
            style="color: crimson;"
            on:click={() => (memos = memos.filter((m) => memo.src !== m.src))}
          >
            Delete
          </button>
        </span>
      </div>
    {/each}
  </div>
</main>

<style>
  button.isRecording {
    background-color: lightcoral;
  }

  button.isRecording:hover {
    background-color: rgb(202, 109, 109);
  }

  .memo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
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

  h2 {
    color: rgb(76, 0, 255);
  }
</style>
