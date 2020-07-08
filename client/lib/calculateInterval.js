export default function calculateInterval(length) {
  let interval = Math.floor(10000 / length)
  if (interval > 1000) interval = 1000
  return interval
}
