/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../../components/home/Navbar/Navbar';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from '../../Utils/redirections/langRedirection/langRedirection';
import { routeRedirection } from '../../Utils/redirections/routeRedirection/routeRedirection';

import axios from '../../Utils/axios';

import cls from './home.module.scss';

export default function Home({ locale, levels }) {

  const router = useRouter()

  const renderImages = (idx) => {
    switch (idx) {
      case idx = 0:
      return <img src="/imgs/one.png" alt="number" />
      
      case idx = 1:
      return <img src="/imgs/two.png" alt="number" />
      
      case idx = 2:
      return <img src="/imgs/three.png" alt="number" />
      
      case idx = 3:
      return <img src="/imgs/four.png" alt="number" />
      
      case idx = 4:
      return <img src="/imgs/five.png" alt="number" />
      
      case idx = 5:
      return <img src="/imgs/six.png" alt="number" />
    }
  }

  return (
    <div className={cls.home}>

      <Navbar />

      <div className={`${cls.wrapper} container`}>

        {levels.map((level, idx) => (

          <div key={level.id} className={cls.one} onClick={() => router.push(`/levels?level=${level.id}`)}>
            {renderImages(idx)}
            {/* <span>{idx + 1}</span> */}
            <h4>{level.title}</h4>
          </div>

        ))}

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale, resolvedUrl }) {

  const languageRedirection = langRedirection(req, locale)

  const routerRedirection = routeRedirection(req, resolvedUrl)

  if( languageRedirection ) return languageRedirection;

  if( routerRedirection ) return routerRedirection;

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