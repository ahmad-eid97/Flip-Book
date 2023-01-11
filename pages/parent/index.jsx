// COMPONENTS
import Navbar from "../../components/home/Navbar/Navbar";

import Grid from "@mui/material/Grid";
import Container from "@mui/system/Container";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import axios from "../../Utils/axios";

// STYLES
import cls from "./parent.module.scss";
import { Link } from "@mui/material";

const Parent = ({ parentData, canAddData }) => {
  return (
    <div className={cls.parent}>
      <Navbar />

      <h2>لوحة تحكم أولياء الأمور</h2>

      <Container>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <div className={cls.students}>
              <h3>قائم الأبناء</h3>
              {parentData.students.map((student) => (
                <div className={cls.student} key={student.id}>
                  one
                </div>
              ))}
            </div>
          </Grid>
          <Grid item md={4}>
            <div className={cls.options}>
              <p>
                عدد الإضافات: <span>{canAddData.feature_usage}</span>
              </p>
              <p>
                الإضافات المتبقية: <span>{canAddData.feature_remaining}</span>
              </p>
              <div className={cls.btns}>
                {canAddData.feature_remaining >= 1 && (
                  // <button className={cls.add}>
                  <Link href="/add-student">
                    <button className={cls.add}>إضافة طالب</button>
                  </Link>
                  // </button>
                )}
                <button>تغيير الخطة</button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ req, locale, resolvedUrl }) {
  const languageRedirection = langRedirection(req, locale);

  const routerRedirection = routeRedirection(req, resolvedUrl);

  if (languageRedirection) return languageRedirection;

  if (routerRedirection) return routerRedirection;

  let parentData = [];

  const response = await axios.get(`/crm/parents/students?lang=${locale}`, {
    headers: {
      Authorization: `Bearer ${req.cookies["EmicrolearnAuth"]}`,
    },
  });

  parentData = response.data.data;

  let canAddData = [];

  const res = await axios.get(
    `/crm/parents/students/add_student/check?lang=${locale}`,
    {
      headers: {
        Authorization: `Bearer ${req.cookies["EmicrolearnAuth"]}`,
      },
    }
  );
  canAddData = res.data.data;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      parentData,
      canAddData,
    },
  };
}

export default Parent;
