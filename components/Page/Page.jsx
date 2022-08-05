/* eslint-disable @next/next/no-img-element */
import ImageSection from '../ImageSection/ImageSection';
import TextSection from '../TextSection/TextSection';
import VideoSection from '../VideoSection/VideoSection';
import QuizSection from './../QuizSection/QuizSection';

import cls from './page.module.scss';
import { useEffect } from 'react';

const Page = ({ data, openModal, openQuiz, index, setSectionId, footerLogo, footerNumLogo }) => {

  const renderSection = (type, section) => {
    setSectionId(section.id)
    if(type === 'text') {

      return <TextSection title={section.title} details={section.details} sectionId={section.id} />

    } else if (type === 'image') {

      return <ImageSection image={section.photo_file} />

    } else if (type === 'video') {

      return <VideoSection video={section.video_link} openModal={openModal} data={section} />

    } else if (type === 'quiz') {

      return <QuizSection section={section} openQuiz={openQuiz} />

    }
  }

  useEffect(() => {
  })

  return (
    <div className={cls.page}>

      {data.length >= 0 ?

        <>

          {data.map((section, idx) => (

            <div key={idx}>

              {renderSection(section.type, section)}

            </div>

          ))}

        </>
      
        :

        <div className={cls.headPages}>

          {/* <div className={cls.title}>

            <h2>{ data.title }</h2>

            <p dangerouslySetInnerHTML={{ __html: data.details }} className="label"></p>

          </div> */}

          <img src={data.photo} alt="" />

        </div>
    
      }

      <div className={cls.footer}>

        <img src={footerLogo} alt="footerLogo" />

        <div className={cls.pageNum}>

          <p>{index + 1}</p>

          <img src={footerNumLogo} alt="footerLogo" />

        </div>

      </div>

      {/* <button onClick={() => openPreview(true, data.image, 'image')}>test</button> */}

    </div>
  )
}

export default Page;