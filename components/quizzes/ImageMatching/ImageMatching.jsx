import { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { toast } from 'react-toastify';

import cls from './imageMatching.module.scss';

const DragQuiz = ({ question, setOpenQuizModal }) => {
  const [answers, setAnswers] = useState(question.answers);
  const [titles, setTitles] = useState(question.answers.map(ans => ans.title))

  const handleOndragEnd = (result) => {
    if(!result.destination) return;
    const allAnswers = Array.from(answers)
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    setAnswers(allAnswers)
  }

  const submit = () => {

    const rightAnswer = [...titles]

    const studentAnswers = answers.map(ans => ans.title)

    if(rightAnswer.every((val, index) => val === studentAnswers[index])) {
      successNotify('Bravo, the answer is right')
      setOpenQuizModal(false)
    } else {
      errorNotify('OPS, wrong answer! try again')
    }

    console.log(studentAnswers)

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

      <h6>{'=>' + question.title }</h6>

      <DragDropContext onDragEnd={handleOndragEnd}>

        <Droppable droppableId="matching" className={cls.box} direction="horizontal">

          {(provided) => (

            <div {...provided.droppableProps} ref={provided.innerRef}>

              {answers.map((answer, idx) => (

                <Draggable key={answer.id} draggableId={answer.id.toString()} index={idx} direction="horizontal">

                  {(provided) => (

                    <img src={ answer.answer_img } alt="answerImage" className={cls.box} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} />

                  )}

                </Draggable>

              ))}

              {provided.placeholder}
            
            </div>

          )}

        </Droppable>
        
      </DragDropContext>

      <div className={cls.answers}>

        {titles.map((title, idx) => (

          <h6 key={idx}>

            {title}

          </h6>

        ))}

      </div>

      <div className={cls.btn}>

        <button onClick={submit}>Submit</button>

      </div>

    </div>
  )
}

export default DragQuiz