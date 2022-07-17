import { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import { toast } from 'react-toastify';

import cls from './orderingQuiz.module.scss';

const OrderingQuiz = ({ question, setOpenQuizModal }) => {
  const [answers, setAnswers] = useState(question.answers)
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);

  const handleOndragEnd = (result) => {
    if(!result.destination) return;
    const allAnswers = Array.from(answers)
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    setAnswers(allAnswers)
  }

  useEffect(() => {

    let randomAnswers = []

    for (var index = 0; index < question.answers.length; index++) {
      const randomNum = Math.floor(Math.random() * question.answers.length);
      if (randomAnswers.find((answer) => answer.id === question.answers[randomNum].id)) {
        index--;
        continue;
      }
      randomAnswers.push(question.answers[randomNum]);
    }

    setAnswers(randomAnswers)

  }, [])

  const submit = () => {
    const rightOrder = question.answers.map(answer => (answer.title))
    const answerArray = answers.map(answer => (answer.title))
    
    if(rightOrder.length === answerArray.length && rightOrder.every((val, index) => val === answerArray[index])) {
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

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.orderingQuiz}>

      <h6> 1) { question.title }</h6>

      <div className={cls.answers}>

        <DragDropContext onDragEnd={handleOndragEnd}>

          <Droppable droppableId="numbers">

            {(provided) => (

              <div {...provided.droppableProps} ref={provided.innerRef}>

                {answers.map((answer, idx) => (

                  <Draggable key={answer.id} draggableId={answer.id.toString()} index={idx}>

                    {(provided) => (

                      <div className={cls.answerWrapper} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <span>{idx + 1}</span>
                        <p className={cls.box}>

                          { answer.title }

                        </p>
                      </div>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}
              
              </div>

            )}

          </Droppable>
          
        </DragDropContext>

        <div className={cls.btn}>

          <button onClick={submit}><i className="fa-light fa-badge-check"></i> Submit</button>

        </div>

      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default OrderingQuiz