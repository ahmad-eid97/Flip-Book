import { useMemo } from "react";
import { useRouter } from "next/router";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import axios from "../../../Utils/axios";

import { Pie, PieChart, Legend, Tooltip } from "recharts";

import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

import cls from "./quizzesAttemptsTable.module.scss";

import Cookies from "universal-cookie"; 
const cookie = new Cookies();

const QuizzesAttemptsTable = ({ data, fetchQuizAnswers }) => {
  const router = useRouter();

  const getAnswersData = (quizAttemptId) => {
    fetchQuizAnswers(quizAttemptId)
    router.push({ path: '/quizzes-reports', query: { ...router.query, category: 'answers', quizAttemptId }})
  }

  const columns = useMemo(
    () => [
      {
        // Second group - Details
        Header: "قسم الصفحة",
        // Second group columns
        accessor: "page_section.title",
      },
      {
        // first group - TV Show
        Header: "كل الأسئلة",
        // First group columns
        accessor: "total_questions",
      },
      {
        // Second group - Details
        Header: "المجاب عنهم",
        // Second group columns
        accessor: "total_answered_questions",
      },
      {
        // Second group - Details
        Header: "مجموع الدرجات",
        // Second group columns
        accessor: "total_marks",
      },
      {
        // Second group - Details
        Header: "حصل علي",
        // Second group columns
        accessor: "earned_marks",
      },
      {
        // Second group - Details
        Header: "مستوي التقدم",
        // Second group columns
        Cell: ({ row }) => (
          <div className={cls.progressBar}>
            <span style={{ width: `${(row.original.total_answered_questions / row.original.total_questions)*100}%` }}>
              {`${(row.original.total_answered_questions / row.original.total_questions)*100}%`}
            </span>
          </div>
        ),
      },
      {
        // Second group - Details
        Header: "التصحيح",
        // Second group columns
        Cell: ({ row }) => (
          <div className={cls.statusBar}>
            <span className={`${row.original.total_answered_questions < row.original.total_questions ? cls.notFinished : ''}`}>
              {row.original.total_answered_questions < row.original.total_questions ? 'لم ينتهي' : 'إنتهي'}
            </span>
          </div>
        ),
      },
      {
        // Second group - Details
        Header: "بدء المحاولة",
        // Second group columns
        accessor: "attempt_started_at",
      },
      {
        // Second group - Details
        Header: "نهاية المحاولة",
        // Second group columns
        accessor: "attempt_ended_at",
      },
      {
        // Second group - Details
        Header: "الرقم التعريفي",
        // Second group columns
        accessor: "attempt_ip",
      },
      {
        // Second group - Details
        Header: "خيارات",
        // Second group columns
        Cell: ({ row }) => (
          <button onClick={() => getAnswersData(row.original.id)}>
            <i className="fa-regular fa-eye"></i> 
            الإجابات
          </button>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: data.quiz_attempts.data },
    useGlobalFilter,
    useSortBy,
    useRowSelect
  );

  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = tableInstance;
      

  return (
    <div className={cls.quizzesReports}>
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
          <h5>بدء المحاولة</h5>
          <div>
            <PieChart width={300} height={300}>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Pie
                data={data.charts.attempt_started_at}
                dataKey="num"
                nameKey="label"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#2980b9"
              />
            </PieChart>
          </div>
        </div>
        <div className={cls.chartsSection}>
          <h5>نهاية المحاولة</h5>
          <div>
            <PieChart width={300} height={300}>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Pie
                data={data.charts.attempt_ended_at}
                dataKey="num"
                nameKey="label"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#2980b9"
              />
            </PieChart>
          </div>
        </div>
        <div className={cls.chartsSection}>
          <h5>التصحيح</h5>
          <div>
            <PieChart width={300} height={300}>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Pie
                data={data.charts.attempt_status}
                dataKey="num"
                nameKey="label"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#2980b9"
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
                data={data.charts.book_id}
                dataKey="num"
                nameKey="book.title_ar"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#2980b9"
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
                data={data.charts.page_section_id}
                dataKey="num"
                nameKey="book.title_ar"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#2980b9"
              />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesAttemptsTable;
