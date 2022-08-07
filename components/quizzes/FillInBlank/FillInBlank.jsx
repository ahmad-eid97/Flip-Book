import { useState } from "react";

import { toast } from "react-toastify";

import { replaceReact } from "replace-react";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

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
}) => {
  const [answers, setAnswers] = useState({});
  const [wrongAnswers, setWrongAnswers] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const [changing, setChanging] = useState(false);
  const { i18n } = useTranslation();

  const submit = async () => {
    if (Object.values(answers).length) {
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

  return (
    <div className={`${cls.fillInBlank} ${changing && cls.animation}`}>
      <div className={`stepper ${direction === "rtl" ? "arabic" : "english"}`}>
        <div className="step">
          <p>{questionNum}</p>
          <span>السؤال الحالي</span>
        </div>

        <div className="lastStep">
          <p>{questionsNum}</p>
          <span>عدد الاسئلة</span>
        </div>
      </div>

      <h6> 1) {`${"أكمل الفراغات التاليه بالاجابات المناسبة"}`}</h6>

      {question.answers.map((answer, idx) => (
        <div key={answer.id} className={cls.text}>
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
                تأكيد <i className="fa-light fa-badge-check"></i>
              </button>
            ) : (
              <button onClick={submit}>
                التالي{" "}
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

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}
    </div>
  );
};

export default FillInBlank;
