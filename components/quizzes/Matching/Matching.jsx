import { useState, useRef, useEffect } from 'react';

import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './matching.module.scss';

const Matching = ({ question, setOpenQuizModal }) => {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [allAnswers, setAllAnswers] = useState([])
  const canvas = useRef();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();

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
    const FROM_PARENT = document.querySelector(`.${cls.list}`).getBoundingClientRect().top;
    let FROM_OPTION;
    if(selectedOption) FROM_OPTION = selectedOption.element.getBoundingClientRect().top;
    
    const TO_PARENT = document.querySelector(`.${cls.match}`).getBoundingClientRect().top;
    const TO_OPTION = e.target.getBoundingClientRect().top;

    // Check Answers
    if (selectedOption && selectedOption.answer.answer_two_gap_match !== ans) {
      setTimeout(() => {
        setOpenWrong(false)
      }, 4000)
      setOpenWrong(true)
      setWrongTries(prev => (prev += 1))
    } else {
      // Draw Correct Line
      drawCanvasLine(FROM_OPTION - FROM_PARENT + 5, TO_OPTION - TO_PARENT + 5);
      setAllAnswers(prev => [...prev, ans])
    }

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

  const submit = () => {
    console.log(allAnswers)
    console.log(question.answers.length)
    if(allAnswers.length < question.answers.length) {
      setTimeout(() => {
        setOpenWrong(false)
      }, 4000)
      setOpenWrong(true)
      setWrongTries(prev => (prev += 1))
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
    <div className={cls.matching}>

      <h6> 1 ) { question.title }</h6>

      <div className={`${cls.wrapper} wrapper`}>

        <div className={cls.list}>

          {options.map((answer, idx) => (

            <div key={idx} onClick={(e) => selectOption(e, answer)} className={cls.one}>

              <p className='A'><span>{ answer.title }</span></p>

            </div>

          ))}

        </div>

        <canvas id="matching_area" ref={canvas}></canvas>

        <div className={cls.match}>

          {question.answers.map((answer, idx) => (

            <div key={idx} className={cls.one}>
              <p className='B' onClick={(e) => drawLine(e, answer.answer_two_gap_match)}><span>{ answer.answer_two_gap_match }</span></p>
            </div>

          ))}

        </div>

      </div>

      {/* <div className={cls.btn}>

        <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

      </div> */}

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default Matching