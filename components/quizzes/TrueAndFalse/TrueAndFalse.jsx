import { useState } from 'react';

import { toast } from 'react-toastify';

import cls from './trueAndFalse.module.scss';

const TrueAndFalse = ({ question, setOpenQuizModal }) => {
  const [answer, setAnswer] = useState('')
  const [state, setState] = useState('')

  const checkAnswer = (check, answer) => {
    setState(check)
    setAnswer(answer)
  }

  const submit = () => {
    if (answer) {
      if(answer.is_correct === '1') {
        successNotify('Bravo, the answer is right')
        setOpenQuizModal(false)
      } else {
        errorNotify('OPS, wrong answer! try again')
      }
    } else {
      errorNotify('Solve questions before submit')
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.trueAndFalse}>

      <div className={cls.question}>

        <h6>{'=>' + question.title }</h6>

        <div className={cls.checks}>

          <i className={`${state === true ? cls.correct : ''} fa-solid fa-check`} onClick={() => checkAnswer(true, question.answers[0])}></i>

          <i className={`${state === false ? cls.wrong : ''} fa-solid fa-xmark`} onClick={() => checkAnswer(false, question.answers[1])}></i>

        </div>

      </div>

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default TrueAndFalse