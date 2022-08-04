import { useState, useRef, useEffect } from 'react';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import axios from '../../../Utils/axios';

import Cookies from 'universal-cookie';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './matching.module.scss';

const cookie = new Cookies();

const Matching = ({ question, setOpenQuizModal, attemptId, questionNum, setQuestionNum, questionsNum }) => {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [allAnswers, setAllAnswers] = useState([])
  const canvas = useRef();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false)

  const drawCanvasLine = (from, to) => {
    const ctx = canvas.current.getContext('2d');
    ctx.beginPath();
    if(i18n.language === 'ar') {
      ctx.moveTo(0, to);
      ctx.lineTo(300, from);
    } else {
      ctx.moveTo(0, from);
      ctx.lineTo(300, to);
    }
    ctx.stroke();
  }

  const selectOption = (e, answer) => {
    setSelectedOption({ element: e.target, answer });
  }

  const drawLine = (e, ans) => {
    const FROM_PARENT = document.querySelector(`.${cls.list}`).offsetTop;
    let FROM_OPTION;
    if(selectedOption) FROM_OPTION = selectedOption.element.offsetTop - FROM_PARENT;
    
    const TO_PARENT = document.querySelector(`.${cls.match}`).offsetTop;
    const TO_OPTION = e.target.offsetTop - TO_PARENT;

    // Check Answers
    // if (selectedOption && selectedOption.answer.answer_two_gap_match !== ans) {
    //   setTimeout(() => {
    //     setOpenWrong(false)
    //   }, 4000)
    //   setOpenWrong(true)
    //   setWrongTries(prev => (prev += 1))
    // } else {
      // Draw Correct Line
      console.log(selectedOption.element.getBoundingClientRect().top, FROM_PARENT)
      drawCanvasLine(FROM_OPTION, TO_OPTION);

      console.log([...allAnswers, ans])

      setAllAnswers(prev => [...prev, ans])

      console.log(ans)
    // }

  }

  useEffect(() => {

    var randomOptions = [];

    for(var index = 0; index < question.answers.length; index++) {
      var randomNum = Math.floor(Math.random() * question.answers.length);

      if(randomOptions.find(option => option.id === question.answers[randomNum].id)) {
        index--;
        continue;
      }
      randomOptions.push(question.answers[randomNum])

    }

    setOptions(randomOptions)

  }, [])

  const submit = async () => {

    if(allAnswers.length) {
      if(questionsNum === questionNum) {
        setOpenQuizModal(false)
      } else {
        setQuestionNum(questionNum += 1)
        setChanging(true)
      }

      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: allAnswers.map(answer => answer.id)
      }

      const response = await axios.post(`/crm/students/quiz/answer_question`, data, {
        headers: {
          Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
        }
      }).catch(err => console.log(err));

      if(!response) return;

    }

    // if(allAnswers.length < question.answers.length) {
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
    <div className={`${cls.matching} ${changing && cls.animation}`}>

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

      <h6> 1 ) { question.title }</h6>

      <div className={`${cls.wrapper} wrapper`}>

        <div className={cls.match}>

          {question.answers.map((answer, idx) => (

            <div key={idx} onClick={(e) => selectOption(e, answer)} className={cls.one}>
              <p className='B'><span>{ answer.title }</span></p>
            </div>

          ))}

        </div>

        <canvas id="matching_area" ref={canvas}></canvas>

        <div className={cls.list}>

          {options.map((answer, idx) => (

            <div key={idx} onClick={(e) => selectOption(e, answer)} className={cls.one}>

              <p className='A' onClick={(e) => drawLine(e, answer)}><span>{ answer.answer_two_gap_match }</span></p>

            </div>

          ))}

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

export default Matching