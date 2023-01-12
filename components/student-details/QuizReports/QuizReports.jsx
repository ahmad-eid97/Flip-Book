import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import QuizzesDetailsTable from "../../quizzesReports/QuizzesDetailsTable/QuizzesDetailsTable";
import QuizzesAttemptsTable from "../../quizzesReports/QuizzesAttemptsTable/QuizzesAttemptsTable";
import QuizzesAnswersTable from "../../quizzesReports/QuizzesAnswersTable/QuizzesAnswersTable";
import Loader from "../../UIs/Loader/Loader";
import Choose from "../../UIs/Choose/Choose";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import axios from '../../../Utils/axios';

import Cookies from 'universal-cookie'

import cls from "./quizReports.module.scss";

const cookie = new Cookies();

const QuizReports = ({ studentId, allBooks }) => {
  const [choosedBook, setChoosedBook] = useState(null);
  const [quizzesData, setQuizzesData] = useState({});
  const [attemptsData, setAttemptsData] = useState({})
  const [answersData, setAnswersData] = useState({})
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchQuizDetails = async(bookId) => {
    setLoading(true)
    const response = await axios.get(`/crm/parents/students/quiz/quizzes/${studentId}?selected_book_id=${bookId}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
      },
    }).catch(() => {
      setLoading(false)
    })
    setQuizzesData(response.data.data);
    setChoosedBook({...response.data.data.quizzes_attempts.data[0]?.book, title: response.data.data.quizzes_attempts.data[0]?.book.title_en})
    setLoading(false)
  }

  const fetchQuizAttempts = async (quizId) => {
    setLoading(true)
    const response = await axios.get(`/crm/parents/students/quiz/quiz_attempts/${quizId}/${studentId}`,
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
    const response = await axios.get(`/crm/parents/students/quiz/attempt_answers/${quizAttemptId}/${studentId}`,
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

  const chooseBook = async (book) => {
    router.push({ pathname: `/student/${studentId}`, query: { bookId: book.id }})
    setLoading(true)
    setChoosedBook(book);
    const quizzesDetails = await axios.get(
      // `/crm/students/quiz/quizzes?selected_book_id=${book.id}`,
      `/crm/parents/students/quiz/quizzes/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
        },
      }
    ).catch(() => {
      setLoading(false)
    })

    setQuizzesData(quizzesDetails.data.data);

    setLoading(false)
  };

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

  const showSpecificTable = {
    attempts: <QuizzesAttemptsTable path={`/student/${studentId}`} data={attemptsData} fetchQuizAnswers={fetchQuizAnswers} />,
    answers: <QuizzesAnswersTable path={`/student/${studentId}`} data={answersData} />
  }

  return <div className={cls.quizReports}>
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
              <QuizzesDetailsTable path={`/student/${studentId}`} data={quizzesData} fetchQuizAttempts={fetchQuizAttempts} /> 
              :
              showSpecificTable[router.query.category]
            }
            </>
          ) : null}

          {!choosedBook && !loading && (
            <div className={cls.notChoosed}>
              <h4>إختر كتاب أولاَ لتظهر التقارير!</h4>
            </div>
          )}

          {quizzesData?.quizzes_attempts?.data.length <= 0 && !loading && choosedBook && (
            <div className={cls.notChoosed}>
              <h4>هذا الكتاب ليس له أي تقاير إختبارات حتي الاَن!</h4>
            </div>
          )}
        </div>
      </Container>
  </div>;
};

export default QuizReports;
