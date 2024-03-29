import { useState, useRef, useEffect } from "react";

import ImageMatching from "../../quizzes/ImageMatching/ImageMatching";
import OrderingQuiz from "./../../quizzes/OrderingQuiz/OrderingQuiz";
import SingleChoice from "../../quizzes/SingleChoice/SingleChoice";
import MultipleChoice from "./../../quizzes/MultipleChoice/MultipleChoice";
import OpenEnded from "./../../quizzes/OpenEnded/OpenEnded";
import ShortAnswer from "./../../quizzes/ShortAnswer/ShortAnswer";
import TrueAndFalse from "./../../quizzes/TrueAndFalse/TrueAndFalse";
import FillInBlank from "./../../quizzes/FillInBlank/FillInBlank";
import ImageAnswering from "../../quizzes/ImageAnswering/ImageAnswering";
import BigImageWithAudio from "../../quizzes/BigImageWithAudio/BigImageWithAudio";
import BigImageWithVideo from "../../quizzes/BigImageWithVideo/BigImageWithVideo";

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";

import Loader from "../../UIs/Loader/Loader";

import { useTranslation } from "react-i18next";

import Cookies from "universal-cookie";

import axios from "../../../Utils/axios";

import cls from "./quizModal.module.scss";
import Matching from "../../quizzes/Matching/Matching";

const cookie = new Cookies();

const QuizModal = ({
  setOpenQuizModal,
  quizData,
  sectionId,
  direction,
  setOpenPreview,
}) => {
  // COMPONENT HOOKS
  const [questions, setQuestions] = useState();
  const [answers, setAnswers] = useState({});
  const [wrongAnswers, setWrongAnswers] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const [attemptId, setAttemptId] = useState();
  const overlay = useRef();
  const { t: translate, i18n } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(1);
  const [specialModal, setSpecialModal] = useState(false);
  const [results, setResults] = useState([]);

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if (overlay.current === e.target) setOpenQuizModal(false);
  };

  const close = () => {
    setOpenQuizModal(false);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    const response = await axios.get(
      `/crm/page_sections/${quizData.id}?lang=${"en"}`
    );
    if (!response) return;

    const quizesResponse = await axios.get(
      `/crm/quizzes/${response.data.data.quiz_id.id}?lang=${"en"}`
    );
    if (!quizesResponse) return;

    const questions = [];

    for (let question of quizesResponse.data.data.questions) {
      if (question.question_type === "image_matching") setSpecialModal(true);
      else setSpecialModal(false);
      const answersResponse = await axios.get(
        `/crm/answers?lang=${"en"}&question_id=${question.id}`
      );
      questions.push({
        ...question,
        answers: answersResponse.data.data.answers,
      });
    }

    setQuestions(questions);

    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startQuiz = async () => {
    const data = {
      page_section_id: quizData.id,
    };

    const response = await axios
      .post(`/crm/students/quiz/start`, data, {
        headers: {
          Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
        },
      })
      .catch((err) => console.log(err));

    if (!response) return;

    setAttemptId(response.data.data.id);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      <div className={`${cls.area} ${specialModal ? cls.specialModal : ""}`}>
        {loading ? (
          <Loader />
        ) : (
          <div className={cls.area__wrapper}>
            <div
              className={`${cls.close} ${cls[i18n.language]}`}
              onClick={close}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>

            <div
              container
              className={`${cls.area__content} ${
                direction === "rtl" ? cls.arabic : cls.english
              }`}
              spacing={3}
            >
              {questions &&
                questions.length &&
                questions
                  .slice(questionNum - 1, questionNum)
                  .map((question, idx) => (
                    <div key={idx} className={cls.question}>
                      {question.question_type === "single_choice" && (
                        <SingleChoice
                          question={question}
                          idx={idx}
                          setOpenQuizModal={setOpenQuizModal}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "image_matching" && (
                        <ImageMatching
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "ordering" && (
                        <OrderingQuiz
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "multiple_choice" && (
                        <MultipleChoice
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "open_ended" && (
                        <OpenEnded
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "short_answer" && (
                        <ShortAnswer
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "true_false" && (
                        <TrueAndFalse
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "matching" && (
                        <Matching
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "fill_in_the_blank" && (
                        <FillInBlank
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "image_answering" && (
                        <ImageAnswering
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "big_image_with_audio" && (
                        <BigImageWithAudio
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}

                      {question.question_type === "big_image_with_video" && (
                        <BigImageWithVideo
                          question={question}
                          setOpenQuizModal={setOpenQuizModal}
                          idx={idx}
                          attemptId={attemptId}
                          questionNum={questionNum}
                          setQuestionNum={setQuestionNum}
                          questionsNum={questions.length}
                          direction={direction}
                          setOpenPreview={setOpenPreview}
                          results={results}
                          setResults={setResults}
                          setLoading={setLoading}
                          setOpenSuccess={setOpenSuccess}
                        />
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>

      {openSuccess && <CorrectAnswer results={results} setOpenQuizModal={setOpenQuizModal} />}
    </div>
  );
};

export default QuizModal;
