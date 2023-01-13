/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../../../components/home/Navbar/Navbar';

import axios from '../../../Utils/axios';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../../../Utils/redirections/langRedirection/langRedirection';
import { routeRedirection } from './../../../Utils/redirections/routeRedirection/routeRedirection';

import cls from './books.module.scss';

export default function Books({ locale, books }) {
  const router = useRouter();

  return (
    <div className={cls.books}>

      <Navbar />

      <div className={`container`}>

        <div className={cls.wrapper}>

          {books.map(book => (
            <>
              {book.status && 
                <div key={book.id} className={cls.book} onClick={() => router.push(`/book/${book.id}`)}>
                  <img src={book.logo_file} alt="bookCover" />
                  <h5>{book.title}</h5>
                </div>
              }
            </>
          ))}

        </div>

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale, resolvedUrl, query }) {

  const languageRedirection = langRedirection(req, locale)

  const routerRedirection = routeRedirection(req, resolvedUrl)

  if( languageRedirection ) return languageRedirection;

  if( routerRedirection ) return routerRedirection;

  const { level, semester } = query;

  let books = []

  let BOOKS = await axios.get(`/crm/books?lang=${locale}&semester_id=${semester}&level_id=${level}`);

  if (BOOKS) books = BOOKS.data.data.books; 

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
      books
    }
  }
} 