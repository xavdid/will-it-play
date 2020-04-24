import { willItPlay } from '..'
import { join } from 'path'

describe('index', () => {
  describe('willItPlay', () => {
    const tests = [
      {
        path: 'raindrops.mp4',
        result: { video: true, audio: true, extension: true },
        overall: true,
      },
      {
        path: 'raindrops-bad-video.ogv',
        result: { video: undefined, audio: undefined, extension: false },
        overall: false,
      },
      {
        path: 'raindrops-bad-video.mkv',
        result: { video: undefined, audio: undefined, extension: true },
        overall: undefined,
      },
    ]

    tests.forEach(({ path, result, overall }) => {
      it(`video ${path} should${
        overall ? '' : overall === false ? ' not' : ' maybe'
      } play`, async () => {
        const { videoWillPlay, info } = await willItPlay(
          join(__dirname, '..', '..', 'assets', path)
        )

        expect(videoWillPlay).toEqual(overall)
        expect(info.video.valid).toEqual(result.video)
        expect(info.audio.valid).toEqual(result.audio)
        expect(info.extension.valid).toEqual(result.extension)
      })
    })
  })
})
