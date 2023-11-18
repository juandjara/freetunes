import axios from 'axios'
import config from './config'

export default async function getAudioStreamDetails(id: string, mime: string) {
  const url = config.detailUrlTemplate.replace('{id}', id)
  const resp = await axios.get(url)
  const title = resp.data.title
  const streams = resp.data.adaptiveFormats
  const audioStreams = streams
    .filter((s: any) => s.type.startsWith(mime))
    .map((s: any) => ({ ...s, title }))
    .sort((a: any, b: any) => Number(b.bitrate) - Number(a.bitrate))

  return audioStreams[0]
}
