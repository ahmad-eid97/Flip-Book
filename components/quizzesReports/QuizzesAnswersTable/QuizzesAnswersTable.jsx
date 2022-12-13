import { useMemo } from "react";
import { useRouter } from "next/router";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { Pie, PieChart, Legend, Tooltip } from "recharts";

import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

import { format } from 'date-fns';

import cls from "./quizzesAnswersTable.module.scss";

const QuizzesAnswersTable = ({ data }) => {
  const router = useRouter()

  const columns = useMemo(
    () => [
      {
        // Second group - Details
        Header: "السؤال",
        // Second group columns
        accessor: "question.title",
      },
      {
        // first group - TV Show
        Header: "درجة السؤال",
        // First group columns
        accessor: "question.question_mark",
      },
      {
        // Second group - Details
        Header: "	حصل علي",
        // Second group columns
        accessor: "achieved_mark",
      },
      {
        // Second group - Details
        Header: "درجات النقص",
        // Second group columns
        accessor: "minus_mark",
      },
      {
        // Second group - Details
        Header: "التصحيح",
        // Second group columns
        Cell: ({ row }) => (
          <span>
            { row.original.is_correct === "0" ?  
              <span className={cls.wrong}><i className="fa-solid fa-xmark"></i></span>
              :  
              <span className={cls.correct}><i className="fa-sharp fa-solid fa-check"></i></span> 
            }
          </span>
        ),
      },
      {
        // Second group - Details
        Header: "تم البدء في",
        // Second group columns
        Cell: ({ row }) => (
          <span>{format(new Date(row.original.created_at).getTime(), 'dd/mm/yyyy - hh:mm')}</span>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: data.attempt_answers.data },
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

  console.log(data)
      
  const goBack = () => {
    router.push({ path: '/quizzes-reports', query: { bookId: data.quiz_attempt.book.id, category: 'attempts', quizId: data.quiz_attempt.quiz.id } });
  }

  return (
    <div className={cls.quizzesReports}>
      <div className={cls.goBack}>
        <button onClick={goBack}><i className="fa-duotone fa-rotate-left"></i> رجوع للخلف</button>
      </div>
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
          <h5>الإجابات الصحيحة</h5>
          <div>
            <PieChart width={300} height={300}>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="top" align="center" />
              <Pie
                data={data.charts.is_correct}
                dataKey="num"
                nameKey="label"
                cx={145}
                cy={120}
                innerRadius={40}
                outerRadius={100}
                fill="#00b894"
              />
            </PieChart> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesAnswersTable;
