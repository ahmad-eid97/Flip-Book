import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../../Utils/redirections/langRedirection/langRedirection';

import cls from './login.module.scss';

const index = () => {
  return (
    <div className={cls.login}>

      <div className={cls.area}>

        <h3>تسجيل الدخول</h3>

        <input type="text" placeholder="إسم المستخدم" />

        <input type="password" placeholder="كلمة المرور" />

        <button>دخول</button>

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale }) {

  const languageRedirection = langRedirection(req, locale)

  if( languageRedirection ) return languageRedirection;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
} 

export default index;