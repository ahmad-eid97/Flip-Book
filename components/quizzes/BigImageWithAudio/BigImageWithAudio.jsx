/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import VideoSection from '../../VideoSection/VideoSection';
import AudioSection from '../../AudioSection/AudioSection';

import { toast } from "react-toastify";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import axios from "../../../Utils/axios";

import { useTranslation } from "react-i18next";

import Cookies from "universal-cookie";

import cls from "./bigImageWithAudio.module.scss";

const cookie = new Cookies();

const BigImageWithAudio = ({
  question,
  setOpenQuizModal,
  attemptId,
  questionNum,
  setQuestionNum,
  questionsNum,
  direction,
}) => {
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);

  const submit = async () => {
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.bigImageWithAudio} ${changing && cls.animation}`}>
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

      <h6>{question.title}</h6>

      <div className="quesImage">
        {question?.question_img && !changing && <img src={question?.question_img} alt="image" />}
      </div>

      <div className="quizHelpers">
        
        {question?.question_audio && 

          <div className={cls.audioSection}>
            <AudioSection audio={question?.question_audio} data={false} />
          </div>
        
        }
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

export default BigImageWithAudio;
