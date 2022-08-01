import { useState, useRef } from 'react';

import ReactPlayer from 'react-player'

import { useTranslation } from 'react-i18next';

import axios from '../../../Utils/axios';

import Cookies from 'universal-cookie';

import { format } from 'date-fns';

import cls from './previewModal.module.scss';

const cookie = new Cookies()

const PreviewModal = ({ setOpenPreview, imgSrc, previewType, sectionId }) => {
  // COMPONENT HOOKS
  const [playedSeconds, setPlayedSeconds] = useState();
  const [userPauses, setUserPauses] = useState();
  const [startTime, setStartTime] = useState()
  const overlay = useRef();
  const { t: translate, i18n } = useTranslation('common');

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if(overlay.current === e.target) setOpenPreview(false)
  }

  const close = async () => {
    setOpenPreview(false)

    if(playedSeconds) {
      const trackData = {
        page_section_id: sectionId,
        event_category: 'video',
        event_action: 'pause',
        session_start_time: format(Date.now(), 'yyyy-mm-dd hh:mm'),
        session_end_time: format(Date.now(), 'yyyy-mm-dd hh:mm'),
        total_time: 0
      }
  
      const response = await axios.post('/crm/students/book_reports', trackData, {
        headers: {
          Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
        }
      }).catch(err => console.log(err));
  
      if(!response) return;
  
      console.log(response)
    }
  }

  const videoProgrssHandler = async (played) => {
    console.log(played)
    setPlayedSeconds(played.playedSeconds)
    setStartTime(Date.now())
  }

  const videoPauseHanlder = async () => {
    setUserPauses(prev => (prev += 1))

    const trackData = {
      page_section_id: sectionId,
      event_category: 'video',
      event_action: 'play',
      session_start_time: format(startTime, 'yyyy-mm-dd hh:mm'),
      session_end_time: format(Date.now(), 'yyyy-mm-dd hh:mm'),
      total_time: playedSeconds
    }

    const response = await axios.post('/crm/students/book_reports', trackData, {
      headers: {
        Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
      }
    }).catch(err => console.log(err));

    if(!response) return;

    console.log(response)

    const trackData2 = {
      page_section_id: sectionId,
      event_category: 'video',
      event_action: 'pause',
      session_start_time: format(Date.now(), 'yyyy-mm-dd hh:mm'),
      session_end_time: format(Date.now(), 'yyyy-mm-dd hh:mm'),
      total_time: 0
    }

    const response2 = await axios.post('/crm/students/book_reports', trackData2, {
      headers: {
        Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
      }
    }).catch(err => console.log(err));

    if(!response2) return;

    console.log(response2)
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