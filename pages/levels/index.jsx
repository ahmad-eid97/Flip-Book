import { useState } from 'react';

import Navbar from '../../components/home/Navbar/Navbar';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../../Utils/redirections/langRedirection/langRedirection';

import cls from './levels.module.scss';

export default function Levels({ locale }) {
  return (
    <div className={cls.levels}>

      <Navbar />

      <div className={`${cls.wrapper} container`}>

        <div className={cls.one}>
          <img src="/imgs/num1.png" alt="bookCover" />
          <h4>الفصل الأول</h4>
        </div>

        <div className={cls.one}>
          <img src="/imgs/num2.png" alt="bookCover" />
          <h4>الفصل الثاني</h4>
        </div>

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale }) {

  const languageRedirection = langRedirection(req, locale)

  if( languageRedirection ) return languageRedirection;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
} 