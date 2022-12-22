/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import VideoSection from "../../VideoSection/VideoSection";

import { toast } from "react-toastify";

import axios from "../../../Utils/axios";

import { useTranslation } from "react-i18next";

import Cookies from "universal-cookie";

import cls from "./bigImageWithVideo.module.scss";

const cookie = new Cookies();

const BigImageWithVideo = ({
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
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState("");
  const [wrongTries, setWrongTries] = useState(0);
  const { i18n } = useTranslation();
  const [changing, setChanging] = useState(false);

  const submit = async () => {
    if (questionsNum === questionNum) {
      setOpenQuizModal(false);
    } else {
      setQuestionNum((questionNum += 1));
      setChanging(true);
      setTimeout(() => {
        setChanging(false);
      }, 1000);
    }
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={`${cls.bigImageWithVideo} ${changing && cls.animation}`}>
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

      <h6>{question.title}</h6>

      <div className="quesImage">
        {question?.question_img && !changing && (
          <img src={question?.question_img} alt="image" />
        )}
      </div>

      <div className="quizHelpers">
        {/* {question?.question_video_link && */}

        <div className={cls.videoSection}>
          <VideoSection
            video={question?.question_video_link}
            openModal={setOpenPreview}
            data={false}
          />
        </div>

        {/* } */}
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

export default BigImageWithVideo;
