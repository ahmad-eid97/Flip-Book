/* eslint-disable @next/next/no-img-element */
import cls from './imageWithAudio.module.scss';

const ImageWithAudio = ({ section, page, openSectionPreviewModal }) => {
  const openPreview = () => {
    openSectionPreviewModal(true, section)
  }

  return (
    <div className={cls.section} onClick={openPreview}>
      <img src={section.photo_file} alt="imageTitle" className={`${page.page_sections.length === 1 ? cls.fullImage : ''} ${page.page_sections.length === 2 ? cls.halfImage : ''}`} />
      <div className={cls.sectionIcon}>
        <i className="fa-duotone fa-eye"></i>
      </div>
    </div>
  )
}

export default ImageWithAudio