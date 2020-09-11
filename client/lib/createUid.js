export default function createUid() {
  return (new Date().getUTCMilliseconds().toString() + new Date().getTime().toString()).toString()
    + Math.random().toString(36).substr(2, 9)
}
