<script lang="ts">
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { invalidate } from '$app/navigation'
  import type { PageData } from './$types'
  import { init } from './init'
  import { enhance } from '$app/forms'

  export let data: PageData

  let isRecording = false,
    recorder: MediaRecorder,
    chunks: Blob[] = [],
    newTitle = '',
    tempTitle = ''

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
        if (res.ok) invalidate('memos:load')
      }
      clearTimeout(timeout)
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
  <form class="new-recording">
    <label class="font-semibold" for="title"> Title </label>
    <input
      id="title"
      type="text"
      disabled={isRecording}
      class="p-2"
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
    {#each data?.memos as memo}
      <div class="memo" transition:slide={{ duration: 200 }}>
        <h2>{memo.title}</h2>
        <span style="display: flex; align-items: center; gap: 1rem;">
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
    width: 50%;
    margin-inline: auto;
  }
</style>
