import { useState } from 'react';

import { toast } from 'react-toastify';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import cls from './multipleChoice.module.scss';

const MultipleChoice = ({ question, idx, setOpenQuizModal }) => {
  const [choosedAnswer, setChoosedAnswer] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);

  const selectChoice = (answer) => {

    const answerFound = choosedAnswer.findIndex(ans => ans.id === answer.id)

    if(answerFound == -1) {

      setChoosedAnswer(prev => [...prev, answer])

    } else {

      let choosedAnswers = [...choosedAnswer]

      choosedAnswers.splice(answerFound, 1)

      setChoosedAnswer(choosedAnswers)

    }
  }

  const submit = () => {
    if (choosedAnswer.length) {

      const rightAnswers = choosedAnswer.filter(ans => ans.is_correct === '0')

      if(rightAnswers.length >= 1) {
        setTimeout(() => {
          setOpenWrong(false)
        }, 4000)
        setOpenWrong(true)
      } else {
        setTimeout(() => {
          setOpenSuccess(false)
          setOpenQuizModal(false)
        }, 4000)
        setOpenSuccess(true)
      }

    } else {
      setTimeout(() => {
        setOpenWrong(false)
      }, 4000)
      setOpenWrong(true)
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.multipleChoice}>

      <h6><span>{idx + 1})</span> {question.title}</h6>

      <div className={cls.answers}>

        {question.answers.map((answer, idx) => (
          <p key={idx}>

            <span className={cls.num}>{idx + 1}</span>

            <span>
              <input type="checkbox" name={question.id} value={answer.title} onChange={() => selectChoice(answer)} /> {answer.title}
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

export default MultipleChoice