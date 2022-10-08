import { useState, useEffect } from "react";

import VideoSection from './../../VideoSection/VideoSection';
import AudioSection from '../../AudioSection/AudioSection';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import { toast } from "react-toastify";

import axios from "../../../Utils/axios";

import { useTranslation } from "react-i18next";

import Cookies from "universal-cookie";

import cls from "./orderingQuiz.module.scss";

const cookie = new Cookies();

const OrderingQuiz = ({
  question,
  setOpenQuizModal,
  attemptId,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction,
  setOpenPreview
}) => {
  const [answers, setAnswers] = useState(question.answers);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);

  const handleOndragEnd = (result) => {
    if (!result.destination) return;
    const allAnswers = Array.from(answers);
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    setAnswers(allAnswers);
  };

  useEffect(() => {
    let randomAnswers = [];

    for (var index = 0; index < question.answers.length; index++) {
      const randomNum = Math.floor(Math.random() * question.answers.length);
      if (
        randomAnswers.find(
          (answer) => answer.id === question.answers[randomNum].id
        )
      ) {
        index--;
        continue;
      }
      randomAnswers.push(question.answers[randomNum]);
    }

    setAnswers(randomAnswers);
  }, []);

  const submit = async () => {
    const rightOrder = question.answers.map((answer) => answer.title);
    const answerArray = answers.map((answer) => answer.title);

    // const sortedAnswers = answers.sort((a,b) => a.id - b.id)

    if (answers.length) {
      if (questionsNum === questionNum) {
        setOpenQuizModal(false);
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);
        setAnswers(question.answers)
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }

      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: answers.map((answer) => answer.id),
      };

      const response = await axios
        .post(`/crm/students/quiz/answer_question`, data, {
          headers: {
            Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
          },
        })
        .catch((err) => console.log(err));

      if (!response) return;
    }

    // if(rightOrder.length === answerArray.length && rightOrder.every((val, index) => val === answerArray[index])) {
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
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.orderingQuiz} ${changing && cls.animation}`}>
      <div className={`stepper ${direction === "rtl" ? "arabic" : "english"}`}>
        <div className="step">
          <p>{questionNum}</p>
          {direction === 'rtl' ?
            <span>السؤال الحالي</span>
            :
            <span>Current Question</span>
          }
        </div>

        <div className="lastStep">
          <p>{questionsNum}</p>
          {direction === 'rtl' ?
            <span>عدد الاسئلة</span>
            :
            <span>Questions Number</span>
          }
        </div>
      </div>

      <div className="quesImage">
        {question?.question_img && !changing && <img src={question?.question_img} alt="image" />}
      </div>

      <div className="quizHelpers">
        {question?.question_video_link &&

        <div className={cls.videoSection}>
          <VideoSection video={question?.question_video_link} openModal={setOpenPreview} data={false} />
        </div>

        }
        
        {question?.question_audio && 

          <div className={cls.audioSection}>
            <AudioSection audio={question?.question_audio} data={false} />
          </div>
        
        }
      </div>

      <h6> {questionNum}) {question.title}</h6>

      <div className={cls.answers}>
        <DragDropContext onDragEnd={handleOndragEnd}>
          <Droppable droppableId="numbers">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {answers.map((answer, idx) => (
                  <Draggable
                    key={answer.id}
                    draggableId={answer.id.toString()}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        className={cls.answerWrapper}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <span>{idx + 1}</span>
                        <p className={cls.box}>{answer.title}</p>
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
          {questionsNum === questionNum ? (
            <button onClick={submit}>
              {direction === 'rtl' ? 
                <span>تأكيد{" "}</span>
                :
                <span>Submit{" "}</span>
              }
              
              <i className="fa-light fa-badge-check"></i>

            </button>
          ) : (
            <button onClick={submit}>
              {direction === 'rtl' ? 
                <span>التالي{" "}</span>
                :
                <span>Next {" "}</span>
              }

              <i
                className={`${cls[i18n.language]} ${
                  cls.next
                } fa-light fa-circle-right`}
              ></i>
            </button>
          )}
        </div>
      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}
    </div>
  );
};

export default OrderingQuiz;
