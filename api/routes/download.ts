import axios from 'axios'
import { Request, Response } from 'express'
import getAudioStreamDetails from '../lib/getAudioStreamDetails'
import through from 'through2'
import FFmpeg from 'fluent-ffmpeg'
import { PassThrough } from 'stream'

export default async function download(req: Request, res: Response) {
  try {
    const id = req.params.ytid
    const streamDef = await getAudioStreamDetails(id, 'audio/webm')
    await downloadAudio(streamDef, res)
  } catch (err: any) {
    console.error('Error downloading audio', err)
    res.status(500).json({ error: err.response ? err.response : err.message })
  }
}

async function downloadAudio(streamDef: any, res: Response) {
  const response = await axios.get(streamDef.url, { responseType: 'stream' })
  const axiosStream = response.data as PassThrough
  axiosStream.on('error', (err: Error) => {
    console.error('error streaming youtube response data', err)
    res.status(500).json({ error: err })
  })

  const ffmpegStream = convertToMP3(axiosStream, streamDef.title)
  ffmpegStream.on('error', (err: Error) => {
    console.error('error converting youtube stream to MP3 with FFmpeg', err)
    res.status(500).json({ error: err })
  })

  res.setHeader('Content-disposition', `attachment; filename="${streamDef.title}.mp3"`)
  res.setHeader('Content-type', 'audio/mpeg')
  res.setHeader('Content-Length', streamDef.clen)
  ffmpegStream.pipe(res)
}

function convertToMP3(inputStream: PassThrough, title: string) {
  const initTime = Date.now()
  const outputStream = through()
  const proc = FFmpeg({ source: inputStream })

  proc.withAudioCodec('libmp3lame').toFormat('mp3').pipe(outputStream)

  proc.on('start', function () {
    console.log(`FFmpeg proccess started for ${title}`)
  })

  proc.on('end', function () {
    const endTime = Date.now()
    const time = (endTime - initTime) / 1000
    console.log(`FFmpeg proccess finished for ${title}`)
    console.log(`FFmpeg proccess took ${time.toFixed(3)} seconds`)
  })

  proc.on('error', function (err) {
    inputStream.end()
    outputStream.emit('error', err)
  })

  return outputStream
}
