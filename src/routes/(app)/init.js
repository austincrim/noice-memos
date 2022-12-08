export async function init() {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  let ctx = new AudioContext()
  let source = ctx.createMediaStreamSource(stream)
  let dest = ctx.createMediaStreamDestination()
  let recorder = new MediaRecorder(dest.stream)
  source.connect(dest)

  return recorder
}
