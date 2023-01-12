import { useRouter } from "next/router";
import { useMultiStep } from "../../custom-hooks/useMultiStep";

import Navbar from "../../components/home/Navbar/Navbar";
import StudentDetails from "./../../components/student-details/StudentDetails/StudentDetails";
import BookReports from "./../../components/student-details/BookReports/BookReports";
import QuizReports from "./../../components/student-details/QuizReports/QuizReports";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import axios from "../../Utils/axios";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import cls from "./studentDetails.module.scss";

const Student = ({ studentId, studentDetails, allBooks }) => {
  const { currentStep, setCurrentStep, step } = useMultiStep([
    <StudentDetails key="first" studentDetails={studentDetails} />,
    <BookReports key="second" studentId={studentId} allBooks={allBooks} />,
    <QuizReports key="third" studentId={studentId} allBooks={allBooks} />,
  ]);
  const router = useRouter();

  const tabs = [
    {
      title: "تفاصيل الطالب",
      icon: <i className="fa-duotone fa-user"></i>,
    },
    {
      title: "تقارير الكتب",
      icon: <i className="fa-duotone fa-books"></i>,
    },
    {
      title: "تقارير الإختبارات",
      icon: <i className="fa-duotone fa-feather"></i>,
    },
  ];

  const changeTab = (idx) => {
    if (Object.keys(router.query).length > 1) {
      router.push({pathname: `/student/${studentId}`, query: {}})
    }
    setCurrentStep(idx);
  }
  return (
    <div className={cls.studentDetails}>
      <Navbar />
      <Container>
        <Grid container spacing={2}>
          <Grid item md={3}>
            <div className={cls.tabs}>
              {tabs.map((tab, idx) => (
                <p
                  key={idx}
                  onClick={() => changeTab(idx)}
                  className={currentStep === idx ? cls.active : ""}
                >
                  {tab.icon} {tab.title}
                </p>
              ))}
            </div>
          </Grid>
          <Grid item md={9}>
            <div className={cls.tabView}>{step}</div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ req, locale, resolvedUrl, params }) {
  const languageRedirection = langRedirection(req, locale);

  const routerRedirection = routeRedirection(req, resolvedUrl);

  if (languageRedirection) return languageRedirection;

  if (routerRedirection) return routerRedirection;

  let studentDetails = {};
  const studentResponse = await axios.get(
    `/crm/parents/students/${params.id}?lang=ar`,
    {
      headers: {
        Authorization: `Bearer ${req.cookies["EmicrolearnAuth"]}`,
      },
    }
  );
  studentDetails = studentResponse.data.data;

  // let bookReports = {};
  // const BookResponse = await axios.get(``);
  // bookReports = BookResponse.data.data;

  // let quizzesReports = {};
  // const quizResponse = await axios.get(``);
  // quizzesReports = quizResponse.data.data;

  let allBooks = [];
  const ALL_BOOKS = await axios.get(`/crm/books?lang=${locale}`);
  if (ALL_BOOKS) allBooks = ALL_BOOKS.data.data.books;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      studentId: params.id,
      studentDetails,
      allBooks
    },
  };
}

export default Student;
