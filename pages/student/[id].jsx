import Navbar from "../../components/home/Navbar/Navbar";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { langRedirection } from "./../../Utils/redirections/langRedirection/langRedirection";
import { routeRedirection } from "./../../Utils/redirections/routeRedirection/routeRedirection";

import cls from "./studentDetails.module.scss";
import { Container } from "@mui/material";

const StudentDetails = () => {
  return (
    <div className={cls.studentDetails}>
      <Navbar />
      <Container>
        <h1>student details</h1>
      </Container>
    </div>
  );
};

export async function getServerSideProps({ req, locale, resolvedUrl }) {
  const languageRedirection = langRedirection(req, locale);

  const routerRedirection = routeRedirection(req, resolvedUrl);

  if (languageRedirection) return languageRedirection;

  if (routerRedirection) return routerRedirection;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default StudentDetails;
