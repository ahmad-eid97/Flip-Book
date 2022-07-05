// import LineTo from 'react-lineto';

import { useState } from 'react';
import cls from './matching.module.scss';

const Matching = ({ question }) => {
  const [selected, setSelected] = useState(null);
  
  const startMatching = (e) => {
    setSelected(1);
  }
  
  const doMatching = (e) => {
    const canvas = document.getElementById('matching_area');
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(300, 75);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(300, 85);
    ctx.stroke();

  }

  return (
    <div className={cls.matching}>

      <h6>{ question.title }</h6>

      <div className={`${cls.wrapper} wrapper`}>

        <div className={cls.list}>

          {question.answers.map((answer, idx) => (

            <div key={idx} onClick={() => startMatching(idx + 1)}>

              <p className='A'>{ answer.title }</p>

            </div>

          ))}

        </div>

        <canvas id="matching_area"></canvas>

        <div className={cls.match}>

          {question.answers.map((answer, idx) => (

            <p className='B' key={idx} onClick={doMatching}>{ answer.answer_two_gap_match }</p>

          ))}

        </div>

      </div>
      
        {/* <div>
          <div className="A">Element A</div>
          <div className="B">Element B</div>
          <LineTo from="A" to="B" />
        </div> */}

    </div>
  )
}

export default Matching