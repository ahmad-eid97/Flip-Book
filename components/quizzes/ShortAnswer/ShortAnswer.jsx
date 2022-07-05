import { useState } from 'react';

import { toast } from 'react-toastify';

import cls from './shortAnswer.module.scss';

const ShortAnswer = ({ question, setOpenQuizModal }) => {
  const [field, setField] = useState('')

  const submit = () => {
    
    if(!field) {
      errorNotify('OPS, wrong answer! try again')
    } else {
      successNotify('Bravo, the answer is right')
      setOpenQuizModal(false)
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.shortAnswer}>

      <h6>{'=>' + question.title }</h6>

      <input type="text" placeholder='Type your answer' value={field} onChange={(e) => setField(e.target.value)} />

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default ShortAnswer