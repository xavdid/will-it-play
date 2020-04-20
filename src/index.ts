import { ffprobe, FfprobeData, FfprobeStream } from 'fluent-ffmpeg'
// import Ffmpeg = require('fluent-ffmpeg')

import { extname } from 'path'

const knownInfo = {
  video: {
    good: new Set(['h264', 'mpeg4']),
    bad: new Set<string>(),
  },
  audio: {
    good: new Set(['mp3', 'aac', 'ac3']),
    bad: new Set(['eac3']),
  },
  extension: {
    good: new Set(['.mp4', '.avi', '.mkv']),
    bad: new Set<string>(),
  },
}

/**
 * given a path to a file, it returns ffmpeg info about that file
 */
const fetchInfoForVideoAtPath = async (path: string): Promise<FfprobeData> =>
  await new Promise((resolve, reject) => {
    ffprobe(path, (err, info) => {
      if (err) {
        reject(err)
      }
      resolve(info)
    })
  })

/**
 * return types will be a bool for definitely good/bad, but can also be undefined if we don't have definitive info
 */
const boolIfInfo = (good: Set<string>, bad: Set<string>, value: string) => ({
  value,
  valid: good.has(value) ? true : bad.has(value) ? false : undefined,
})

const getCompatibilityInfoFromPath = (path: string) =>
  boolIfInfo(knownInfo.extension.good, knownInfo.extension.bad, extname(path))

const getCompatibilityInfoFromStream = (
  type: 'audio' | 'video',
  streams: FfprobeStream[]
): { valid?: boolean; value?: string } => {
  const stream = streams.find((stream) => stream.codec_type === type)
  if (stream?.codec_name) {
    return boolIfInfo(
      knownInfo[type].good,
      knownInfo[type].bad,
      stream.codec_name
    )
  } else {
    return { value: undefined, valid: undefined }
  }
}

const parseVideoInfo = (
  path: string,
  { streams }: FfprobeData
): {
  video: { valid?: boolean; value?: string }
  audio: { valid?: boolean; value?: string }
  extension: { valid?: boolean; value: string }
} => ({
  video: getCompatibilityInfoFromStream('video', streams),
  audio: getCompatibilityInfoFromStream('audio', streams),
  extension: getCompatibilityInfoFromPath(path),
})

fetchInfoForVideoAtPath(process.argv[2])
  .then((info) => {
    console.log(parseVideoInfo(process.argv[2], info))
  })
  .catch((err: Error) => {
    if (err.message.toLowerCase().includes('cannot find ')) {
      console.error(
        'You may not have `ffmpeg` installed, make sure to install it!'
      )
    } else if (err.message.toLowerCase().includes('FFmpeg developers')) {
      // errors are the entire output block. we really only want the first and last lines, which includes the helpful info in brief testing
      const errorLines = err.message.trim().split('\n')
      console.error(
        `ERR: ${errorLines[0]}. More info is hopefully below.\n\n> ${
          errorLines[errorLines.length - 1]
        }`
      )
    } else {
      console.error(err)
    }
    process.exitCode = 1
  })
