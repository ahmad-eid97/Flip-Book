// COMPONENTS
import { useState } from "react";

import Navbar from "../../components/home/Navbar/Navbar";
import Choose from "./../../components/UIs/Choose/Choose";

import Grid from "@mui/material/Grid";
import Container from "@mui/system/Container";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import axios from "../../Utils/axios";

// STYLES
import cls from "./addStudent.module.scss";

const AddStudent = ({ countries }) => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  });
  const [studentGender, setStudentGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");

  const gender = [
    {
      title: "ذكر",
    },
    {
      title: "انثي",
    },
  ];

  return (
    <div className={cls.add_student}>
      <Navbar />

      <Container>
        <div className={cls.studentForm}>
          <h3>إضافة طالب</h3>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">إسم الطالب</label>
                <input type="text" placeholder="إسم الطالب" />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">البريد الإلكتروني</label>
                <input type="text" placeholder="البريد الإلكتروني" />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">كلمة السر</label>
                <input type="text" placeholder="كلمة السر" />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">رقم الهاتف</label>
                <input type="text" placeholder="رقم الهاتف" />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">الجنس</label>
                <Choose
                  placeholder="الجنس"
                  results={gender}
                  choose={setStudentGender}
                  value={studentGender.title ? studentGender.title : ""}
                  keyword="title"
                />
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.specialField}>
                <label htmlFor="">تاريخ الميلاد</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    mask="____/__/__"
                    value={birthDate}
                    onChange={(newValue) => setBirthDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </Grid>
            <Grid item md={12}>
              <div className={cls.field}>
                <label htmlFor="">الدولة</label>
                <Choose
                  placeholder="الدولة"
                  results={countries}
                  choose={setCountry}
                  value={country.title ? country.title : ""}
                  keyword="title"
                />
              </div>
            </Grid>
          </Grid>
          <div className={cls.btn}>
            <button>إضافة طالب</button>
          </div>
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

  let countries = [];
  // const response = await axios.get(`/crm/countries?lang=${locale}`);
  const response = await axios.get(`/crm/countries?lang=ar`);
  countries = response.data.data.countries;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      countries,
    },
  };
}

export default AddStudent;
