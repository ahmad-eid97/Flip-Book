/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import { useTranslation } from "next-i18next";

import { toast } from 'react-toastify';

import axios from '../../../Utils/axios';

import Cookies from 'universal-cookie';

import cls from './imageMatching.module.scss';

const cookie = new Cookies();

const DragQuiz = ({ question, setOpenQuizModal, attemptIp }) => {
  const [answers, setAnswers] = useState(question.answers);
  const [titles, setTitles] = useState(question.answers.map(ans => ans.title));
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation()

  const handleOndragEnd = (result) => {
    if(!result.destination) return;
    const allAnswers = Array.from(answers)
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    setAnswers(allAnswers)
  }

  const submit = async () => {
    const data = {
      quiz_attempt_id: attemptIp,
      question_id: question.id,
      given_answer: answers
    }

    console.log(data)

    const response = await axios.post(`/crm/students/quiz/answer_question`, data, {
      headers: {
        Authorization: `Bearer ${cookie.get('EmicrolearnAuth')}`
      }
    }).catch(err => console.log(err));

    if(!response) return;

    // const rightAnswer = [...titles]

    // const studentAnswers = answers.map(ans => ans.title)

    // if(rightAnswer.every((val, index) => val === studentAnswers[index])) {
    //   setTimeout(() => {
    //     setOpenSuccess(false)
    //     setOpenQuizModal(false)
    //   }, 4000)
    //   setOpenSuccess(true)
    // } else {
    //   setTimeout(() => {
    //     setOpenWrong(false)
    //   }, 4000)
    //   setOpenWrong(true)
    //   setWrongTries(prev => (prev += 1))
    // }

  }

  useEffect(() => {

    let randomTitles = []

    for (var index = 0; index < titles.length; index++) {
      const randomNum = Math.floor(Math.random() * titles.length);
      if (randomTitles.find((title) => title === titles[randomNum])) {
        index--;
        continue;
      }
      randomTitles.push(titles[randomNum]);
    }

    setTitles(randomTitles)

  }, [])

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.dragQuiz}>

      <h6> 1) { question.title }</h6>

      <div className={cls.wrapper}>

        <DragDropContext onDragEnd={handleOndragEnd}>

          {console.log(cls[i18n.language])}

          <Droppable droppableId="matching" className={`${cls.box} ${cls[i18n.language]}`} direction="horizontal">

            {(provided) => (

              <div {...provided.droppableProps} ref={provided.innerRef}>

                {answers.map((answer, idx) => (

                  <Draggable key={answer.id} draggableId={answer.id.toString()} index={idx} direction="horizontal">

                    {(provided) => (

                      <img src={ answer.answer_img } alt="answerImage" className={`${cls.box} ${cls[i18n.language]}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} />

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}
              
              </div>

            )}

          </Droppable>

        </DragDropContext>

        <div className={`${cls.answers} ${cls[i18n.language]}`}>

          {titles.map((title, idx) => (

            <h6 key={idx}>

              {title}

            </h6>

          ))}

        </div>

      </div>

      <div className={cls.btn}>

        <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default DragQuiz