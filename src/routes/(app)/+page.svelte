<script lang="ts">
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { invalidate } from '$app/navigation'
  import { init } from './init'
  import { enhance } from '$app/forms'

  export let data

  let isRecording = false,
    recorder: MediaRecorder,
    chunks: Blob[] = []

  onMount(async () => {
    // setup MediaRecorder
    recorder = await init()

    let timeout
    recorder.onstart = (e) => {
      timeout = setTimeout(() => {
        let button = document.getElementById('record-btn')
        if (!button) return
        button.click()
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
        let res = await fetch('/memo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ src: reader.result, title: tempTitle })
        })
        tempTitle = ''
        if (res.ok) invalidate('memos:load')
      }
      clearTimeout(timeout)
    }
  })

  let tempTitle = ''
  function record(e) {
    if (!isRecording) {
      tempTitle = e.target.title.value
      chunks = []
      recorder.start()
      isRecording = true
    } else {
      recorder.stop()
      isRecording = false
      e.target.reset()
    }
  }
</script>

<main>
  <form on:submit|preventDefault={record} class="new-recording">
    <label class="font-semibold" for="title"> Title </label>
    <input
      id="title"
      name="title"
      type="text"
      disabled={isRecording}
      class="p-2"
      required
    />
    <button id="record-btn" class:isRecording>
      {isRecording ? 'Stop' : 'Record'}
    </button>
  </form>
  <div class="control-area">
    {#each data?.memos as memo}
      <div class="memo" transition:slide={{ duration: 200 }}>
        <h2>{memo.title}</h2>
        <span class="flex items-center gap-4">
          <audio src={memo.src} controls />
          <form use:enhance action="?/delete" method="POST">
            <button class="text-red-500"> Delete </button>
            <input name="key" type="hidden" value={memo.r2Key} />
          </form>
        </span>
      </div>
    {/each}
  </div>
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

  button.isRecording {
    background-color: theme('colors.red.400');
  }

  button.isRecording:hover {
    background-color: theme('colors.red.300');
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
    width: 50%;
    margin-inline: auto;
  }
</style>
