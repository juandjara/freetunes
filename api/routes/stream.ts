import axios from 'axios'
import { Request, Response } from 'express'
import getAudioStreamDetails from '../lib/getAudioStreamDetails'

export async function stream(req: Request, res: Response) {
  const id = req.params.ytid
  const streamDef = await getAudioStreamDetails(id, 'audio/webm')
  const response = await axios.get(streamDef.url, { responseType: 'stream' })
  const axiosStream = response.data
  axiosStream.on('error', (err: Error) => {
    console.error('Error streaming youtube response data', err)
    res.status(500).json({ error: err })
  })

  // @ts-ignore
  res.sendSeekable(axiosStream, {
    type: 'audio/webm',
    length: Number(streamDef.clen)
  })
}
