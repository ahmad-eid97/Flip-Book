/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import ImageSection from "../ImageSection/ImageSection";
import TextSection from "../TextSection/TextSection";
import VideoSection from "../VideoSection/VideoSection";
import AudioSection from "./../AudioSection/AudioSection";
import QuizSection from "./../QuizSection/QuizSection";
import ImageWithAudio from "../ImageWithAudio/ImageWithAudio";
import ImageWithVideo from "../ImageWithVideo/ImageWithVideo";
import ActivitySection from "../ActivitySection/ActivitySection";

import cls from "./page.module.scss";

const Page = ({
  data,
  openModal,
  openSectionPreview,
  openQuiz,
  index,
  setSectionId,
  footerLogo,
  footerNumLogo,
  direction,
  page,
  openSectionPreviewModal,
  sectionPreviewData,
}) => {
  console.log(data);

  const renderSection = (type, section) => {
    setSectionId(section.id);
    if (type === "text") {
      return (
        <TextSection
          title={section.title}
          details={section.details}
          sectionId={section.id}
          direction={direction}
        />
      );
    } else if (type === "image") {
      return <ImageSection image={section.photo_file} page={page} />;
    } else if (type === "video") {
      return (
        <VideoSection
          video={section.video_link}
          openModal={openModal}
          data={section}
        />
      );
    } else if (type === "audio") {
      return (
        <AudioSection
          audio={section.audio_link}
          openModal={openModal}
          data={section}
        />
      );
    } else if (type === "activity") {
      return (
        <ActivitySection
          activity={section.iframe}
          openModal={openModal}
          data={section}
        />
      );
    } else if (type === "quiz") {
      return <QuizSection section={section} openQuiz={openQuiz} />;
    } else if (type === "big_image_with_audio") {
      return (
        <ImageWithAudio
          section={section}
          openQuiz={openQuiz}
          page={page}
          openModal={openSectionPreview}
          openSectionPreviewModal={openSectionPreviewModal}
          sectionPreviewData={sectionPreviewData}
        />
      );
    } else if (type === "big_image_with_video") {
      return (
        <ImageWithVideo
          section={section}
          openQuiz={openQuiz}
          page={page}
          openModal={openSectionPreview}
          openSectionPreviewModal={openSectionPreviewModal}
          sectionPreviewData={sectionPreviewData}
          openVideoModal={openModal}
        />
      );
    }
  };

  return (
    <div className={cls.page}>
      {data.length >= 0 ? (
        <>
          {data.map((section, idx) => (
            <div key={idx}>{renderSection(section.type, section)}</div>
          ))}
        </>
      ) : (
        <div className={cls.headPages}>
          {/* <div className={cls.title}>

            <h2>{ data.title }</h2>

            <p dangerouslySetInnerHTML={{ __html: data.details }} className="label"></p>

          </div> */}

          {data.photo && <img src={data.photo} alt="Img" />}
        </div>
      )}

      <div className={cls.footer}>
        {footerLogo && <img src={footerLogo} alt="footerLogo" />}

        <div
          className={`${cls.pageNum} ${
            direction === "rtl" ? cls.arabic : cls.english
          }`}
        >
          {footerNumLogo ? (
            <>
              <p>{index + 1}</p>

              <img src={footerNumLogo} alt="footerImage" />
            </>
          ) : (
            <p className={cls.numWithNoImg}>{index + 1}</p>
          )}
        </div>
      </div>

      {/* <button onClick={() => openPreview(true, data.image, 'image')}>test</button> */}
    </div>
  );
};

export default Page;
