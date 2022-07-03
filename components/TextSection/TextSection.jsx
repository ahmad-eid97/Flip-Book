import cls from './textSection.module.scss';

const TextSection = ({ title, details }) => {
  return (
    <div className={cls.textSection}>

      <h2>{ title }</h2>

      <p dangerouslySetInnerHTML={{ __html: details }} ></p>

    </div>
  )
}

export default TextSection;