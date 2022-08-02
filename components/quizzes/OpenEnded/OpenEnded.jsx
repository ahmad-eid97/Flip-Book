import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import axios from '../../../Utils/axios';

import Cookies from 'universal-cookie';

import cls from './openEnded.module.scss';

const cookie = new Cookies();

const OpenEnded = ({ question, setOpenQuizModal }) => {
  const [field, setField] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);

  const submit = async() => {
    const rightOrder = question.answers.map(answer => (answer.title))
    const answerArray = answers.map(answer => (answer.title))
    const data = {
      quiz_attempt_id: attemptIp,
      question_id: question.id,
      given_answer: field
    }

    console.log(data)

    const response = await axios.post(`/crm/students/quiz/answer_question`, data, {
      headers: {
        Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
      }
    }).catch(err => console.log(err));

    if(!response) return;
    
    // if(!field) {
    //   setTimeout(() => {
    //     setOpenWrong(false)
    //   }, 4000)
    //   setOpenWrong(true)
    //   setWrongTries(prev => (prev += 1))
    // } else {
    //   setTimeout(() => {
    //     setOpenSuccess(false)
    //     setOpenQuizModal(false)
    //   }, 4000)
    //   setOpenSuccess(true)
    // }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.openEnded}>

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

export default OpenEnded