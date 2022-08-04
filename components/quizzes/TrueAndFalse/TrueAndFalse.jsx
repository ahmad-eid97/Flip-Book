import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import axios from '../../../Utils/axios';

import { useTranslation } from 'react-i18next';

import Cookies from 'universal-cookie';

import cls from './trueAndFalse.module.scss';

const cookie = new Cookies();

const TrueAndFalse = ({ question, setOpenQuizModal, attemptId, questionNum, setQuestionNum, questionsNum }) => {
  const [answer, setAnswer] = useState('')
  const [state, setState] = useState('')
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation()
  const [changing, setChanging] = useState(false)

  const checkAnswer = (check, answer) => {
    setState(check)
    setAnswer(answer)
  }

  const currentAnswer = ''
  Object.keys(question.answers).forEach(key => {
    if(question.answers[key].answer_two_gap_match === `${state}`) {
      console.log(`the answer is ${question.answers[key].id}`)
    }
  })

  const submit = async () => {
    const currentAnswer = ''
    Object.keys(question.answers).forEach(key => {
      if(question.answers[key].answer_two_gap_match === `${state}`) {
        currentAnswer = question.answers[key].id
      }
    })

    if(currentAnswer) {
      if(questionsNum === questionNum) {
        setOpenQuizModal(false)
      } else {
        setQuestionNum(questionNum += 1)
        setChanging(true)
      }

      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: currentAnswer
      }

      const response = await axios.post(`/crm/students/quiz/answer_question`, data, {
        headers: {
          Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
        }
      }).catch(err => console.log(err));

      if(!response) return;

    }

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
    <div className={`${cls.trueAndFalse} ${changing && cls.animation}`}>

      <div className='stepper'>

        <div className='step'>
          <p>{questionNum}</p>
          <span>السؤال الحالي</span>
        </div>

        {/* <div className='line'></div> */}

        <div className='lastStep'>
          <p>{questionsNum}</p>
          <span>عدد الاسئلة</span>
        </div>

      </div>

      <h6>ضع علامة صح او خطأ امام الاجابه المناسبه</h6>

      <div className={cls.question}>

        <h6> 1) { question.title }</h6>

        <div className={cls.checks}>

          <i className={`${state === true ? cls.correct : ''} fa-solid fa-check`} onClick={() => checkAnswer(true, question.answers[0])}></i>

          <i className={`${state === false ? cls.wrong : ''} fa-solid fa-xmark`} onClick={() => checkAnswer(false, question.answers[1])}></i>

        </div>

      </div>

      <div className={cls.btn}>

        {questionsNum === questionNum ? 
          <button onClick={submit}>تأكيد <i className="fa-light fa-badge-check"></i></button>
          :
          <button onClick={submit}>التالي <i className={`${cls[i18n.language]} ${cls.next} fa-light fa-circle-right`}></i></button>
        }

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default TrueAndFalse