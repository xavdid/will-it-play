import { willItPlay } from './index'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json')
import commander = require('commander')

const program = new commander.Command()

program
  .version(version)
  .usage('PATHS...')
  .description('Find out if a given video file will play on a PS4')
  .parse(process.argv)

const main = async () => {
  if (!program.args.length) {
    console.error('ERR: must supply at least one path')
    process.exitCode = 1
    return
  }

  const results = await Promise.all(program.args.map(willItPlay))

  console.log(results)
}

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
