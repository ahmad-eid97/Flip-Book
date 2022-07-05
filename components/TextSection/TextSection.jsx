import cls from './textSection.module.scss';

const TextSection = ({ title, details }) => {
  return (
    <div className={cls.textSection}>

      <h5>{ title }</h5>

      <p dangerouslySetInnerHTML={{ __html: details }} ></p>

    </div>
  )
}

export default TextSection;