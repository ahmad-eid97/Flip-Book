import cls from './videoSection.module.scss';

const VideoSection = ({ video, openModal }) => {

  const openPreview = (state, data, type) => {
    openModal(state, data, type)
  }

  return (
    <div className={cls.videoSection}>
      
      <button onClick={() => openPreview(true, video, 'video')}><iframe style={{ pointerEvents: 'none', borderRadius: '5px', margin: 'auto' }} width="90%" height="415" src={video} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></button>

    </div>
  )
}

export default VideoSection