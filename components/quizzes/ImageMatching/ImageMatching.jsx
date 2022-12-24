/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";

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
  direction,
  setOpenPreview,
  setLoading,
  setResults,
  setOpenSuccess,
}) => {
  const [answers, setAnswers] = useState(null);
  const [randomImages, setRandomImages] = useState([]);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);

  const handleOndragEnd = (result) => {
    if (!result.destination) return;
    console.log(randomImages);
    const allAnswers = Array.from(randomImages);
    const [reorderedItem] = allAnswers.splice(result.source.index, 1);
    allAnswers.splice(result.destination.index, 0, reorderedItem);
    console.log(allAnswers);
    setRandomImages(allAnswers);
  };

  const submit = async () => {
    // const sortedAnswers = answers.sort((a,b) => a.id - b.id)
    console.log(randomImages);
    console.log(randomImages.map((answer) => answer.id));
    if (randomImages.length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: randomImages.map((answer) => answer.id),
      };

      const response = await axios
        .post(`/crm/students/quiz/answer_question`, data, {
          headers: {
            Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
          },
        })
        .catch((err) => console.log(err));

      if (!response) return;

      setLoading(false);

      setResults((prev) => [...prev, response.data.data.is_correct]);

      if (questionsNum === questionNum) {
        setOpenSuccess(true);
        setTimeout(() => {
          setOpenQuizModal(false);
        }, 15000);
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
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

  // useEffect(() => {
  //   console.log(titles);
  //   let randomTitles = [];

  //   for (var index = 0; index < question.answers.length; index++) {
  //     const randomNum = Math.floor(Math.random() * question.answers.length);
  //     console.log(randomNum, question.answers[randomNum].id);
  //     if (
  //       randomTitles.find(
  //         (answer) => answer.id === question.answers[randomNum].id
  //       )
  //     ) {
  //       index--;
  //       continue;
  //     } else {
  //       randomTitles.push(question.answers[randomNum]);
  //     }
  //   }
  //   setTitles(randomTitles);
  // }, [question.answers]);

  useEffect(() => {
    let randomImages = [];

    for (var index = 0; index < question.answers.length; index++) {
      const randomNum = Math.floor(Math.random() * question.answers.length);
      console.log(randomNum, question.answers[randomNum].id);
      if (
        randomImages.find(
          (answer) => answer.id === question.answers[randomNum].id
        )
      ) {
        index--;
        continue;
      } else {
        randomImages.push(question.answers[randomNum]);
      }
    }
    console.log(randomImages);
    setRandomImages(randomImages);
    // setAnswers(randomImages);
  }, [question.answers]);

  console.log(question);

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.dragQuiz} ${changing && cls.animation}`}>
      <div className={`stepper ${direction === "rtl" ? "arabic" : "english"}`}>
        <div className="step">
          <p>{questionNum}</p>
          {direction === "rtl" ? (
            <span>السؤال الحالي</span>
          ) : (
            <span>Current Question</span>
          )}
        </div>

        <div className="lastStep">
          <p>{questionsNum}</p>
          {direction === "rtl" ? (
            <span>عدد الاسئلة</span>
          ) : (
            <span>Questions Number</span>
          )}
        </div>
      </div>

      <div className="quesImage">
        {question?.question_img && !changing && (
          <img src={question?.question_img} alt="image" />
        )}
      </div>

      <div className="quizHelpers">
        {question?.question_video_link && (
          <div className={cls.videoSection}>
            <VideoSection
              video={question?.question_video_link}
              openModal={setOpenPreview}
              data={false}
            />
          </div>
        )}

        {question?.question_audio && (
          <div className={cls.audioSection}>
            <AudioSection audio={question?.question_audio} data={false} />
          </div>
        )}
      </div>

      <h6>
        {" "}
        {questionNum}) {question.title}
      </h6>

      <div className={cls.wrapper}>
        <DragDropContext onDragEnd={handleOndragEnd} className={cls.draggable}>
          <Droppable
            droppableId="matching"
            className={`${cls.box} ${cls[i18n.language]}`}
            direction="horizontal"
          >
            {(provided) => (
              <section
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cls.imagesBox}
              >
                {randomImages &&
                  randomImages.map((answer, idx) => (
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
              </section>
            )}
          </Droppable>
        </DragDropContext>

        <div className={`${cls.answers} ${cls[i18n.language]}`}>
          {question.answers.map((answer, idx) => (
            <h6 key={idx}>{answer.title}</h6>
          ))}
        </div>
      </div>

      <div className={cls.btn}>
        {questionsNum === questionNum ? (
          <button onClick={submit}>
            {direction === "rtl" ? <span>تأكيد </span> : <span>Submit </span>}

            <i className="fa-light fa-badge-check"></i>
          </button>
        ) : (
          <button onClick={submit}>
            {direction === "rtl" ? <span>التالي </span> : <span>Next </span>}

            <i
              className={`${cls[i18n.language]} ${
                cls.next
              } fa-light fa-circle-right`}
            ></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default DragQuiz;
