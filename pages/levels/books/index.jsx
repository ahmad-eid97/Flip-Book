import { useState } from 'react';

import Navbar from '../../../components/home/Navbar/Navbar';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../../../Utils/redirections/langRedirection/langRedirection';
import { routeRedirection } from './../../../Utils/redirections/routeRedirection/routeRedirection';

import cls from './books.module.scss';

export default function Books({ locale }) {
  return (
    <div className={cls.books}>

      <Navbar />

      <div className={`container`}>

        <div className={cls.wrapper}>

          <div className={cls.book}>
            <img src="/imgs/bookCover2.jpg" alt="bookCover" />
            <h5>التربية الإسلامية</h5>
          </div>

          <div className={cls.book}>
            <img src="/imgs/bookCover.png" alt="bookCover" />
            <h5>الرياضيات</h5>
          </div>

        </div>

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale, resolvedUrl }) {

  const languageRedirection = langRedirection(req, locale)

  const routerRedirection = routeRedirection(req, resolvedUrl)

  if( languageRedirection ) return languageRedirection;

  if( routerRedirection ) return routerRedirection;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
} 