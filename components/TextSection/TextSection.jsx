import { useState } from 'react';

import { useTranslation } from 'next-i18next';

import cls from './textSection.module.scss';
import { useEffect } from 'react';

import axios from '../../Utils/axios';

import Cookies from 'universal-cookie';

import { format } from 'date-fns';

const cookie = new Cookies()

const TextSection = ({ title, details, sectionId }) => {
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState()
  const [readingTimer, setReadingTimer] = useState(0)
  const { i18n } = useTranslation()
 
  useEffect(() => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(details, 'text/html');
    setText(doc.body.firstChild.innerHTML)
  }, [])

  let interval;

  const startHoverHandler = () => {
    let timer = 0;

    setStartTime(Date.now())

    interval = setInterval(() => {
      timer += 1
      setReadingTimer(timer)
    }, 1000)
  }

  const endHoverHandler = async () => {
    clearInterval(interval)

    const trackData = {
      page_section_id: sectionId,
      event_category: 'text',
      event_action: 'reading',
      session_start_time: format(startTime, 'yyyy-mm-dd hh:mm'),
      session_end_time: format(Date.now(), 'yyyy-mm-dd hh:mm'),
      total_time: readingTimer
    }

    const response = await axios.post('/crm/students/book_reports', trackData, {
      headers: {
        Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
      }
    }).catch(err => console.log(err));

    if(!response) return;
  }

  return (
    <div className={cls.textSection}>

      {/* <h5>{ title }</h5> */}

      <mark className={cls[i18n.language]} onMouseEnter={startHoverHandler} onMouseLeave={endHoverHandler}>{text}</mark>

      {/* <mark className={cls[i18n.language]} dangerouslySetInnerHTML={{ __html: details }}></mark> */}

    </div>
  )
}

export default TextSection;