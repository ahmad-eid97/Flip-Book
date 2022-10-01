import cls from './imageSection.module.scss';

const ImageSection = ({ image, page }) => {
  console.log(page)
  return (
    <div className={cls.imageSection}>

      {image && <img src={image} alt="pageImage" className={`${page.page_sections.length === 1 ? cls.fullImage : ''} ${page.page_sections.length === 2 ? cls.halfImage : ''}`} />}

    </div>
  )
}

export default ImageSection;