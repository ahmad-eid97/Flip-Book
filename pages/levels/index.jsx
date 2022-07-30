/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../../components/home/Navbar/Navbar';

import axios from '../../Utils/axios';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../../Utils/redirections/langRedirection/langRedirection';
import { routeRedirection } from './../../Utils/redirections/routeRedirection/routeRedirection';

import cls from './levels.module.scss';

export default function Levels({ locale, semesters }) {
  const router = useRouter()

  console.log(router.query)

  return (
    <div className={cls.levels}>

      <Navbar />

      <div className={`${cls.wrapper} container`}>

        {semesters.map((semester, idx) => (

          <div key={semester.id} className={cls.one} onClick={() => router.push({pathname: '/levels/books', query: {...router.query, semester: semester.id}})}>
            {idx === 0 ?
            <img src="/imgs/num1.png" alt="bookCover" />
            :
            <img src="/imgs/num2.png" alt="bookCover" /> 
            }
            <h4>{semester.title}</h4>
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

  let semesters = []

  let SEMESTERS = await axios.get(`/crm/semesters?lang=${locale}`);

  if (SEMESTERS) semesters = SEMESTERS.data.data.semesters; 

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
      semesters
    }
  }
} 