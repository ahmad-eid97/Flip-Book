import { useState, useEffect, useRef } from 'react';

import LayoutOne from '../../layouts/LayoutOne';
import { Page, BookFrontCover, BookBackCover, LangSwitch } from '../../components';

import PreviewModal from "../../components/modals/PreviewModal/PreviewModal";
import QuizModal from "../../components/modals/QuizModal/QuizModal";
import Flippy from '../../components/Flippy/Flippy';

import axios from '../../Utils/axios';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from '../../Utils/redirections/langRedirection/langRedirection';
import { routeRedirection } from '../../Utils/redirections/routeRedirection/routeRedirection';

import HTMLFlipBook from 'react-pageflip';

export default function Home({ locale, book, bookUnits, pages, ALL_PAGES }) {
  const [bookDetails, setBookDetails] = useState(book);
  const [bookUnitsDetails, setBookUnitsDetails] = useState(bookUnits);
  const [allPages, setAllPages] = useState(pages);
  const [openPreview, setOpenPreview] = useState(false);
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [previewType, setPreviewType] = useState();
  const [quizData, setQuizData] = useState();
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    setIsLoad(true);
  }, [])

  const { t, i18n } = useTranslation('common');

  const [name, setName] = useState('');

  const openModal = (state, data, type) => {
    setOpenPreview(state)
    setPreviewData(data)
    setPreviewType(type)
  }

  const openQuiz = (state, data, type) => {
    setOpenQuizModal(state)
    setQuizData(data)
  }

  let flipBook = useRef(null);
  let flippy = useRef(null)

  const bookCover = <div className="cover">
    <BookFrontCover logo={bookDetails.logo_file} title={bookDetails.title} level={bookDetails.level} />
  </div>

  const bookEnd = <div className="cover">
    <BookBackCover data="Book End" />
  </div>

  const bookPages = [
    bookCover,
    ...ALL_PAGES.map((page, idx) => (
      <div key={idx} className={`${page.title.split(" ")[0] === "Unit" ? 'unit' : ''} ${page.title.split(" ")[0] === "Lesson" ? 'lesson' : ''} demoPage`}>
        <Page openModal={openModal} data={page.page_sections ? page.page_sections : { title: page.title, details: page.details, photo: page.photo_file }} openQuiz={openQuiz} />
      </div>
    )),
    bookEnd
  ]

  const goToNextPage = () => {

  }

  const goToPrevPage = () => {
    
  }

  return (

    <LayoutOne>

      <div className="mainPage flipBook" id={locale}>

        {/* <LangSwitch locale={locale} />

        <h1><i className="fa-solid fa-house-user"></i> {t('welcome')}</h1> */}

        {
          isLoad && 
          <Flippy
            pageWidth={550}
            pageHeight={650}
            rtl={true}
            backSkin="#965A3B"
            pageSkin="#fff"
            breakpoint={992}
            flippingTime={500}
            disableSound={false}
            flipNext={goToNextPage}
            flipPrev={goToPrevPage}
            ref={flippy}
          >

            {[...bookPages]}

          </Flippy>
        }

        {openPreview && <PreviewModal setOpenPreview={setOpenPreview} imgSrc={previewData} previewType={previewType} />}

        {openQuizModal && <QuizModal setOpenQuizModal={setOpenQuizModal} quizData={quizData} />}

      </div>

    </LayoutOne>

  )
}

export async function getServerSideProps({ req, locale, resolvedUrl }) {

  const languageRedirection = langRedirection(req, locale)

  const routerRedirection = routeRedirection(req, resolvedUrl)

  if( languageRedirection ) return languageRedirection;

  if( routerRedirection ) return routerRedirection;

  // FETCH PAGES FOR BOOK
  let bookId = 1;

  let book = {}

  const bookResponse = await axios.get(`/crm/books/${bookId}?lang=${locale}`).catch(err => console.log(err));

  if(bookResponse) book = bookResponse.data.data;

  // FETCH BOOK UNITS
  let bookPages = []

  const unitsResponse = await axios.get(`/crm/books/all_pages_by_page_index/${bookId}?lang=${locale}`).catch(err => console.log(err));

  // EASY BEASY => FLAT ARRAY  ====>   FLAT MEANS CONVERT CHILDREN TO SIBLINGS
  // var ALL_PAGES = [];
  // if(unitsResponse) {
  //   bookPages = unitsResponse.data.data.pages;
  //   bookPages.forEach(page => {
  //     ALL_PAGES.unshift({ ...page, lessons: null });

  //     page.lessons.forEach(lesson => {
  //       ALL_PAGES.unshift({ ...lesson, pages: null });
        
  //       lesson.units.forEach(unit => {
  //         ALL_PAGES.unshift(unit);
  //       })
  //     })
  //   });
  // }

  var ALL_PAGES = [];
  if(unitsResponse) {
    bookPages = unitsResponse.data.data.pages;
    bookPages.sort((a, b) => a.id - b.id);
    bookPages.forEach(async page => {
      const unitFound = ALL_PAGES.findIndex(pa => pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson)
      if(unitFound <= -1) ALL_PAGES.push({ ...page.lesson.unit });

      const lessonFound = ALL_PAGES.findIndex(pa => pa.title === page.lesson.title && pa.unit && pa.unit.id === page.lesson.unit.id)
      if(lessonFound <= -1) ALL_PAGES.push({ ...page.lesson });

      const pageFound = ALL_PAGES.findIndex(pa => pa.title === page.title && pa.lesson && pa.lesson.id === page.lesson.id)
      if(pageFound <= -1) {
        ALL_PAGES.push({ ...page })
      };
    });
  }

  // FETCH ALL PAGES
  let pages = []
  let pagesLinks = {}
  let pagesMeta = {}

  const pagesResponse = await axios.get(`/crm/books/all_pages_by_page_index/${bookId}?lang=${locale}`).catch(err => console.log(err));

  if(pagesResponse) {
    pages = pagesResponse.data.data.pages
    pagesLinks = pagesResponse.data.data.links
    pagesMeta = pagesResponse.data.data.meta
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale,
      book,
      pages,
      pagesLinks,
      pagesMeta,
      ALL_PAGES
    }
  }
} 