import { useState } from "react";

import { toast } from "react-toastify";

import { replaceReact } from "replace-react";

import VideoSection from "../../VideoSection/VideoSection";
import AudioSection from "../../AudioSection/AudioSection";

import axios from "../../../Utils/axios";

import { useTranslation } from "next-i18next";

import Cookies from "universal-cookie";

import cls from "./fillInBlank.module.scss";
import { useEffect } from "react";

const cookie = new Cookies();

const FillInBlank = ({
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
  const [answers, setAnswers] = useState({});
  const [wrongAnswers, setWrongAnswers] = useState({});
  const [wrongTries, setWrongTries] = useState(0);
  const [changing, setChanging] = useState(false);
  const { i18n } = useTranslation();

  const submit = async () => {
    if (Object.values(answers).length) {
      setLoading(true);
      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer:
          Object.values(answers).length && Object.values(answers["0"]),
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
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }
    }

    // if(response.success) {
    // setTimeout(() => {
    //   setOpenSuccess(false)
    //   setOpenQuizModal(false)
    // }, 4000)
    // setOpenSuccess(true)

    // } else {
    // setTimeout(() => {
    //   setOpenWrong(false)
    // }, 4000)
    // setOpenWrong(true)
    // setWrongTries(prev => (prev += 1))
    // }

    // for(var prop in answers) {

    //   const rightAnswers = question.answers[prop].answer_two_gap_match.split('|');
    //   const studentAnswers = Object.values(answers[prop]);

    //   if(Object.values(studentAnswers).find(one => one === '')) {
    //     setTimeout(() => {
    //       setOpenWrong(false)
    //     }, 4000)
    //     setOpenWrong(true)
    //     setWrongTries(prev => (prev += 1))
    //   } else {

    //     if(rightAnswers.every((val, index) => val === studentAnswers[index])) {
    //       setTimeout(() => {
    //         setOpenSuccess(false)
    //         setOpenQuizModal(false)
    //       }, 4000)
    //       setOpenSuccess(true)
    //     } else {
    //       setWrongAnswers({
    //         ...wrongAnswers,
    //         [prop]: {
    //           ...answers[prop]
    //         }
    //       })
    //       setTimeout(() => {
    //         setOpenWrong(false)
    //       }, 4000)
    //       setOpenWrong(true)
    //       setWrongTries(prev => (prev += 1))
    //     }
    //   }

    // }
  };

  const handleFields = (e, idx) => {
    setAnswers({
      ...answers,
      [idx]: {
        ...answers[idx],
        [e.target.name]: e.target.value,
      },
    });
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  console.log(question);

  return (
    <div className={`${cls.fillInBlank} ${changing && cls.animation}`}>
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
        <h6>أكمل الفراغات التاليه بالاجابات المناسبة</h6>
      ) : (
        <h6>Complete the following blanks with the appropriate answers</h6>
      )}

      {question.answers.map((answer, idx) => (
        <div key={answer.id} className={cls.text}>
          <h6>
            {" "}
            {questionNum}) {question.title}
          </h6>

          {replaceReact(answer.title, /({dash})/g, (match, key) => (
            <input
              type="text"
              placeholder="--------------------------------------"
              name={key}
              onChange={(e) => handleFields(e, idx)}
              className={
                wrongAnswers[idx] && wrongAnswers[idx][key] ? cls.error : ""
              }
            />
          ))}

          <div className={cls.btn}>
            {questionsNum === questionNum ? (
              <button onClick={submit}>
                {direction === "rtl" ? (
                  <span>تأكيد </span>
                ) : (
                  <span>Submit </span>
                )}

                <i className="fa-light fa-badge-check"></i>
              </button>
            ) : (
              <button onClick={submit}>
                {direction === "rtl" ? (
                  <span>التالي </span>
                ) : (
                  <span>Next </span>
                )}

                <i
                  className={`${cls[i18n.language]} ${
                    cls.next
                  } fa-light fa-circle-right`}
                ></i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FillInBlank;
