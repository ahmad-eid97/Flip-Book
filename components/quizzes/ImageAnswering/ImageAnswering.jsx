import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './imageAnswering.module.scss';


const ImageAnswering = ({ question, setOpenQuizModal }) => {
  const [fields, setFields] = useState({})
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);

  const changeFields = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value
    })
  }

  const submit = () => {

    if(Object.keys(fields).length && Object.values(fields).length) {
      const rightAnswers = Object.keys(fields);
      const studentAnswers = Object.values(fields);

      if(rightAnswers.every((val, index) => val === studentAnswers[index])) {
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

    }
  }
  
  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.imageAnswering}>

      <h6> 1) { question.title }</h6>

      <div className={cls.answers}>

        {question.answers.map((answer, idx) => (

          <div key={idx} className={cls.one}>

            <img src={answer.answer_img} alt="answerImage" />

            <input type="text" placeholder='Type answer' name={answer.title} onChange={(e) => changeFields(e)} />

          </div>

        ))}

      </div>

      <div className={cls.btn}>

        <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default ImageAnswering