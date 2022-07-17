import cls from './correctAnswer.module.scss'

const CorrectAnswer = () => {
  return (
    <div className={cls.dropLayer}>

      <div className={cls.inside}>

        <audio autoPlay src="/audios/correct.mp3"></audio>

        <img src="/imgs/nerd.png" alt="correctImage" />

      </div>

    </div>
  )
}

export default CorrectAnswer