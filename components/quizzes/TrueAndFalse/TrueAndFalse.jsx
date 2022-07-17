import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './trueAndFalse.module.scss';

const TrueAndFalse = ({ question, setOpenQuizModal }) => {
  const [answer, setAnswer] = useState('')
  const [state, setState] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);

  const checkAnswer = (check, answer) => {
    setState(check)
    setAnswer(answer)
  }

  const submit = () => {
    if (answer) {
      if(answer.is_correct === '1') {
        setTimeout(() => {
          setOpenSuccess(false)
          setOpenQuizModal(false)
        }, 4000)
        setOpenSuccess(true)
      } else {
        setTimeout(() => {
          setOpenWrong(false)
        }, 4000)
        setOpenWrong(true)
      }
    } else {
        setTimeout(() => {
          setOpenWrong(false)
        }, 4000)
        setOpenWrong(true)
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.trueAndFalse}>

      <div className={cls.question}>

        <h6> 1) { question.title }</h6>

        <div className={cls.checks}>

          <i className={`${state === true ? cls.correct : ''} fa-solid fa-check`} onClick={() => checkAnswer(true, question.answers[0])}></i>

          <i className={`${state === false ? cls.wrong : ''} fa-solid fa-xmark`} onClick={() => checkAnswer(false, question.answers[1])}></i>

        </div>

      </div>

      <div className={cls.btn}>

        <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default TrueAndFalse