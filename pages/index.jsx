import { useState, useRef } from 'react';

import Head from 'next/head';

import HTMLFlipBook from 'react-pageflip';

export default function Home() {
  const [name, setName] = useState('');
  const flipBook = useRef(null);

  const flipPage = () => {
    console.log('page flipped successfully!')
  }

  return (
    <div className='mainPage'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Our Awesome Flip Book</h1>

      <HTMLFlipBook ref={flipBook} width={400} height={500} showCover={true} flippingTime={1500} startUserTouch={flipPage}>
        <div className="demoPage">

          <h2>Book Cover</h2>

        </div>
        <div className="demoPage">

          <img src="/imgs/nature.jpg" alt="" />

          <h2>Second page</h2>

          <h4>Type anything to move to the next page</h4>

          <input type="text" placeholder='Type Your Name' value={name} onChange={(e) => setName(e.target.value)} />

        </div>
        <div className="demoPage">

          <img src="/imgs/nature.jpg" alt="" />

          <h2>Third page</h2>

        </div>
        <div className="demoPage">

          <img src="/imgs/nature.jpg" alt="" />

          <h2>Fourth page</h2>

        </div>
        <div className="demoPage">

          <img src="/imgs/nature.jpg" alt="" />

          <h2>Fifth page</h2>

        </div>
        <div className="demoPage">

          <img src="/imgs/nature.jpg" alt="" />

          <h2>Sixth page</h2>

        </div>
        <div className="demoPage">

          <img src="/imgs/nature.jpg" alt="" />

          <h2>Seventh page</h2>

        </div>
        <div className="demoPage">

          <h2>Book End</h2>

        </div>

      </HTMLFlipBook>

    </div>
  )
}
