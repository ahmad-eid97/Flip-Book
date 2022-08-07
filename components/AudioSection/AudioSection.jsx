/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";

import axios from "../../Utils/axios";

import { format } from "date-fns";

import Cookies from "universal-cookie";

import cls from "./audioSection.module.scss";

const cookie = new Cookies();

const VideoSection = ({ audio, data }) => {
  const [audioOpened, setAudioOpened] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const Audio = useRef();

  const openAudio = async (status) => {
    switch (status) {
      case true:
        setAudioOpened(true);

        setStartTime(Date.now());

        Audio.current.play();

        const trackData = {
          page_section_id: data.id,
          event_category: "audio",
          event_action: "play",
          session_start_time: format(startTime, "yyyy-mm-dd hh:mm"),
          session_end_time: format(Date.now(), "yyyy-mm-dd hh:mm"),
          total_time: 0,
        };

        const response = await axios
          .post("/crm/students/book_reports", trackData, {
            headers: {
              Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
            },
          })
          .catch((err) => console.log(err));

        if (!response) return;

        console.log(response);

        break;
      case false:
        setAudioOpened(false);

        Audio.current.pause();

        const trackData2 = {
          page_section_id: data.id,
          event_category: "audio",
          event_action: "pause",
          session_start_time: format(startTime, "yyyy-mm-dd hh:mm"),
          session_end_time: format(Date.now(), "yyyy-mm-dd hh:mm"),
          total_time: (Date.now() - startTime) / 1000,
        };

        const response2 = await axios
          .post("/crm/students/book_reports", trackData2, {
            headers: {
              Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
            },
          })
          .catch((err) => console.log(err));

        if (!response2) return;
    }
  };

  return (
    <div className={cls.videoSection}>
      <span>{data.title}</span>
      <button
        className="wrapper"
        onClick={() => openAudio(audioOpened ? false : true)}
      >
        {audioOpened ? (
          <img src="/imgs/audio2.png" className={cls.playing} alt="image" />
        ) : (
          <img src="/imgs/audio.png" alt="image" />
        )}
        <audio
          src="/audios/audio.mp3"
          ref={Audio}
          onEnded={() => setAudioOpened(false)}
        ></audio>
      </button>
    </div>
  );
};

export default VideoSection;