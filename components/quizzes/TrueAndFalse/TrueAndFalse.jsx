import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import axios from '../../../Utils/axios';

import Cookies from 'universal-cookie';

import cls from './trueAndFalse.module.scss';

const cookie = new Cookies();

const TrueAndFalse = ({ question, setOpenQuizModal, attemptIp }) => {
  const [answer, setAnswer] = useState('')
  const [state, setState] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);

  const checkAnswer = (check, answer) => {
    setState(check)
    setAnswer(answer)
  }

  const submit = async () => {
    const data = {
      quiz_attempt_id: attemptIp,
      question_id: question.id,
      given_answer: answer
    }

    console.log(data)

    const response = await axios.post(`/crm/students/quiz/answer_question`, data, {
      headers: {
        Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
      }
    }).catch(err => console.log(err));

    if(!response) return;

    // if (answer) {
    //   if(answer.is_correct === '1') {
    //     setTimeout(() => {
    //       setOpenSuccess(false)
    //       setOpenQuizModal(false)
    //     }, 4000)
    //     setOpenSuccess(true)
    //   } else {
    //     setTimeout(() => {
    //       setOpenWrong(false)
    //     }, 4000)
    //     setOpenWrong(true)
    //     setWrongTries(prev => (prev += 1))
    //   }
    // } else {
    //     setTimeout(() => {
    //       setOpenWrong(false)
    //     }, 4000)
    //     setOpenWrong(true)
    //     setWrongTries(prev => (prev += 1))
    // }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.trueAndFalse}>

      <h6>ضع علامة صح او خطأ امام الاجابه المناسبه</h6>

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