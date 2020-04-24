# will-it-play (on a PS4)

I was tired of having local home video files not play on my **Playstation 4**. Now at least I'll know that's the case before I get all the way to the console w/ a flash drive.

## Installation

```
yarn global add will-it-play
```

or using your JS package manager of choice.

You must also have `ffmpeg` available. Follow [these](https://www.ffmpeg.org/download.html) instructions to download it and [these](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/blob/12667091eeea09b0d6a55b87eb886aa131178608/README.md#ffmpeg-and-ffprobe) to ensure the `ffmpeg` binary is available at runtime.

## Usage

This is best used as a CLI tool:

```
% will-it-play ~/Desktop/raindrops.mp4
raindrops.mp4: ✅

% will-it-play ~/Desktop/raindrops-bad-video.ogv
raindrops-bad-video.ogv: ❌
```

There's also detailed mode, which tells you why a video will or won't play:

```
% will-it-play ~/Desktop/raindrops-bad-video.ogv -d
raindrops-bad-video.ogv: ❌
┌───────────┬────────┬────────┐
│ Factor    │ Value  │ Valid? │
├───────────┼────────┼────────┤
│ video     │ theora │ ⚠️     │
├───────────┼────────┼────────┤
│ audio     │ vorbis │ ⚠️     │
├───────────┼────────┼────────┤
│ extension │ .ogv   │ ❌     │
└───────────┴────────┴────────┘
```

It can also be used by its' JS/TS API:

```ts
import { willItPlay } from 'will-it-play'

willItPlay('~/Desktop/raindrops.mp4').then((result) => {
  if (result.videoWillPlay) {
    console.log('Yes!')
  } else if (result.videoWillPlay === false) {
    console.log('No.')
  } else {
    console.log('Maybe?')
  }
  // detailed info is found at `result.info`
})
```

See [the CLI source](https://github.com/xavdid/will-it-play/blob/master/src/cli.ts) for a more complete example of the code usage.

## Improvements

There are probably a lot of audio and video codecs you might have files in. If you see a lot of "⚠️" when using this tool and know for sure if the file does or doesn't play, kindly [file an issue](https://github.com/xavdid/will-it-play/issues) with that information.

## etc

Copyright-free test video provided by [this entry on pexels.com](https://www.pexels.com/video/raindrops-3813820/).
