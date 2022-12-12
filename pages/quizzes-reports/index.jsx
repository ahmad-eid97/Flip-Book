import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

import Navbar from "../../components/home/Navbar/Navbar";
import Choose from "./../../components/UIs/Choose/Choose";
import Loader from '../../components/UIs/Loader/Loader';
import QuizzesDetailsTable from '../../components/quizzesReports/QuizzesDetailsTable/QuizzesDetailsTable';
import QuizzesAttemptsTable from './../../components/quizzesReports/QuizzesAttemptsTable/QuizzesAttemptsTable';
import QuizzesAnswersTable from './../../components/quizzesReports/QuizzesAnswersTable/QuizzesAnswersTable';

import Container from "@mui/material/Container";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import axios from "../../Utils/axios";

import cls from "./quizzesReports.module.scss";

import Cookies from "universal-cookie";
const cookie = new Cookies();

const Reports = ({ allBooks }) => {
  const [choosedBook, setChoosedBook] = useState(null);
  const [quizzesData, setQuizzesData] = useState({});
  const [attemptsData, setAttemptsData] = useState({})
  const [answersData, setAnswersData] = useState({})
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchQuizDetails = async(bookId) => {
    setLoading(true)
    const response = await axios.get(`/crm/students/quiz/quizzes?selected_book_id=${bookId}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
      },
    }).catch(() => {
      setLoading(false)
    })
    setQuizzesData(response.data.data);
    setChoosedBook({...response.data.data.quizzes_attempts.data[0].book, title: response.data.data.quizzes_attempts.data[0].book.title_en})
    setLoading(false)
  }

  const fetchQuizAttempts = async (quizId) => {
    setLoading(true)
    const response = await axios.get(`/crm/students/quiz/quiz_attempts/${quizId}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
      },
    }).catch(() => {
      setLoading(false)
    })
    setAttemptsData(response.data.data)
    setLoading(false)
  }

  const fetchQuizAnswers = async (quizAttemptId) => {
    setLoading(true)
    const response = await axios.get(`/crm/students/quiz/attempt_answers/${quizAttemptId}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
      },
    }).catch(() => {
      setLoading(false)
    })
    setAnswersData(response.data.data)
    setLoading(false)
  }

  useEffect(() => {
    if (router.query.category === 'attempts') {
      fetchQuizAttempts(router.query.quizId)
    } 
    if (router.query.category === 'answers') {
      fetchQuizAnswers(router.query.quizAttemptId)
    }
    if (router.query.bookId) {
      fetchQuizDetails(router.query.bookId)
    }
  }, [])

  const chooseBook = async (book) => {
    router.push({ path: '/quizzes-reports', query: { bookId: book.id }})
    setLoading(true)
    setChoosedBook(book);
    const quizzesDetails = await axios.get(
      `/crm/students/quiz/quizzes?selected_book_id=${book.id}`,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
        },
      }
    ).catch(() => {
      setLoading(false)
    })

    // if (!bookDetails.data.success) return setError("Something went wrong!");

    setQuizzesData(quizzesDetails.data.data);

    setLoading(false)

    console.log(quizzesDetails.data.data);
  };

  const showSpecificTable = {
    attempts: <QuizzesAttemptsTable data={attemptsData} fetchQuizAnswers={fetchQuizAnswers} />,
    answers: <QuizzesAnswersTable data={answersData} />
  }
      

  return (
    <div className={cls.quizzesReports}>
      <Navbar />

      <Container maxWidth="xl">
        <div className={cls.choosingBook}>
          <label>إختر كتاب</label>
          <Choose
            placeholder="إختر كتاب"
            results={allBooks}
            choose={chooseBook}
            value={choosedBook ? choosedBook.title : ""}
            keyword="title"
          />
        </div>

        <div className={cls.reports}>

          {loading && <Loader />}

          {quizzesData?.quizzes_attempts?.data.length && !loading ? (
            <>
            {!router.query.category ? 
              <QuizzesDetailsTable data={quizzesData} fetchQuizAttempts={fetchQuizAttempts} /> 
              :
              showSpecificTable[router.query.category]
            }
            </>
          ) : null}

          {!choosedBook && !loading && (
            <div className={cls.notChoosed}>
              <h4>إختر كتاب أولاَ لتظر التقارير!</h4>
            </div>
          )}

          {quizzesData?.quizzes_attempts?.data.length <= 0 && !loading && choosedBook && (
            <div className={cls.notChoosed}>
              <h4>هذا الكتاب ليس له أي تقاير حتي الاَن!</h4>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ req, locale, resolvedUrl }) {
  const languageRedirection = langRedirection(req, locale);

  const routerRedirection = routeRedirection(req, resolvedUrl);

  if (languageRedirection) return languageRedirection;

  if (routerRedirection) return routerRedirection;

  let allBooks = [];
  const ALL_BOOKS = await axios.get(`/crm/books?lang=${locale}`);

  if (ALL_BOOKS) allBooks = ALL_BOOKS.data.data.books;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      allBooks,
    },
  };
}

export default Reports;
