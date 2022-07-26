/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import Navbar from '../components/home/Navbar/Navbar';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../Utils/redirections/langRedirection/langRedirection';

import axios from '../Utils/axios';

import cls from './home.module.scss';

export default function Home({ locale, levels }) {
  console.log(levels)
  return (
    <div className={cls.home}>

      <Navbar />

      <div className={`${cls.wrapper} container`}>

        {levels.map(level => (

          <div key={level.id} className={cls.one}>
            <img src="/imgs/one.png" alt="bookCover" />
            <h4>{level.title}</h4>
          </div>

        ))}

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale }) {

  const languageRedirection = langRedirection(req, locale)

  if( languageRedirection ) return languageRedirection;

  let levels = []

  let LEVELS = await axios.get(`/crm/levels?lang=${locale}`);

  if (LEVELS) levels = LEVELS.data.data.levels; 

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
      levels
    }
  }
} 