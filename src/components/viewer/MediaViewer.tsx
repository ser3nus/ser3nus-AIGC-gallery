import type { WorkEntry } from '@/lib/types'
import ImageViewer from './ImageViewer'
import VideoPlayer from './VideoPlayer'
import AudioPlayer from './AudioPlayer'
import TextRenderer from './TextRenderer'

export default function MediaViewer({ work }: { work: WorkEntry }) {
  switch (work.type) {
    case 'image': return <ImageViewer src={work.src} alt={work.title} />
    case 'video': return <VideoPlayer src={work.src} />
    case 'audio': return <AudioPlayer src={work.src} />
    case 'text': return <TextRenderer src={work.src} description={work.description} />
    default: return <p className="text-warm-400">不支持的媒体类型</p>
  }
}
