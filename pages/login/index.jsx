/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import Cookies from 'universal-cookie';

import axios from '../../Utils/axios';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { langRedirection } from './../../Utils/redirections/langRedirection/langRedirection';
import { routeRedirection } from './../../Utils/redirections/routeRedirection/routeRedirection';

import { useTranslation } from 'next-i18next';

import cls from './login.module.scss';

const cookie = new Cookies()

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { i18n } = useTranslation()

  const login = async () => {
    if(email && password) {
      console.log({email, password})
      const response = await axios.post('/crm/students/auth/login', {email, password}).catch(err => console.log(err));

      if (!response) return;

      // cookie.set('EmicrolearnAuth', response.data.token)

      console.log(response)
    }
  }

  return (
    <div className={cls.login}>

      <img src="/imgs/logo.png" alt="logo" />

      <div className={cls.area}>

        <h3>تسجيل الدخول</h3>

        <div className={`${cls.field} ${i18n.language}`}>

          <input type="text" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />

          <i className="fa-regular fa-user"></i>

        </div>

        <div className={`${cls.field} ${i18n.language}`}>

          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />

          <i className="fa-regular fa-key"></i>

        </div>

        <button onClick={login} className={`${i18n.language}`}>دخول <i className="fa-light fa-arrow-right-to-bracket"></i></button>

      </div>

    </div>
  )
}

export async function getServerSideProps({ req, locale, resolvedUrl }) {

  const languageRedirection = langRedirection(req, locale)

  const routerRedirection = routeRedirection(req, resolvedUrl)

  if( languageRedirection ) return languageRedirection;

  if( routerRedirection ) return routerRedirection;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
} 

export default Login;