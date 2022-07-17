import { useState } from 'react';

import cls from './textSection.module.scss';
import { useEffect } from 'react';

const TextSection = ({ title, details }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(details, 'text/html');
    setText(doc.body.firstChild.firstChild.innerHTML);
  }, [])

  return (
    <div className={cls.textSection}>

      <h5>{ title }</h5>

      <mark>{text}</mark>

    </div>
  )
}

export default TextSection;