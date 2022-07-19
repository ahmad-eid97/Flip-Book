import cls from './quizSection.module.scss'

const QuizSection = ({ section, openQuiz }) => {

  const openQuizPreview = (state, data) => {
    console.log('test modal')
    openQuiz(state, data)
  }

  return (
    <div className={cls.quizSection}>

      <button onClick={() => openQuizPreview(true, section)} >
        <img src={section.photo_file} alt="quizImage" />
        {/* <iframe src={section.photo_file} frameBorder="0"></iframe> */}
      </button>

    </div>
  )
}

export default QuizSection