import { useState } from 'react';

import Navbar from '../components/home/Navbar/Navbar';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../Utils/redirections/langRedirection/langRedirection';

import cls from './home.module.scss';

export default function Home({ locale }) {
  return (
    <div className={cls.home}>

      <Navbar />

      <div className={`${cls.wrapper} container`}>

        <div className={cls.one}>
          <img src="/imgs/one.png" alt="bookCover" />
          <h4>الصف الأول</h4>
        </div>

        <div className={cls.one}>
          <img src="/imgs/two.png" alt="bookCover" />
          <h4>الصف الثاني</h4>
        </div>

        <div className={cls.one}>
          <img src="/imgs/three.png" alt="bookCover" />
          <h4>الصف الثالث</h4>
        </div>

        <div className={cls.one}>
          <img src="/imgs/four.png" alt="bookCover" />
          <h4>الصف الرابع</h4>
        </div>

        <div className={cls.one}>
          <img src="/imgs/five.png" alt="bookCover" />
          <h4>الصف الخامس</h4>
        </div>

        <div className={cls.one}>
          <img src="/imgs/six.png" alt="bookCover" />
          <h4>الصف السادس</h4>
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