import { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { toast } from 'react-toastify';

import cls from './orderingQuiz.module.scss';

const OrderingQuiz = ({ question, setOpenQuizModal }) => {
  const [answers, setAnswers] = useState(question.answers)

  console.log(question)

  const handleOndragEnd = (result) => {
    if(!result.destination) return;
    const allAnswers = Array.from(answers)
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    setAnswers(allAnswers)
  }

  console.log(Math.floor(Math.random() * question.answers.length))

  useEffect(() => {

    console.log(question)

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
      successNotify('Bravo, the answer is right')
      setOpenQuizModal(false)
    } else {
      errorNotify('OPS, wrong answer! try again')
    }
  }

  const successNotify = (message) => toast.success(message)
  const errorNotify = (message) => toast.error(message)

  return (
    <div className={cls.orderingQuiz}>

      <h6>{ '=>' + question.title }</h6>

      <div className={cls.answers}>

        <DragDropContext onDragEnd={handleOndragEnd}>

          <Droppable droppableId="numbers">

            {(provided) => (

              <div {...provided.droppableProps} ref={provided.innerRef}>

                {answers.map((answer, idx) => (

                  <Draggable key={answer.id} draggableId={answer.id.toString()} index={idx}>

                    {(provided) => (

                      <p className={cls.box} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>

                        { answer.title }

                      </p>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}
              
              </div>

            )}

          </Droppable>
          
        </DragDropContext>

        <div className={cls.btn}>

          <button onClick={submit}>Submit</button>

        </div>

      </div>

    </div>
  )
}

export default OrderingQuiz