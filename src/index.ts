import { ffprobe, FfprobeData, FfprobeStream } from 'fluent-ffmpeg'
import { boolIfInfo, ValidityInfo, videoWillPlay } from './utils'

import { extname } from 'path'
export { ValidityInfo } from './utils'

// see: https://manuals.playstation.net/document/en/ps4/music/mp_format_m.html
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
const fetchInfoForVideoAtPath = async (path: string): Promise<FfprobeData> => {
  return await new Promise((resolve, reject) => {
    ffprobe(path, (err, info) => {
      if (err) {
        reject(err)
      }
      resolve(info)
    })
  })
}

// this one is a little special - there's a short list of extensions that work, so we can just do a bool
const getCompatibilityInfoFromPath = (path: string) => {
  const res = boolIfInfo(
    knownInfo.extension.good,
    knownInfo.extension.bad,
    extname(path)
  )
  if (!res.valid) {
    res.valid = false
  }
  return res
}
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
): ValidityInfo => ({
  video: getCompatibilityInfoFromStream('video', streams),
  audio: getCompatibilityInfoFromStream('audio', streams),
  extension: getCompatibilityInfoFromPath(path),
})

export const willItPlay = async (path: string) => {
  const probeData = await fetchInfoForVideoAtPath(path)
  const info = parseVideoInfo(path, probeData)
  return { videoWillPlay: videoWillPlay(info), info }
}
