import { useState, useRef } from 'react';

import ReactPlayer from 'react-player'

import { useTranslation } from 'react-i18next';

import cls from './previewModal.module.scss';

const PreviewModal = ({ setOpenPreview, imgSrc, previewType }) => {
  // COMPONENT HOOKS
  const [playedSeconds, setPlayedSeconds] = useState();
  const [userPauses, setUserPauses] = useState();
  const overlay = useRef();
  const { t: translate, i18n } = useTranslation('common');

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if(overlay.current === e.target) setOpenPreview(false)
  }

  const close = () => {
    setOpenPreview(false)
  }

  const videoProgrssHandler = (played) => {
    console.log(played)
    setPlayedSeconds(played.playedSeconds)
  }

  const videoPauseHanlder = () => {
    setUserPauses(prev => (prev += 1))
  }

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      <div className={cls.area}>

        <div className={cls.area__wrapper}>
          <div className={`${cls.close} ${cls[i18n.language]}`} onClick={close}>
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div container className={cls.area__content} spacing={3}>

            {previewType === 'image' ? 

              <img src={imgSrc} alt="Image" />

              :

              <ReactPlayer url={imgSrc} width='100%' onProgress={videoProgrssHandler} onPause={videoPauseHanlder} />

              // <iframe width="560" height="315" src={imgSrc} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          
            }

          </div>

        </div>
      </div>
    </div>
  )
}

export default PreviewModal;