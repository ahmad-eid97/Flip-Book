import { useState, useRef, useEffect } from 'react';

import ImageMatching from '../../quizzes/ImageMatching/ImageMatching';
import OrderingQuiz from './../../quizzes/OrderingQuiz/OrderingQuiz';
import SingleChoice from '../../quizzes/SingleChoice/SingleChoice';
import MultipleChoice from './../../quizzes/MultipleChoice/MultipleChoice';
import OpenEnded from './../../quizzes/OpenEnded/OpenEnded';
import ShortAnswer from './../../quizzes/ShortAnswer/ShortAnswer';
import TrueAndFalse from './../../quizzes/TrueAndFalse/TrueAndFalse';
import FillInBlank from './../../quizzes/FillInBlank/FillInBlank';
import ImageAnswering from '../../quizzes/ImageAnswering/ImageAnswering';

import CorrectAnswer from "../../UIs/CorrectAnswer/CorrectAnswer";
import WrongAnswer from "../../UIs/WrongAnswer/WrongAnswer";

import Loader from '../../UIs/Loader/Loader';

import { useTranslation } from 'react-i18next';

import axios from '../../../Utils/axios';

import cls from './quizModal.module.scss';
import Matching from '../../quizzes/Matching/Matching';

const QuizModal = ({ setOpenQuizModal, quizData }) => {
  // COMPONENT HOOKS
  const [questions, setQuestions] = useState()
  const [answers, setAnswers] = useState({});
  const [wrongAnswers, setWrongAnswers] = useState({})
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWrong, setOpenWrong] = useState(false);
  const [wrongTries, setWrongTries] = useState(0);
  const overlay = useRef();
  const { t: translate, i18n } = useTranslation('common');
  const [loading, setLoading] = useState(false)

  console.log(questions)

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if(overlay.current === e.target) setOpenQuizModal(false)
  }

  const close = () => {
    setOpenQuizModal(false)
  }

  const fetchQuestions = async () => {
    setLoading(true)
    const response = await axios.get(`/crm/page_sections/${quizData.id}?lang=${'en'}`);
    if(!response) return;

    const quizesResponse = await axios.get(`/crm/quizzes/${response.data.data.quiz_id.id}?lang=${'en'}`);
    if(!quizesResponse) return;

    const questions = [];

    for(let question of quizesResponse.data.data.questions) {
      const answersResponse = await axios.get(`/crm/answers?lang=${'en'}&question_id=${question.id}`);
      questions.push({
        ...question,
        answers: answersResponse.data.data.answers
      });
    }

    setQuestions(questions)

    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions();
  }, [])

  const submit = () => {

    // for(var prop in answers) {

    //   questions.map(question => {

    //     const rightAnswers = question.answers[prop].answer_two_gap_match.split('|');
    //     const studentAnswers = Object.values(answers[prop]);
  
    //     if(Object.values(studentAnswers).find(one => one === '')) {
    //       setTimeout(() => {
    //         setOpenWrong(false)
    //       }, 4000)
    //       setOpenWrong(true)
    //       setWrongTries(prev => (prev += 1))
    //     } else {
    
    //       if(rightAnswers.every((val, index) => val === studentAnswers[index])) {
    //         setTimeout(() => {
    //           setOpenSuccess(false)
    //           setOpenQuizModal(false)
    //         }, 4000)
    //         setOpenSuccess(true)
    //       } else {
    //         setWrongAnswers({
    //           ...wrongAnswers,
    //           [prop]: {
    //             ...answers[prop]
    //           }
    //         })
    //         setTimeout(() => {
    //           setOpenWrong(false)
    //         }, 4000)
    //         setOpenWrong(true)
    //         setWrongTries(prev => (prev += 1))
    //       }
    //     }

    //   })
      
    // }
  }

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>

      <div className={cls.area}>

        {loading ? 

          <Loader />

          :

          <div className={cls.area__wrapper}>
            <div className={`${cls.close} ${cls[i18n.language]}`} onClick={close}>
              <i className="fa-solid fa-xmark"></i>
            </div>

            <div container className={cls.area__content} spacing={3}>

              {questions && questions.length && questions.map((question, idx) => (

                <div key={idx} className={cls.question}>

                  {console.log(question)}

                  {question.question_type === 'true_false' && console.log('true and false')}
                  {question.question_type === 'fill_in_the_blank' && console.log('fill_in_the_blank')}

                  {question.question_type === 'single_choice' && <SingleChoice question={question} idx={idx} setOpenQuizModal={setOpenQuizModal} />}
                    
                  {question.question_type === 'image_matching' &&  <ImageMatching question={question} setOpenQuizModal={setOpenQuizModal} />}

                  {question.question_type === 'ordering' &&  <OrderingQuiz question={question} setOpenQuizModal={setOpenQuizModal} />}

                  {question.question_type === 'multiple_choice' &&  <MultipleChoice question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} />}

                  {question.question_type === 'open_ended' &&  <OpenEnded question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} />}

                  {question.question_type === 'short_answer' &&  <ShortAnswer question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} />}

                  {question.question_type === 'true_false' &&  <TrueAndFalse question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} />}

                  {question.question_type === 'matching' &&  <Matching question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} />}

                  {question.question_type === 'fill_in_the_blank' &&  <FillInBlank question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} setAnswers={setAnswers} answers={answers} />}

                  {question.question_type === 'image_answering' &&  <ImageAnswering question={question} setOpenQuizModal={setOpenQuizModal} idx={idx} />}

                </div>

              ))}

            </div>

            <div className={cls.btn}>

              <button onClick={submit}><i className="fa-light fa-badge-check"></i> تأكيد</button>

            </div>

          </div>

        }
      </div>

      {openSuccess && <CorrectAnswer />}
      {openWrong && <WrongAnswer />}

    </div>
  )
}

export default QuizModal;