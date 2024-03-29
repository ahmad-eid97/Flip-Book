/* eslint-disable @next/next/no-page-custom-font */
import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";

import Loader from "../components/Loader/Loader";

import { appWithTranslation } from "next-i18next";

import { Provider } from "react-redux";
import store from "../store/store";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../public/css/all.min.css";
import "../styles/globals.scss";
import "../styles/variables.scss";

// Router.events.on('routeChangeStart', () => {
//   console.log('change starts')
// })

// Router.events.on('routeChangeComplete', () => {
//   console.log('change ended')
// })

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setLoading(true);
    });
    router.events.on("routeChangeComplete", () => {
      setLoading(false);
    });
  }, [router.events]);

  return (
    <>
      {/* BOOTSTRAP CSS AND JS INTEGERATION */}
      <Head>
        <title>Emicrolearn</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />
      {/* BOOTSTRAP CSS AND JS INTEGERATION */}

      <ToastContainer
        position={"top-right"}
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />

      <div style={{ position: "relative" }}>
        {loading && <Loader />}

        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </div>
    </>
  );
}

MyApp.getInitialProps = async (context) => {
  const savedLang = context.ctx.req.cookies["NEXT_LOCALE"];

  // GET APP LANGUAGE
  if (!savedLang) {
    if (context.ctx.locale) {
      context.ctx.res.setHeader(
        "set-cookie",
        `NEXT_LOCALE=${context.ctx.locale};path=/`
      );
    } else {
      context.ctx.res.setHeader("set-cookie", `NEXT_LOCALE=en;path=/`);
    }
  } else {
    context.ctx.res.setHeader("set-cookie", `NEXT_LOCALE=${savedLang};path=/`);
  }

  return {};
};

export default appWithTranslation(MyApp);
