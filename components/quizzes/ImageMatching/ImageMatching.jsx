/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import VideoSection from './../../VideoSection/VideoSection';
import AudioSection from '../../AudioSection/AudioSection';

import { useTranslation } from "next-i18next";

import { toast } from "react-toastify";

import axios from "../../../Utils/axios";

import Cookies from "universal-cookie";

import cls from "./imageMatching.module.scss";

const cookie = new Cookies();

const DragQuiz = ({
  question,
  setOpenQuizModal,
  attemptId,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction
}) => {
  const [answers, setAnswers] = useState(question.answers);
  const [titles, setTitles] = useState(
    question.answers.map((ans) => ans.title)
  );
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

  const submit = async () => {
    // const sortedAnswers = answers.sort((a,b) => a.id - b.id)

    if (answers.length) {
      if (questionsNum === questionNum) {
        setOpenQuizModal(false);
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);
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
  };

  useEffect(() => {
    let randomTitles = [];

    for (var index = 0; index < titles.length; index++) {
      const randomNum = Math.floor(Math.random() * titles.length);
      if (randomTitles.find((title) => title === titles[randomNum])) {
        index--;
        continue;
      }
      randomTitles.push(titles[randomNum]);
    }

    setTitles(randomTitles);
  }, []);

  console.log(question)

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.dragQuiz} ${changing && cls.animation}`}>
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

      <div className={cls.wrapper}>
        <DragDropContext onDragEnd={handleOndragEnd}>
          <Droppable
            droppableId="matching"
            className={`${cls.box} ${cls[i18n.language]}`}
            direction="horizontal"
          >
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={cls.imagesBox}>
                {answers.map((answer, idx) => (
                  <Draggable
                    key={answer.id}
                    draggableId={answer.id.toString()}
                    index={idx}
                    direction="horizontal"
                  >
                    {(provided) => (
                      <img
                        src={answer.answer_img}
                        alt="answerImage"
                        className={`${cls.box} ${cls[i18n.language]}`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      />
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
            <h6 key={idx}>{title}</h6>
          ))}
        </div>
      </div>

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

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}
    </div>
  );
};

export default DragQuiz;
