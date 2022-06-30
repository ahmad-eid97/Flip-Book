import Head from "next/head";
import Script from "next/script";

import { appWithTranslation } from "next-i18next";

import '../public/css/all.min.css';
import '../styles/globals.scss';
import '../styles/variables.scss'

function MyApp({ Component, pageProps }) {
  return (
    <>

      {/* BOOTSTRAP CSS AND JS INTEGERATION */}
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
      </Head>
      
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
        crossOrigin="anonymous"
      />
      {/* BOOTSTRAP CSS AND JS INTEGERATION */}

      <Component {...pageProps} />

    </>
  )
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
    context.ctx.res.setHeader(
      "set-cookie",
      `NEXT_LOCALE=${savedLang};path=/`
    );
  }

  return {

  }

}

export default appWithTranslation(MyApp)
