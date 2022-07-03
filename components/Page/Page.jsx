import ImageSection from '../ImageSection/ImageSection';
import TextSection from '../TextSection/TextSection';
import VideoSection from '../VideoSection/VideoSection';
import QuizSection from './../QuizSection/QuizSection';
import cls from './page.module.scss';

const Page = ({ data, openModal, openQuiz }) => {

  const renderSection = (type, section) => {
    if(type === 'text') {

      return <TextSection title={section.title} details={section.details} />

    } else if (type === 'image') {

      return <ImageSection image={section.photo_file} />

    } else if (type === 'video') {

      return <VideoSection video={section.video_link} openModal={openModal} />

    } else if (type === 'quiz') {

      return <QuizSection section={section} openQuiz={openQuiz} />

    }
  }

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

        <div>

          <h2>{ data.title }</h2>

          <p dangerouslySetInnerHTML={{ __html: data.details }}></p>

        </div>
    
      }

      {/* <button onClick={() => openPreview(true, data.image, 'image')}>test</button> */}

    </div>
  )
}

export default Page;