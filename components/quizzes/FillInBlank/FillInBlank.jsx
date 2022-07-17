import { useState } from 'react';

import { toast } from 'react-toastify';

import { replaceReact } from "replace-react";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './fillInBlank.module.scss';


const FillInBlank = ({ question, setOpenQuizModal }) => {
  const [answers, setAnswers] = useState({});
  const [wrongAnswers, setWrongAnswers] = useState({})
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);

  const submit = () => {

    for(var prop in answers) {

      const rightAnswers = question.answers[prop].answer_two_gap_match.split('|');
      const studentAnswers = Object.values(answers[prop]);

      if(Object.values(studentAnswers).find(one => one === '')) {
        errorNotify('OPS, wrong answer! try again')
      } else {
  
        if(rightAnswers.every((val, index) => val === studentAnswers[index])) {
          setTimeout(() => {
            setOpenSuccess(false)
            setOpenQuizModal(false)
          }, 4000)
          setOpenSuccess(true)
        } else {
          setWrongAnswers({
            ...wrongAnswers,
            [prop]: {
              ...answers[prop]
            }
          })
          setTimeout(() => {
            setOpenWrong(false)
          }, 4000)
          setOpenWrong(true)
        }
      }
      
    }

  }

  const handleFields = (e, idx) => {

    setAnswers({
      ...answers,
      [idx]: {
        ...answers[idx],
        [e.target.name]: e.target.value
      }
    })

  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.fillInBlank}>

      <h6> 1) {`${'Fill in blank with right words'}`}</h6>

      {question.answers.map((answer, idx) => (

        <div key={answer.id} className={cls.text}>

          {replaceReact(answer.title, /({dash})/g, (match, key) => (
            <input 
              type="text" 
              placeholder='--------------------------------------' 
              name={key} 
              onChange={(e) => handleFields(e, idx)} 
              className={wrongAnswers[idx] && wrongAnswers[idx][key] ? cls.error : ''}
            />
          ))}
        
        </div>

      ))}

      <div className={cls.btn}>

        <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default FillInBlank