/* eslint-disable @next/next/no-img-element */
import cls from "./loader.module.scss";

const Loader = () => {
  return (
    <div className={cls.lds_spinner}>
      <img src="/imgs/loading.png" alt="loadingImage" />
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
