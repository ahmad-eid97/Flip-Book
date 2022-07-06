import { useState, useRef, useEffect } from 'react';

import { toast } from 'react-toastify';

import cls from './matching.module.scss';

const Matching = ({ question, setOpenQuizModal }) => {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const [allAnswers, setAllAnswers] = useState([])
  const canvas = useRef();

  const drawCanvasLine = (from, to) => {
    const ctx = canvas.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, from);
    ctx.lineTo(300, to);
    ctx.stroke();
  }

  const selectOption = (e, answer) => {
    setSelectedOption({ element: e.target, answer });
  }

  const drawLine = (e, ans) => {
    const FROM_PARENT = document.querySelector(`.${cls.list}`).getBoundingClientRect().top;
    const FROM_OPTION = selectedOption.element.getBoundingClientRect().top;
    
    const TO_PARENT = document.querySelector(`.${cls.match}`).getBoundingClientRect().top;
    const TO_OPTION = e.target.getBoundingClientRect().top;

    // Check Answers
    if (selectedOption.answer.answer_two_gap_match !== ans) {
      return errorNotify('Wrong selection, try again!')
    }

    // Draw Correct Line
    drawCanvasLine(FROM_OPTION - FROM_PARENT + 10, TO_OPTION - TO_PARENT + 10);
    setAllAnswers(prev => [...prev, ans])
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
      errorNotify('Select all answers before submit!')
    } else {
      setOpenQuizModal(false)
      successNotify('Bravo, the answer is right')
    }
  }
  
  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.matching}>

      <h6>{ question.title }</h6>

      <div className={`${cls.wrapper} wrapper`}>

        <div className={cls.list}>

          {options.map((answer, idx) => (

            <div key={idx} onClick={(e) => selectOption(e, answer)}>

              <p className='A'>{ answer.title }</p>

            </div>

          ))}

        </div>

        <canvas id="matching_area" ref={canvas}></canvas>

        <div className={cls.match}>

          {question.answers.map((answer, idx) => (

            <p className='B' onClick={(e) => drawLine(e, answer.answer_two_gap_match)} key={idx}>{ answer.answer_two_gap_match }</p>

          ))}

        </div>

      </div>

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default Matching