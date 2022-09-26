/* eslint-disable @next/next/no-img-element */
import { useState, useRef} from "react";

import VideoSection from './../../VideoSection/VideoSection';
import AudioSection from '../../AudioSection/AudioSection';

import { toast } from "react-toastify";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import axios from "../../../Utils/axios";

import { useTranslation } from "react-i18next";

import Cookies from "universal-cookie";

import cls from "./singleChoice.module.scss";

const cookie = new Cookies();

const SingleChoice = ({
  question,
  idx,
  setOpenQuizModal,
  attemptId,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction
}) => {
  const [choosedAnswer, setChoosedAnswer] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);
  const inputRef = useRef();

  console.log(question)

  const submit = async () => {
    if (choosedAnswer) {
      if (questionsNum === questionNum) {
        setOpenQuizModal(false);
      } else {
        setQuestionNum((questionNum += 1));
        setChanging(true);
        
        // inputRef.current.checked  = false
        setChoosedAnswer(null)
        setTimeout(() => {
          setChanging(false);
        }, 1000);
      }

      const data = {
        quiz_attempt_id: attemptId,
        question_id: question.id,
        given_answer: choosedAnswer.id,
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

    // if (choosedAnswer) {
    //   if(choosedAnswer.is_correct === '1') {
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
    <div className={`${cls.singelChoice} ${changing && cls.animation}`}>
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

      <h6>
        <span>{questionNum})</span> {question.title}
      </h6>

      <div className={cls.answers}>
        {question.answers.map((answer, idx) => (
          <p key={idx}>
            <span className={cls.num}>{idx + 1}</span>

            <span>
              <input
                type="radio"
                ref={inputRef}
                name={question.id}
                value={choosedAnswer ? choosedAnswer?.title : ''}
                onChange={() => setChoosedAnswer(answer)}
                checked={choosedAnswer ? choosedAnswer.id === answer.id : false}
              />{" "}
              {answer.title}
            </span>
          </p>
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

export default SingleChoice;
