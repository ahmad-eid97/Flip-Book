import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './shortAnswer.module.scss';

const ShortAnswer = ({ question, setOpenQuizModal }) => {
  const [field, setField] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);

  const submit = () => {
    
    if(!field) {
      setTimeout(() => {
        setOpenWrong(false)
      }, 4000)
      setOpenWrong(true)
    } else {
      setTimeout(() => {
        setOpenSuccess(false)
        setOpenQuizModal(false)
      }, 4000)
      setOpenSuccess(true)
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.shortAnswer}>

      <h6> 1) { question.title }</h6>

      <input type="text" placeholder='Type your answer' value={field} onChange={(e) => setField(e.target.value)} />

      <div className={cls.btn}>

        <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default ShortAnswer