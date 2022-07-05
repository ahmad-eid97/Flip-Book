import { useState } from 'react';

import { toast } from 'react-toastify';

import cls from './multipleChoice.module.scss';

const MultipleChoice = ({ question, idx, setOpenQuizModal }) => {
  const [choosedAnswer, setChoosedAnswer] = useState([]);

  const selectChoice = (answer) => {

    const answerFound = choosedAnswer.findIndex(ans => ans.id === answer.id)

    if(answerFound == -1) {

      setChoosedAnswer(prev => [...prev, answer])

    } else {

      let choosedAnswers = [...choosedAnswer]

      choosedAnswers.splice(answerFound, 1)

      console.log(choosedAnswers)

      setChoosedAnswer(choosedAnswers)

    }

    console.log(choosedAnswer)
  }

  const submit = () => {
    if (choosedAnswer.length) {

      const rightAnswers = choosedAnswer.filter(ans => ans.is_correct === '0')

      console.log(rightAnswers)

      if(rightAnswers.length >= 1) {
        errorNotify('OPS, wrong answer! try again')
      } else {
        successNotify('Bravo, the answer is right')

        setOpenQuizModal(false)
      }

    } else {
      errorNotify('Solve questions before submit')
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.multipleChoice}>

      <span>{idx + 1})</span> {question.title}

      <div className={cls.answers}>

        {question.answers.map((answer, idx) => (
          <p key={idx}>

            <input type="checkbox" name={question.id} value={answer.title} onChange={() => selectChoice(answer)} /> {answer.title}

          </p>
        ))}

      </div>

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default MultipleChoice