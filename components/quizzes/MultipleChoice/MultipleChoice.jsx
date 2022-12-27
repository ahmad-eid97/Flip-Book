/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import VideoSection from "./../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";

import { toast } from "react-toastify";

import axios from "../../../Utils/axios";

import { useTranslation } from "react-i18next";

import Cookies from "universal-cookie";

import cls from "./multipleChoice.module.scss";

const cookie = new Cookies();

const MultipleChoice = ({
  question,
  idx,
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
  const [choosedAnswer, setChoosedAnswer] = useState([]);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);

  const selectChoice = (answer) => {
    const answerFound = choosedAnswer.findIndex((ans) => ans.id === answer.id);

    if (answerFound == -1) {
      setChoosedAnswer((prev) => [...prev, answer]);
    } else {
      let choosedAnswers = [...choosedAnswer];

      choosedAnswers.splice(answerFound, 1);

      setChoosedAnswer(choosedAnswers);
    }
  };

  const submit = async () => {
    if (choosedAnswer.length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: choosedAnswer.map((answer) => answer.id),
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
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);
        setChoosedAnswer([]);
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
    }

    // if (choosedAnswer.length) {

    //   const rightAnswers = choosedAnswer.filter(ans => ans.is_correct === '0')

    //   if(rightAnswers.length >= 1) {
    //     setTimeout(() => {
    //       setOpenWrong(false)
    //     }, 4000)
    //     setOpenWrong(true)
    //     setWrongTries(prev => (prev += 1))
    //   } else {
    //     setTimeout(() => {
    //       setOpenSuccess(false)
    //       setOpenQuizModal(false)
    //     }, 4000)
    //     setOpenSuccess(true)
    //   }

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
    <div className={`${cls.multipleChoice} ${changing && cls.animation}`}>
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

      {direction === "rtl" ? (
        <h6 className={cls.headH6}>
          إختر الإجابات الصحيحة من الإختيارات التالية
        </h6>
      ) : (
        <h6 className={cls.headH6}>
          Choose the correct answers for the next question
        </h6>
      )}

      <h6>
        <span>{questionNum})</span> {question.title}
      </h6>

      <div className={cls.answers}>
        {question.answers.map((answer, idx) => (
          <p key={idx}>
            <span className={cls.num}>{idx + 1}</span>

            <span>
              <input
                type="checkbox"
                name={question.id}
                id={answer.id}
                value={answer.title}
                onChange={() => selectChoice(answer)}
                checked={
                  choosedAnswer
                    ? choosedAnswer.find((ans) => ans.id === answer.id)
                    : false
                }
              />{" "}
              <label htmlFor={answer.id}>{answer.title}</label>
              {answer.answer_img && (
                <img
                  className={cls.ansImage}
                  src={answer.answer_img}
                  alt="answerImage"
                />
              )}
            </span>
          </p>
        ))}
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

export default MultipleChoice;
