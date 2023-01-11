/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
import { userActions } from "./../../store/userSlice";

import Loader from "../../components/Loader/Loader";

import Cookies from "universal-cookie";

import axios from "../../Utils/axios";

import { toast } from "react-toastify";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import { useTranslation } from "next-i18next";

import cls from "./login.module.scss";

const cookie = new Cookies();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const login = async () => {
    if (email && password) {
      setLoading(true);

      const response = await axios
        .post("/crm/students/auth/login", { email, password })
        .catch((err) => errorNotify("خطأ في البريد الإلكتروني أو كلمة المرور"));

      if (!response || !response.data || !response.data.data) {
        setLoading(false);
        return errorNotify("خطأ في البريد الإلكتروني أو كلمة المرور");
      }

      cookie.set("EmicrolearnAuth", response.data.data.access_token, {
        path: "/",
      });

      cookie.set(
        "EmicrolearnUser",
        JSON.stringify({ ...response.data.data.student, type: "student" }),
        {
          path: "/",
        }
      );

      dispatch(
        userActions.setUser({ ...response.data.data.parent, type: "student" })
      );

      setTimeout(() => {
        router.push("/home");
      }, 100);

      setLoading(false);
    }
  };
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={cls.login}>
      {loading && <Loader />}

      <img src="/imgs/logo.png" alt="logo" />

      <div className={cls.area}>
        <h3>تسجيل دخول الطلاب</h3>

        <div className={`${cls.field} ${i18n.language}`}>
          <input
            type="text"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <i className="fa-regular fa-user"></i>
        </div>

        <div className={`${cls.field} ${i18n.language}`}>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <i className="fa-regular fa-key"></i>
        </div>

        <button onClick={login} className={`${i18n.language}`}>
          دخول <i className="fa-light fa-arrow-right-to-bracket"></i>
        </button>

        <p onClick={() => router.push("/login-parents")}>
          تسجيل الدخول كـ <span>ولي أمر</span>
        </p>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req, locale, resolvedUrl }) {
  const languageRedirection = langRedirection(req, locale);

  const routerRedirection = routeRedirection(req, resolvedUrl);

  if (languageRedirection) return languageRedirection;

  if (routerRedirection) return routerRedirection;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Login;
