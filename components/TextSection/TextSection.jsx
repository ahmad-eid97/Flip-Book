import { useState } from 'react';

import { useTranslation } from 'next-i18next';

import cls from './textSection.module.scss';
import { useEffect } from 'react';

const TextSection = ({ title, details }) => {
  const [text, setText] = useState('');
  const [readingTimer, setReadingTimer] = useState(0)
  const { i18n } = useTranslation()
 
  useEffect(() => {
    // let parser = new DOMParser();
    // let doc = parser.parseFromString(details, 'text/html');
    // setText(doc.body.firstChild.firstChild.innerHTML);
  }, [])

  let interval;

  const startHoverHandler = () => {
    let timer = 0;

    interval = setInterval(() => {
      timer += 1
    }, 1000)

    setReadingTimer(timer)
  }

  const endHoverHandler = () => {
    clearInterval(interval)
  }

  const test = () => {
    console.log(readingTimer)
  }

  return (
    <div className={cls.textSection}>

      <h5>{ title }</h5>

      <mark className={cls[i18n.language]} onMouseEnter={startHoverHandler} onMouseLeave={endHoverHandler} onClick={test}>{details}</mark>

      {/* <mark className={cls[i18n.language]} dangerouslySetInnerHTML={{ __html: details }}></mark> */}

    </div>
  )
}

export default TextSection;