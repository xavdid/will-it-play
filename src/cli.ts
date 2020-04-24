#!/usr/bin/env node

import { basename } from 'path'
import { ValidityInfo, willItPlay } from './index'
import commander = require('commander')
import Table = require('cli-table3')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')

// ###################################################

const emojiResult = (willPlay: boolean | undefined) =>
  willPlay ? '✅' : willPlay === false ? '❌' : '⚠️'

const formatDetailedResult = (info: ValidityInfo) => {
  const table = new Table()
  table.push(['Factor', 'Value', 'Valid?'])
  Object.entries(info).forEach(([factor, { valid, value }]) => {
    table.push([factor, value || 'unknown', emojiResult(valid)])
  })
  return table.toString()
}

// ####################################

const program = new commander.Command()

program
  .version(version)
  .usage('PATHS...')
  .option('-d, --detailed', 'get detailed video info')
  .description('Find out if a given video file will play on a PS4')
  .parse(process.argv)

const main = async () => {
  if (!program.args.length) {
    console.error('ERR: must supply at least one path')
    process.exitCode = 1
    return
  }

  const results = await Promise.all(
    program.args.map(async (path) => ({
      path,
      result: await willItPlay(path),
    }))
  )

  results.forEach(({ path, result }) => {
    console.log(
      `${basename(path)}: ${emojiResult(result.videoWillPlay)} ${
        program.detailed ? `\n${formatDetailedResult(result.info)}` : ''
      }\n`
    )
  })
}

// ###########################

main().catch((err: Error) => {
  if (err.message.toLowerCase().includes('cannot find ')) {
    console.error(
      'You may not have `ffmpeg` installed, make sure to install it!'
    )
  } else if (err.message.toLowerCase().includes('ffmpeg developers')) {
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
