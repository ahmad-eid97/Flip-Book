/* eslint-disable @next/next/no-img-element */
import cls from "./activitySection.module.scss";

const ActivitySection = ({ activity, openModal, data }) => {
  const openPreview = (state, data, type) => {
    openModal(state, data, type);
  };

  return (
    <div className={cls.activitySection}>
      {/* <span>{data.title}</span> */}
      {data.photo_file ? (
        <div
          className={cls.activityImagePreview}
          onClick={() => openPreview(true, activity, "activity")}
        >
          <img src={data.photo_file} alt="activity_image" />

          <div className={cls.questionIcon}>
            <i className="fa-regular fa-chart-network"></i>
          </div>
        </div>
      ) : (
        <button
          className="wrapper"
          onClick={() => openPreview(true, activity, "activity")}
        >
          <img src="/imgs/activity.png" alt="image" />
        </button>
      )}
    </div>
  );
};

export default ActivitySection;
