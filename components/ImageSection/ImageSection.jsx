import cls from './imageSection.module.scss';

const ImageSection = ({ image }) => {
  return (
    <div className={cls.imageSection}>

      <img src={image} alt="pageImage" />

    </div>
  )
}

export default ImageSection;