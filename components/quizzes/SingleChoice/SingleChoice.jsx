import { useState } from 'react';

import { toast } from 'react-toastify';

import cls from './singleChoice.module.scss';

const SingleChoice = ({ question, idx, setOpenQuizModal }) => {
  const [choosedAnswer, setChoosedAnswer] = useState(null)

  const submit = () => {
    if (choosedAnswer) {
      if(choosedAnswer.is_correct === '1') {
        successNotify('Bravo, the answer is right')
        setOpenQuizModal(false)
      } else {
        errorNotify('OPS, wrong answer! try again')
      }
    } else {
      errorNotify('Solve questions before submit')
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.singelChoice}>

      <span>{idx + 1})</span> {question.title}

      <div className={cls.answers}>

        {question.answers.map((answer, idx) => (
          <p key={idx}>

            <input type="radio" name={question.id} value={answer.title} onChange={() => setChoosedAnswer(answer)} /> {answer.title}

          </p>
        ))}

      </div>

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default SingleChoice