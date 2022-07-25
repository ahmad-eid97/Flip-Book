import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './singleChoice.module.scss';

const SingleChoice = ({ question, idx, setOpenQuizModal }) => {
  const [choosedAnswer, setChoosedAnswer] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);

  const submit = () => {
    if (choosedAnswer) {
      if(choosedAnswer.is_correct === '1') {
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
    } else {
      setTimeout(() => {
        setOpenWrong(false)
      }, 4000)
      setOpenWrong(true)
      setWrongTries(prev => (prev += 1))
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.singelChoice}>

      <h6><span>{idx + 1})</span> {question.title}</h6>

      <div className={cls.answers}>

        {question.answers.map((answer, idx) => (
          <p key={idx}>

            <span className={cls.num}>{idx + 1}</span>

            <span>
              <input type="radio" name={question.id} value={answer.title} onChange={() => setChoosedAnswer(answer)} /> {answer.title}
            </span>

          </p>
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

export default SingleChoice