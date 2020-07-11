import ding_low from 'assets/ding_low.mp3'
import ding_high from 'assets/ding_high.mp3'
import { Howl } from 'howler'

const lowDing = new Howl({
  src: [ding_low],
  format: ['mp3'],
  html5: true,
  autoplay: false,
})

const highDing = new Howl({
  src: [ding_high],
  format: ['mp3'],
  html5: true,
  autoplay: false,
})

export {
  lowDing,
  highDing,
}
