// COMPONENTS
import { useEffect, useState } from "react";

import Navbar from "../../components/home/Navbar/Navbar";
import Choose from "./../../components/UIs/Choose/Choose";
import Loader from "../../components/Loader/Loader";

import Grid from "@mui/material/Grid";
import Container from "@mui/system/Container";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

import * as EmailValidator from "email-validator";

import { toast } from "react-toastify";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import axios from "../../Utils/axios";

import Cookies from "universal-cookie";
const cookie = new Cookies();

// STYLES
import cls from "./addStudent.module.scss";

const AddStudent = ({ countries, cities, semesters, levels }) => {
  const [studentData, setStudentData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [studentGender, setStudentGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [semester, setSemester] = useState("");
  const [level, setLevel] = useState("");
  const [classes, setClasses] = useState([]);
  const [studentClass, setStudentClass] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  const gender = [
    {
      title: "ذكر",
      query: "male",
    },
    {
      title: "انثي",
      query: "female",
    },
  ];

  const fetchSchoolClasses = async () => {
    const response = await axios.get(
      `/crm/school_classes?lang=ar&level_id=${level.id}`
    );
    if (response.data.success) {
      setClasses(response.data.data.school_classes);
    }
  };

  useEffect(() => {
    fetchSchoolClasses();
  }, [level]);

  const handleStudentDataChange = (e) => {
    setStudentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addStudent = async () => {
    const student = {
      ...studentData,
      gender: studentGender.query,
      birth_date: birthDate,
      country_id: country.id,
      city_id: city.id,
      semester_id: semester.id,
      level_id: level.id,
      school_class_id: studentClass.id,
    };

    if (
      Object.values(student).findIndex(
        (one) => one === "" || one === undefined
      ) >= 0
    ) {
      return setEmptyFields(true);
    }

    if (!EmailValidator.validate(studentData.email)) {
      return setValidEmail(false);
    }

    setLoading(true);

    const { data } = await axios.post(
      `/crm/parents/students?lang=ar`,
      student,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("EmicrolearnAuth")}`,
        },
      }
    );

    if (data.success) {
      successNotify("تم إضافة الطالب بنجاح");
    } else {
      Object.values(data.errors).forEach((error) => errorNotify(error[0]));
    }

    setLoading(false);
  };

  const successNotify = (message) => toast.success(message);
  const errorNotify = (message) => toast.error(message);

  return (
    <div className={cls.add_student}>
      <Navbar />

      {loading && <Loader />}

      <Container>
        <div className={cls.studentForm}>
          <h3>إضافة طالب</h3>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">إسم المستخدم ( باللغة الإنجليزية )</label>
                <input
                  type="text"
                  placeholder="إسم المستخدم"
                  value={studentData.username}
                  name="username"
                  onChange={(e) => handleStudentDataChange(e)}
                  className={
                    emptyFields && !studentData.username ? cls.error : ""
                  }
                />
                {emptyFields && !studentData.username && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">إسم الطالب</label>
                <input
                  type="text"
                  placeholder="إسم الطالب"
                  value={studentData.name}
                  name="name"
                  onChange={(e) => handleStudentDataChange(e)}
                  className={emptyFields && !studentData.name ? cls.error : ""}
                />
                {emptyFields && !studentData.name && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={studentData.email}
                  name="email"
                  onChange={(e) => handleStudentDataChange(e)}
                  className={emptyFields && !studentData.email ? cls.error : ""}
                />
                {emptyFields && !studentData.email && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
                {!validEmail && <span>البريد الإلكتروني غير صالح</span>}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">كلمة السر</label>
                <input
                  type="password"
                  placeholder="كلمة السر"
                  value={studentData.password}
                  name="password"
                  onChange={(e) => handleStudentDataChange(e)}
                  className={
                    emptyFields && !studentData.password ? cls.error : ""
                  }
                />
                {emptyFields && !studentData.password && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">رقم الموبايل</label>
                <input
                  type="number"
                  placeholder="رقم الموبايل"
                  value={studentData.phone}
                  name="phone"
                  onChange={(e) => handleStudentDataChange(e)}
                />
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
                  error={emptyFields && !studentGender}
                />
                {emptyFields && !studentGender && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
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
                {emptyFields && !birthDate && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">الدولة</label>
                <Choose
                  placeholder="الدولة"
                  results={countries}
                  choose={setCountry}
                  value={country.title ? country.title : ""}
                  keyword="title"
                  error={emptyFields && !country}
                />
                {emptyFields && !country && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label htmlFor="">المدينة</label>
                <Choose
                  placeholder="المدينة"
                  results={cities}
                  choose={setCity}
                  value={city.title ? city.title : ""}
                  keyword="title"
                  error={emptyFields && !city}
                />
                {emptyFields && !city && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label>الصف الدراسي</label>
                <Choose
                  placeholder="الصف الدراسي"
                  results={levels}
                  choose={setLevel}
                  value={level.title ? level.title : ""}
                  keyword="title"
                  error={emptyFields && !level}
                />
                {emptyFields && !level && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label>الفصل الدراسي</label>
                <Choose
                  placeholder="الفصل الدراسي"
                  results={semesters}
                  choose={setSemester}
                  value={semester.title ? semester.title : ""}
                  keyword="title"
                  error={emptyFields && !semester}
                />
                {emptyFields && !semester && (
                  <span>هذا الحقل لا يجب أن يكون فارغاَ</span>
                )}
              </div>
            </Grid>
            <Grid item md={6}>
              <div className={cls.field}>
                <label>الفصل المدرسي</label>
                <Choose
                  placeholder="الفصل المدرسي"
                  results={classes}
                  choose={setStudentClass}
                  value={studentClass.title ? studentClass.title : ""}
                  keyword="title"
                />
              </div>
            </Grid>
          </Grid>
          <div className={cls.btn}>
            <button onClick={addStudent}>إضافة طالب</button>
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

  let cities = [];
  const citiesResponse = await axios.get(`/crm/cities?lang=ar`);
  cities = citiesResponse.data.data.cities;

  let semesters = [];
  const semestersRsponse = await axios.get(`/crm/semesters?lang=ar`);
  semesters = semestersRsponse.data.data.semesters;

  let levels = [];
  const levelsRsponse = await axios.get(`/crm/levels?lang=ar`);
  levels = levelsRsponse.data.data.levels;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      countries,
      cities,
      semesters,
      levels,
    },
  };
}

export default AddStudent;
