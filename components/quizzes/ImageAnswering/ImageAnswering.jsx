import { useState } from 'react';

import { toast } from 'react-toastify';

import cls from './imageAnswering.module.scss';


const ImageAnswering = ({ question, setOpenQuizModal }) => {
  const [fields, setFields] = useState()

  const changeFields = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value
    })
  }

  const submit = () => {
    const rightAnswers = Object.keys(fields);
    const studentAnswers = Object.values(fields);

    if(rightAnswers.every((val, index) => val === studentAnswers[index])) {
      successNotify('Bravo, the answer is right')
      setOpenQuizModal(false)
    } else {
      errorNotify('OPS, wrong answer! try again')
    }
    console.log(fields)
  }
  
  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.imageAnswering}>

      <h6>{'=>' + question.title }</h6>

      <div className={cls.answers}>

        {question.answers.map((answer, idx) => (

          <div key={idx} className={cls.one}>

            <img src={answer.answer_img} alt="answerImage" />

            <input type="text" name={answer.title} onChange={(e) => changeFields(e)} />

          </div>

        ))}

      </div>

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default ImageAnswering