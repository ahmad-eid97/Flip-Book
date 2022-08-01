/* eslint-disable @next/next/no-img-element */
import cls from './videoSection.module.scss';

const VideoSection = ({ video, openModal, data }) => {

  console.log(data)

  const openPreview = (state, data, type) => {
    openModal(state, data, type)
  }

  return (
    <div className={cls.videoSection}>
      <span>{data.title}</span>
      <button className='wrapper' onClick={() => openPreview(true, video, 'video')}>
        <img src="/imgs/video.png" alt="" />
      </button>
    </div>
  )
}

export default VideoSection