/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import { toast } from "react-toastify";

import VideoSection from './../../VideoSection/VideoSection';
import AudioSection from '../../AudioSection/AudioSection';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import axios from "../../../Utils/axios";

import Cookies from "universal-cookie";

import { useTranslation } from "next-i18next";

import cls from "./imageAnswering.module.scss";

const cookie = new Cookies();

const ImageAnswering = ({
  question,
  setOpenQuizModal,
  attemptId,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction,
  setOpenPreview
}) => {
  const [fields, setFields] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);

  const changeFields = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    if (Object.values(fields).length) {
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
        given_answer: Object.values(fields).map((value) => value),
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

    // if(Object.keys(fields).length && Object.values(fields).length) {
    //   const rightAnswers = Object.keys(fields);
    //   const studentAnswers = Object.values(fields);

    //   if(rightAnswers.every((val, index) => val === studentAnswers[index])) {
    //     setTimeout(() => {
    //       setOpenSuccess(false)
    //       setOpenQuizModal(false)
    //     }, 4000)
    //     setOpenSuccess(true)
    //   } else {
    //     setTimeout(() => {
    //       setOpenWrong(false)
    //     }, 4000)
    //     setOpenWrong(true)
    //     setWrongTries(prev => (prev += 1))
    //   }
    // }
  };

  console.log(question)

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.imageAnswering} ${changing && cls.animation}`}>
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
        {question.answers.map((answer, idx) => (
          <div key={idx} className={cls.one}>
            <img src={answer.answer_img} alt="answerImage" />

            <input
              type="text"
              name={answer.title}
              onChange={(e) => changeFields(e)}
            />
          </div>
        ))}
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

export default ImageAnswering;
