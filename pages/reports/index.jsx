import { useState, useMemo } from "react";

import Navbar from "../../components/home/Navbar/Navbar";
import Choose from "./../../components/UIs/Choose/Choose";
import Loader from '../../components/UIs/Loader/Loader';

import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import axios from "../../Utils/axios";

import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

// import { PieChart, Pie } from "recharts";
import { Pie, PieChart, Legend, Tooltip } from "recharts";

import cls from "./reports.module.scss";

import Cookies from "universal-cookie";
const cookie = new Cookies();

const Reports = ({ allBooks }) => {
  const [choosedBook, setChoosedBook] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [bookCharts, setBookCharts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chooseBook = async (book) => {
    setLoading(true)
    setChoosedBook(book);
    const bookDetails = await axios.get(
      `/crm/students/book_reports?selected_book_id=${book.id}`,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
        },
      }
    ).catch(() => {
      setLoading(false)
    })

    if (!bookDetails.data.success) return setError("Something went wrong!");

    setBookData(bookDetails.data.data.book_reports.data);

    setBookCharts(bookDetails.data.data.charts)

    console.log(bookDetails.data.data)

    setLoading(false)
  };

  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "الصفحة",
        // First group columns
        accessor: "page.title",
      },
      {
        // Second group - Details
        Header: "قسم الصفحة",
        // Second group columns
        accessor: "page_section.title",
      },
      {
        // Second group - Details
        Header: "النوع",
        // Second group columns
        accessor: "type",
      },
      {
        // Second group - Details
        Header: "تصنيف الحدث",
        // Second group columns
        accessor: "event_category",
      },
      {
        // Second group - Details
        Header: "إجراء الحدث",
        // Second group columns
        accessor: "event_action",
      },
      {
        // Second group - Details
        Header: "وقت البدء",
        // Second group columns
        accessor: "session_start_time",
      },
      {
        // Second group - Details
        Header: "وقت الإنتهاء",
        // Second group columns
        accessor: "session_end_time",
      },
      {
        // Second group - Details
        Header: "الوقت الكلي",
        // Second group columns
        accessor: "total_time",
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: bookData },
    useGlobalFilter,
    useSortBy,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const data = [
    { name: "Total Time", value: 120 },
    { name: "Times", value: 100 },
  ];
      

  return (
    <div className={cls.reports}>
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

        <div className={cls.bookReports}>

          {loading && <Loader />}

          {bookData.length && !loading ? (
            <>
              <div className={cls.tableReports}>
                <Table {...getTableProps()}>
                  <TableHead>
                    {headerGroups.map((headerGroup, idx) => (
                      <TableRow
                        key={idx}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column, idx) => (
                          <TableCell key={idx} {...column.getHeaderProps()}>
                            {column.render("Header")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                      prepareRow(row);
                      return (
                        <TableRow key={i} {...row.getRowProps()}>
                          {row.cells.map((cell, idx) => {
                            return (
                              <TableCell key={idx} {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className={cls.chartsReports}>
                <div className={cls.chartsSection}>
                  <h5>تصنيف الحدث</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.event_category}
                        dataKey="num"
                        nameKey="label"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>إجراء الحدث</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.event_action}
                        dataKey="num"
                        nameKey="label"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>النوع</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.type}
                        dataKey="num"
                        nameKey="label"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>الكتاب</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.book_id}
                        dataKey="num"
                        nameKey="book.title_ar"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>الصفحة</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.page_id}
                        dataKey="num"
                        nameKey="book.title_ar"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>قسم الصفحة</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.page_section_id}
                        dataKey="num"
                        nameKey="book.title_ar"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>

                <div className={cls.chartsSection}>
                  <h5>الطالب</h5>
                  <div>
                    <PieChart width={300} height={300}>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="top" align="center" />
                      <Pie
                        data={bookCharts.student_id}
                        dataKey="num"
                        nameKey="book.title_ar"
                        cx={145}
                        cy={120}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#2980b9"
                        // startAngle={0}
                        // endAngle={360}
                        // paddingAngle={3}
                        // stroke="#2980b9"
                      />
                    </PieChart>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {!choosedBook && !loading && (
            <div className={cls.notChoosed}>
              <h4>إختر كتاب أولاَ لتظر التقارير!</h4>
            </div>
          )}

          {bookData.length <= 0 && !loading && choosedBook && (
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
