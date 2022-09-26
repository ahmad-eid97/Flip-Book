/* eslint-disable @next/next/no-img-element */
import cls from "./quizSection.module.scss";

const QuizSection = ({ section, openQuiz }) => {
  const openQuizPreview = (state, data) => {
    openQuiz(state, data);
  };

  return (
    <div className={cls.quizSection}>
      <button onClick={() => openQuizPreview(true, section)}>
        {section?.photo_file && <img src={section.photo_file} alt="quizImage" />}
        {/* <iframe src={section.photo_file} frameBorder="0"></iframe> */}
      </button>
    </div>
  );
};

export default QuizSection;
