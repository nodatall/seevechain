export default function calculateInterval(length) {
  let interval = Math.floor(14000 / length)
  if (interval > 2000) interval = 2000
  return interval
}
