/* eslint-disable @next/next/no-img-element */
import cls from './videoSection.module.scss';

const VideoSection = ({ video, openModal, data }) => {

  const openPreview = (state, data, type) => {
    openModal(state, data, type)
    console.log(state)
    console.log(data)
    console.log(type)
  }

  return (
    <div className={cls.videoSection}>
      {data && <span>{data.title}</span>}
      <button className='wrapper' onClick={() => openPreview(true, video, 'video')}>
        <img src="/imgs/video.png" alt="" />
      </button>
    </div>
  )
}

export default VideoSection