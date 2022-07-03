import { useState, useRef, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import axios from '../../../Utils/axios';

import { toast } from 'react-toastify';

import cls from './quizModal.module.scss';

const QuizModal = ({ setOpenQuizModal, quizData }) => {
  console.log(quizData)
  // COMPONENT HOOKS
  const [questions, setQuestions] = useState()
  const [choosedAnswer, setChoosedAnswer] = useState(null)
  const overlay = useRef();
  const { t: translate, i18n } = useTranslation('common');

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if(overlay.current === e.target) setOpenQuizModal(false)
  }

  const close = () => {
    setOpenQuizModal(false)
  }

  const fetchQuestions = async () => {
    const response = await axios.get(`/crm/page_sections/${quizData.id}?lang=${'en'}`);
    if(!response) return;

    const quizesResponse = await axios.get(`/crm/quizzes/${response.data.data.quiz_id.id}?lang=${'en'}`);
    if(!quizesResponse) return;

    const questions = [];

    for(let question of quizesResponse.data.data.questions) {
      const answersResponse = await axios.get(`/crm/answers?lang=${'en'}&question_id=${question.id}`);
      questions.push({
        ...question,
        answers: answersResponse.data.data.answers
      });
    }

    setQuestions(questions)
  }

  useEffect(() => {
    fetchQuestions();
  }, [])

  const submit = () => {
    if(choosedAnswer.is_correct === '1') {
      successNotify('Bravo, the answer is right')
      close()
    } else {
      errorNotify('OPS, wrong answer! try again')
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      <div className={cls.area}>

        <div className={cls.area__wrapper}>
          <div className={`${cls.close} ${cls[i18n.language]}`} onClick={close}>
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div container className={cls.area__content} spacing={3}>

            {questions && questions.length && questions.map((question, idx) => (

              <div key={idx} className={cls.question}>

                <span>{idx + 1})</span> {question.title}

                <div className={cls.answers}>

                  {question.answers.map((answer, idx) => (
                    <p key={idx}>

                      <input type="radio" name={question.id} value={answer.title} onChange={() => setChoosedAnswer(answer)} /> {answer.title}
  
                    </p>
                  ))}

                </div>

              </div>

            ))}

          </div>

          <div className={cls.btn}>

            <button onClick={submit}>Submit</button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default QuizModal;