/* eslint-disable @next/next/no-img-element */
import cls from "./activitySection.module.scss";

const ActivitySection = ({ activity, openModal, data }) => {
  const openPreview = (state, data, type) => {
    openModal(state, data, type);
  };

  console.log(activity);

  return (
    <div className={cls.videoSection}>
      <span>{data.title}</span>
      <button
        className="wrapper"
        onClick={() => openPreview(true, activity, "activity")}
      >
        <img src="/imgs/activity.png" alt="image" />
      </button>
    </div>
  );
};

export default ActivitySection;
