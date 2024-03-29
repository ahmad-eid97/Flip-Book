/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";

import { useState, useEffect, useRef } from "react";

import LayoutOne from "../../layouts/LayoutOne";
import {
  Page,
  BookFrontCover,
  BookBackCover,
  LangSwitch,
} from "../../components";

import PreviewModal from "../../components/modals/PreviewModal/PreviewModal";
import QuizModal from "../../components/modals/QuizModal/QuizModal";
import Flippy from "../../components/Flippy/Flippy";
import SectionPreview from "../../components/modals/SectionPreview/SectionPreview";

import Cookies from "universal-cookie";

import axios from "../../Utils/axios";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "../../Utils/redirections/routeRedirection/routeRedirection";

const cookie = new Cookies();

import HTMLFlipBook from "react-pageflip";
import AdverSection from "../../components/AdverSection/AdverSection";

export default function Home({
  locale,
  book,
  bookUnits,
  pages,
  ALL_PAGES,
  pagesLinks,
}) {
  const [allBookPages, setAllBookPages] = useState(ALL_PAGES);
  const [bookDetails, setBookDetails] = useState(book);
  const [bookUnitsDetails, setBookUnitsDetails] = useState(bookUnits);
  const [allPages, setAllPages] = useState(pages);
  const [openPreview, setOpenPreview] = useState(false);
  const [openSectionPreview, setOpenSectionPreview] = useState(false);
  const [sectionPreviewData, setSectionPreviewData] = useState({});
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [previewType, setPreviewType] = useState();
  const [sectionId, setSectionId] = useState();
  const [quizData, setQuizData] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [navLinks, setNavLinks] = useState(pagesLinks);
  const [bookWidth, setBookWidth] = useState(550);
  const [bookHeight, setBookHeight] = useState(620);

  useEffect(() => {
    if (window.innerWidth <= 550) {
      setBookWidth(window.innerWidth - 50);
      setBookHeight(500);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1300) {
        setBookWidth(550);
        setBookHeight(620);
      } else if (window.innerWidth <= 550) {
        setBookWidth(window.innerWidth - 10);
        setBookHeight(450);
      } else if (window.innerWidth > 992 && window.innerWidth < 1300) {
        setBookWidth(window.innerWidth / 2 - 50);
        setBookHeight((window.innerWidth - 50) * 1.35);
      } else if (window.innerWidth > 550 && window.innerWidth < 992) {
        setBookWidth(500);
        setBookHeight((window.innerWidth - 50) * 1.35);
      }
    });
  }, [bookWidth, bookHeight]);

  useEffect(() => {
    document
      .querySelector(":root")
      .style.setProperty("--book-color", bookDetails.color);
  }, []);

  useEffect(() => {
    setIsLoad(true);
  }, []);

  const { t, i18n } = useTranslation("common");

  const openModal = (state, data, type) => {
    setOpenPreview(state);
    setPreviewData(data);
    setPreviewType(type);
  };

  const openSectionPreviewModal = (state, data, type) => {
    setPreviewData(data.video_link);
    setSectionPreviewData(data);
    setOpenSectionPreview(state);
    setPreviewType(type);
  };

  const openQuiz = (state, data, type) => {
    setOpenQuizModal(state);
    setQuizData(data);
  };

  let flippy = useRef(null);

  const bookCover = (
    <div className="cover">
      <BookFrontCover
        logo={bookDetails.logo_file}
        title={bookDetails.title}
        level={bookDetails.level}
      />
    </div>
  );

  const bookEnd = (
    <div className="cover">
      <BookBackCover direction={bookDetails.direction} />
    </div>
  );

  const bookPages = [
    bookCover,
    ...allBookPages.map((page, idx) => (
      <div
        key={idx}
        className={`${page.title.split(" ")[0] === "Unit" ? "unit" : ""} ${
          page.title.split(" ")[0] === "Lesson" ? "lesson" : ""
        } demoPage`}
      >
        <Page
          openModal={openModal}
          data={
            page.page_sections
              ? page.page_sections
              : {
                  title: page.title,
                  details: page.details,
                  photo: page.photo_file,
                }
          }
          openQuiz={openQuiz}
          index={idx}
          setSectionId={setSectionId}
          direction={bookDetails.direction}
          footerLogo={bookDetails.footer_logo}
          footerNumLogo={bookDetails.footer_number_logo}
          page={page}
          openSectionPreviewModal={openSectionPreviewModal}
          sectionPreviewData={sectionPreviewData}
        />
      </div>
    )),
    bookEnd,
  ];

  const goToNextPage = async (pageNum) => {
    if (flippy.getCurrentPageNumber() % 30 === 0) {
      setPageNumber((pageNumber += 1));

      let allPages = [...allBookPages];

      if (navLinks.next) {
        const response = await axios
          .get(navLinks.next)
          .catch((err) => console.log(err));

        if (!response) return;

        setNavLinks(response.data.data.links);

        bookPages = response.data.data.pages;
        // bookPages.sort((a, b) => a.id - b.id);
        bookPages.forEach(async (page) => {
          const unitFound = allPages.findIndex(
            (pa) =>
              pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson
          );
          if (unitFound === -1) allPages.push({ ...page.lesson.unit });

          const lessonFound = allPages.findIndex(
            (pa) =>
              pa.title === page.lesson.title &&
              pa.unit &&
              pa.unit.id === page.lesson.unit.id
          );
          if (lessonFound <= -1) allPages.push({ ...page.lesson });

          const pageFound = allPages.findIndex(
            (pa) =>
              pa.title === page.title &&
              pa.lesson &&
              pa.lesson.id === page.lesson.id
          );
          if (pageFound <= -1) {
            allPages.push({ ...page });
          }
        });

        setAllBookPages([...allPages]);
      }
    }
  };

  const goToPrevPage = () => {};

  const goToPage = (pageNum) => {
    // let pageNumber = +pageNum / 2;
    flippy.goToPage(+pageNum + 1);
  };

  const enterToGoToPage = async (e, pageNum) => {
    if (e.keyCode === 13) {
      setPageNumber(+pageNum);
      flippy.goToPage(+pageNum + 1);
      if (pageNum > 30) {
        if (navLinks.next) {
          let allPages = [];
          const response = await axios
            .get(navLinks.next)
            .catch((err) => console.log(err));

          if (!response) return;

          setNavLinks(response.data.data.links);

          bookPages = response.data.data.pages;
          bookPages.forEach(async (page) => {
            const unitFound = allPages.findIndex(
              (pa) =>
                pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson
            );
            if (unitFound <= -1) allPages.push({ ...page.lesson.unit });

            const lessonFound = allPages.findIndex(
              (pa) =>
                pa.title === page.lesson.title &&
                pa.unit &&
                pa.unit.id === page.lesson.unit.id
            );
            if (lessonFound <= -1) allPages.push({ ...page.lesson });

            const pageFound = allPages.findIndex(
              (pa) =>
                pa.title === page.title &&
                pa.lesson &&
                pa.lesson.id === page.lesson.id
            );
            if (pageFound <= -1) {
              allPages.push({ ...page });
            }
          });

          setAllBookPages((prev) => [...prev, ...allPages]);
        }
      }
    }
  };

  return (
    <LayoutOne>
      <Head>
        <link href={bookDetails.font_url} rel="stylesheet"></link>
      </Head>

      <div
        className="mainPage flipBook"
        id={locale}
        style={{
          fontFamily: bookDetails.font_name,
          direction: `${bookDetails.direction} !important`,
          textAlign:
            `${bookDetails.direction}` === "rtl"
              ? "rtl !important"
              : "ltr !important",
        }}
      >
        {bookDetails.direction === "rtl" ? (
          <button className="next" onClick={() => flippy.flipPrev()}>
            <i className="fa-regular fa-angles-right"></i>
          </button>
        ) : (
          <button className="next" onClick={() => flippy.flipPrev()}>
            <i className="fa-regular fa-angles-left"></i>
          </button>
        )}

        {isLoad && (
          <Flippy
            pageWidth={bookWidth}
            pageHeight={bookHeight}
            rtl={bookDetails.direction === "rtl" ? true : false}
            backSkin={bookDetails.color}
            pageSkin="#fff"
            breakpoint={992}
            flippingTime={500}
            disableSound={false}
            flipNext={(pageNum) => goToNextPage(pageNum)}
            flipPrev={goToPrevPage}
            ref={flippy}
          >
            {[...bookPages]}
          </Flippy>
        )}

        {bookDetails.direction === "rtl" ? (
          <button className="next" onClick={() => flippy.flipNext()}>
            <i className="fa-regular fa-angles-left"></i>
          </button>
        ) : (
          <button className="next" onClick={() => flippy.flipNext()}>
            <i className="fa-regular fa-angles-right"></i>
          </button>
        )}

        {/* AVERTISMENT SECTION */}
        {book.ads.map((one) => (
          <AdverSection key={one.id} data={one} />
        ))}

        {openPreview && (
          <PreviewModal
            setOpenPreview={setOpenPreview}
            imgSrc={previewData}
            previewType={previewType}
            sectionId={sectionId}
            direction={bookDetails.direction}
          />
        )}

        {openSectionPreview && (
          <SectionPreview
            setOpenPreview={setOpenSectionPreview}
            sectionPreviewData={sectionPreviewData}
            direction={bookDetails.direction}
            setOpenModalPreview={setOpenPreview}
          />
        )}

        {openQuizModal && (
          <QuizModal
            setOpenPreview={openModal}
            setOpenQuizModal={setOpenQuizModal}
            quizData={quizData}
            sectionId={sectionId}
            direction={bookDetails.direction}
          />
        )}
      </div>

      <div className="bookPageFooter">
        {bookDetails.direction === "rtl" ? (
          <button onClick={() => goToPage(pages.length)}>
            <i className="fa-regular fa-angles-left"></i>
          </button>
        ) : (
          <button onClick={() => goToPage(2)}>
            <i className="fa-regular fa-angles-left"></i>
          </button>
        )}

        <input
          type="number"
          onKeyUp={(e) => enterToGoToPage(e, e.target.value)}
        />

        {bookDetails.direction === "rtl" ? (
          <span>إذهب إلي الصفحة</span>
        ) : (
          <span>Go to page</span>
        )}

        {bookDetails.direction === "rtl" ? (
          <button onClick={() => goToPage(2)}>
            <i className="fa-regular fa-angles-right"></i>
          </button>
        ) : (
          <button onClick={() => goToPage(pages.length)}>
            <i className="fa-regular fa-angles-right"></i>
          </button>
        )}
      </div>
    </LayoutOne>
  );
}

export async function getServerSideProps({ req, locale, resolvedUrl, query }) {
  const languageRedirection = langRedirection(req, locale);

  const routerRedirection = routeRedirection(req, resolvedUrl);

  if (languageRedirection) return languageRedirection;

  if (routerRedirection) return routerRedirection;

  // FETCH PAGES FOR BOOK
  let book = {};

  const bookResponse = await axios
    .get(`/crm/books/${query.id}?lang=${locale}`)
    .catch((err) => console.log(err));

  if (bookResponse) book = bookResponse.data.data;

  // FETCH BOOK UNITS
  let bookPages = [];

  const unitsResponse = await axios
    .get(`/crm/books/all_pages_by_page_index/${query.id}?lang=${locale}`)
    .catch((err) => console.log(err));

  var ALL_PAGES = [];
  if (unitsResponse) {
    bookPages = unitsResponse.data.data.pages;
    // bookPages.sort((a, b) => a.id - b.id);
    bookPages.forEach(async (page) => {
      const unitFound = ALL_PAGES.findIndex(
        (pa) => pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson
      );
      if (unitFound <= -1) ALL_PAGES.push({ ...page.lesson.unit });

      const lessonFound = ALL_PAGES.findIndex(
        (pa) =>
          pa.title === page.lesson.title &&
          pa.unit &&
          pa.unit.id === page.lesson.unit.id
      );
      if (lessonFound <= -1) ALL_PAGES.push({ ...page.lesson });

      const pageFound = ALL_PAGES.findIndex(
        (pa) =>
          pa.title === page.title &&
          pa.lesson &&
          pa.lesson.id === page.lesson.id
      );
      if (pageFound <= -1) {
        ALL_PAGES.push({ ...page });
      }
    });
  }

  // FETCH ALL PAGES
  let pages = [];
  let pagesLinks = {};
  let pagesMeta = {};

  const pagesResponse = await axios
    .get(`/crm/books/all_pages_by_page_index/${query.id}?lang=${locale}`)
    .catch((err) => console.log(err));

  if (pagesResponse) {
    pages = pagesResponse.data.data.pages;
    pagesLinks = pagesResponse.data.data.links;
    pagesMeta = pagesResponse.data.data.meta;
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      locale,
      book,
      pages,
      pagesLinks,
      pagesMeta,
      ALL_PAGES,
    },
  };
}
