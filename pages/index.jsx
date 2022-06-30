import { useState, useRef } from 'react';

import LayoutOne from '../layouts/LayoutOne';
import { Page, BookFrontCover, BookBackCover, LangSwitch } from '../components';

import PreviewModal from "../components/modals/PreviewModal/PreviewModal";

import axios from '../Utils/axios';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../Utils/redirections/langRedirection/langRedirection';

import HTMLFlipBook from 'react-pageflip';

const pagesData = [
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  },
  {
    image: '/imgs/nature.jpg',
    details: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, incidunt? Dolores ad deserunt tenetur, sunt beatae voluptate dolor odio rem porro labore repudiandae, iste molestiae nostrum. Voluptas adipisci unde dicta?'
  }
]

export default function Home({ locale, book, bookUnits, pages, ALL_PAGES }) {
  const [bookDetails, setBookDetails] = useState(book);
  const [bookUnitsDetails, setBookUnitsDetails] = useState(bookUnits);
  const [allPages, setAllPages] = useState(pages)
  const [openPreview, setOpenPreview] = useState(false)
  const [previewData, setPreviewData] = useState()
  const [previewType, setPreviewType] = useState()

  const { t, i18n } = useTranslation('common');

  const [name, setName] = useState('');

  console.log(bookUnits)

  const openModal = (state, data, type) => {
    setOpenPreview(state)
    setPreviewData(data)
    setPreviewType(type)
  }

  let flipBook = useRef(null);

  const flipPage = (e) => {
    // if(name === '') {
    //   flipBook.current.pageFlip().turnToPrevPage()
    //   console.log('you must enter a name')
    // }

  }

  const check = (e) => {
    
    // if(e.data === 'user_fold' || e.data === 'flipping') {
    //   if(name === '') {
    //     console.log('should prevent here')
    //     // e.data = 'read'
    //     flipBook.current.pageFlip().userStop()
    //   }
    // }

  }

  return (

    <LayoutOne>

      <div id={locale} className="mainPage">

        {/* <LangSwitch locale={locale} />

        <h1><i className="fa-solid fa-house-user"></i> {t('welcome')}</h1> */}

        <HTMLFlipBook ref={flipBook} width={550} height={650} showCover={true} flippingTime={1500} onFlip={flipPage} onChangeState={(e) => check(e)}>
          
          <div className="cover">

            <BookFrontCover logo={bookDetails.logo_file} title={bookDetails.title} level={bookDetails.level} />

          </div>

          {
            ALL_PAGES.map((page, idx) => (
              <div key={idx} className="demoPage">
                {console.log(page)}
                {/* <h5>{ page.title }</h5> */}
                {/* <h6 dangerouslySetInnerHTML={{ __html: page.details }}></h6> */}
                <img src={page.photo_file} alt="image" />
              </div>
            ))
          }
          
          <div className="cover">
            <BookBackCover data="Book End" />
          </div>

        </HTMLFlipBook>

      </div>

      {openPreview && <PreviewModal setOpenPreview={setOpenPreview} imgSrc={previewData} previewType={previewType} />}

    </LayoutOne>

  )
}

export async function getServerSideProps({ req, locale }) {

  const languageRedirection = langRedirection(req, locale)

  if( languageRedirection ) return languageRedirection;

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
    bookPages.forEach(page => {
      const unitFound = ALL_PAGES.findIndex(pa => pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson)
      if(unitFound <= -1) ALL_PAGES.push({ ...page.lesson.unit });

      const lessonFound = ALL_PAGES.findIndex(pa => pa.title === page.lesson.title && pa.unit && pa.unit.id === page.lesson.unit.id)
      if(lessonFound <= -1) ALL_PAGES.push({ ...page.lesson });

      const pageFound = ALL_PAGES.findIndex(pa => pa.title === page.title && pa.lesson && pa.lesson.id === page.lesson.id)
      if(pageFound <= -1) ALL_PAGES.push({ ...page });
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
      // bookUnits,
      pages,
      pagesLinks,
      pagesMeta,
      ALL_PAGES
    }
  }
} 