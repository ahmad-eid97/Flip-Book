import { useState, useEffect, useCallback, forwardRef } from 'react';
import flipSound from './assets/page-flip.mp3';
import classes from './Flippy.module.css';

var isFlipping = false;

const Flip = ({
    children,
    pageWidth,
    pageHeight,
    className = "",
    id = "",
    backSkin = "#965A3B",
    flippingTime = 400,
    rtl = false,
    disableSound = false,
    breakpoint = 992,
    flipNext = () => true,
    flipPrev = () => true,
    onFlip = () => true
  }, flippy) => {
  if (!flippy) throw new Error('Flippy component requires a ref to the flippy instance');

  const [totalPages, setTotalPages] = useState({
    coverPage: null,
    middlePages: [],
    coverEndPage: null,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [flippyWidth, setWidth] = useState(pageWidth || 500);
  const [flippyHeight] = useState(pageHeight || 600);
  const [isFullWidth, setIsFullWidth] = useState(window.innerWidth > breakpoint);
  const [isPagesDouble, setIsPagesDouble] = useState(null);

  /***
   * @description
   * Apply back skin of book
   */
  useEffect(() => {
    document.querySelector(':root').style.setProperty('--flippyBackSkin', backSkin);
    document.querySelector(':root').style.setProperty('--flippyFlippingTime', flippingTime+'ms');
  }, [backSkin, flippingTime]);
  
  /***
   * @description
   * Combine each two pages into one mutli-faced page
  */
  const combinePages = useCallback((cPage = currentPage, doublePage = isPagesDouble) => {
    if (window.innerWidth > breakpoint && doublePage) return;
    else if (window.innerWidth <= breakpoint && doublePage === false) return;

    const foldedPages = [{zIndex: 0, pages: [children[0], ""]}];

    // Cutoff the covers
    let pagesWithoutCovers = children.slice(1, children.length - 1);

    if (window.innerWidth > breakpoint) {
      // Set Full-Width mode for the book pages to false
      setIsFullWidth(false);

      // Expand the container width to fit the double-page
      if (cPage > 0 && cPage < totalPages.middlePages.length + 1) setWidth((pageWidth || 500) * 2);

      // Make sure pages are double
      for (var i = 0; i < pagesWithoutCovers.length; i++) {
        if (i % 2 !== 0) continue;
  
        let page1 = pagesWithoutCovers[i];
        let page2 = pagesWithoutCovers[i + 1];
  
        if (i + 1 <= pagesWithoutCovers.length) {
          page2 = pagesWithoutCovers[i + 1];
        } else {
          page2 = "";
        }
  
        foldedPages.push({zIndex: i + 1, pages: [page1, page2]});
      }

      // Change IsPagesDouble to true
      setIsPagesDouble(true);

      // Correcten the current page
      setCurrentPage(Math.ceil(cPage / 2));
    } else if (window.innerWidth <= breakpoint) {
      // Set Full-Width mode for the book pages to true
      setIsFullWidth(true);

      // Minimize the container width to fit the single-page
      setWidth((pageWidth || 500));

      // Make sure pages are single
      for (var w = 0; w < pagesWithoutCovers.length; w++) {
        foldedPages.push({zIndex: w + 1, pages: [pagesWithoutCovers[w], ""]});
      }
      
      // Change IsPagesDouble to false
      setIsPagesDouble(false);

      // Correcten the current page
      setCurrentPage(Math.floor(cPage * 2));
    }

    // Add the last page
    foldedPages.push({zIndex: children.length - 1, pages: ["", children[children.length - 1]]});

    /**
     * Make sure the last page is always backfaced
     */
    if (children.length % 2 !== 0) {
      let [page1, page2] = foldedPages[foldedPages.length - 1].pages;
      foldedPages[foldedPages.length - 1].pages = [page2, page1];
    }
    /**
     * Setup pages z-indexes order
     */
    foldedPages.map((page, idx) => {
      page.zIndex = foldedPages.length - idx;
      return page;
    });

    setTotalPages({
      coverPage: foldedPages[0],
      middlePages: foldedPages.slice(1, foldedPages.length - 1),
      coverEndPage: foldedPages[foldedPages.length - 1],
    });
  }, [breakpoint, currentPage]);
  
  useEffect(() => {
    combinePages();
  }, [children]);

  useEffect(() => {
    window.onresize = () => {
      if ((window.innerWidth > breakpoint && isFullWidth) || (window.innerWidth <= breakpoint && !isFullWidth)) {
        combinePages(currentPage, isPagesDouble);
      }
    }

    return () => {window.onresize = null}
  }, [breakpoint, currentPage, isPagesDouble]);

  /***
   * @description
   * Create flip sound effect and run it
   */
  const runFlipSound = () => {
    const audio = document.createElement('audio');
    audio.src = flipSound;
    audio.play();
  }

  /***
   * @description
   * Go to specific page
   */
  flippy.goToPage = (page) => {
    if (page < 0 || page >= totalPages.middlePages.length + 2 || isFlipping) return;
    setCurrentPage((current) => {
      if (current < page - 1) 
        flipPageNextAnimation();
      if (current > page - 1) 
        flipPagePrevAnimation();
      
      // Change Book Status
      if (page > 0 && page < totalPages.middlePages.length + 2 && window.innerWidth > breakpoint) {
        if (flippyWidth !== (pageWidth || 500) * 2) setWidth((pageWidth || 500) * 2);
      } else {
        setWidth((pageWidth || 500));
      }

      if (page > 0 && page < totalPages.middlePages.length + 2) {
        document.querySelector(`.${classes.page_changer_right}`).style.setProperty('visibility', 'visible');
        document.querySelector(`.${classes.page_changer_left}`).style.setProperty('visibility', 'visible');
      } else {
        document.querySelector(`.${classes.page_changer_right}`).style.setProperty('visibility', 'hidden');
        document.querySelector(`.${classes.page_changer_left}`).style.setProperty('visibility', 'hidden');
      }
      
      // add a book back skin
      if (page > 0 && page < totalPages.middlePages.length + 1) {
        if (!flippy.current.classList.contains(classes.bookOpen)) flippy.current.classList.add(classes.bookOpen);
      } else {
        flippy.current.classList.remove(classes.bookOpen);
      }

      // Run onFlip function
      if (typeof onFlip === 'function') onFlip(page);

      return page - 1;
    });
  }

  /***
   * @description
   * Get Current Page Number
   */
  flippy.getCurrentPageNumber = () => currentPage + 1;

  /***
   * @description
   * Get Total Pages Count
   */
  flippy.getTotalPagesCount = () => totalPages.middlePages.length + 2;

   /***
    * @description
    * Get Internal Pages Count
    */
  flippy.getInternalPagesCount = () => totalPages.middlePages.length;
  

  /***
   * @description
   * Go to next page handler
   */
  const goNextPage = () => {
    if (isFlipping) return;
    // Run flipNext function
    if (typeof flipNext === 'function' && flipNext(currentPage + 1 > totalPages.middlePages.length + 2 ? currentPage + 1 : currentPage + 2) === false) return;

    // Run onFlip animation
    if (currentPage !== 0) flipPageNextAnimation();

    const doNextFlipping = () => setCurrentPage(p => {
      // Next Page Index
      let newPage = p;
      if (p === 0) newPage = 1;
      else if (p + 1 <= totalPages.middlePages.length + 1) newPage = p + 1;
  
      // hide page cover after animation
      if (p === 0) {
        setTimeout(() => {
          flippy.current.querySelector(`.${classes.cover}`).style.setProperty('visibility', 'hidden');
        }, 500);
      }
  
      // hide page end cover after animation
      if (newPage === totalPages.middlePages.length + 1) {
        flippy.current.querySelector(`.${classes.cover_end}`).style.setProperty('visibility', 'visible');
      }
      
      // Change Book Status
      if (newPage > 0 && newPage < totalPages.middlePages.length + 1 && window.innerWidth > breakpoint) {
        if (flippyWidth !== (pageWidth || 500) * 2) setWidth((pageWidth || 500) * 2);
      } else {
        setWidth((pageWidth || 500));
      }
  
      // Change page changer visibility
      if (newPage > 0 && newPage < totalPages.middlePages.length + 1) {
        document.querySelector(`.${classes.page_changer_right}`).style.setProperty('visibility', 'visible');
        document.querySelector(`.${classes.page_changer_left}`).style.setProperty('visibility', 'visible');
      } else {
        document.querySelector(`.${classes.page_changer_right}`).style.setProperty('visibility', 'hidden');
        document.querySelector(`.${classes.page_changer_left}`).style.setProperty('visibility', 'hidden');
      }
      
      // add a book back skin
      if (newPage > 0 && newPage < totalPages.middlePages.length + 1) {
        if (!flippy.current.classList.contains(classes.bookOpen)) flippy.current.classList.add(classes.bookOpen);
      } else {
        flippy.current.classList.remove(classes.bookOpen);
      }
  
      // Run onFlip function
      if (typeof onFlip === 'function') onFlip(newPage + 1);
  
      // Set New Current Page
      return newPage;
    });

    if (currentPage === 0 || currentPage + 1 === totalPages.middlePages.length + 1) doNextFlipping();
    else setTimeout(() => doNextFlipping(), flippingTime);
  }

  /***
   * @description
   * Show next page flipping animation
   */
  const flipPageNextAnimation = () => {
    isFlipping = true;

    if (!disableSound) runFlipSound();

    let rightFlipper = document.querySelector(`.${classes.page_changer_right} .${classes.flipped_page}`);
    rightFlipper.style.setProperty('transition', `width ${flippingTime}ms, right ${flippingTime}ms, left ${flippingTime}ms`);
    rightFlipper.style.setProperty(rtl ? 'left':'right', flippyWidth / 2 + 10 + 'px', 'important');
    rightFlipper.style.setProperty('width', flippyWidth / 2 + 10 + 'px', 'important');

    setTimeout(() => {
      rightFlipper.style.setProperty('transition', `none`);
      rightFlipper.style.opacity = 0;
      rightFlipper.style.setProperty(rtl ? 'left':'right', 10 + 'px');
      rightFlipper.style.setProperty('width', '0px');
      setTimeout(() => {
        rightFlipper.style.opacity = 1;
        isFlipping = false;
        rightFlipper.style.setProperty('transition', `width ${flippingTime}ms, right ${flippingTime}ms, left ${flippingTime}ms`);
      }, 10);
    }, flippingTime);
  }

  // Add flipNext functionality to flippy instance
  flippy.flipNext = goNextPage;

  /**
   * @description
   * Go to previous page handler
   */
  const goPrevPage = () => {
    if (isFlipping) return;
    // Run flipPrev function
    if (typeof flipPrev === 'function' && flipPrev(currentPage - 1 < 0 ? currentPage + 1 : currentPage) === false) return;

    // Run onFlip animation
    if (currentPage < totalPages.middlePages.length + 1 && currentPage !== 0) flipPagePrevAnimation();

    const doPrevFlipping = () => setCurrentPage(p => {
      // Prev Page Index
      const newPage = p - 1 < 0 ? p : p - 1;

      // hide page cover after animation
      if (newPage === 0) {
        flippy.current.querySelector(`.${classes.cover}`).style.setProperty('visibility', 'visible');
      }

      // hide page end cover after animation
      if (newPage < totalPages.middlePages.length + 1) {
        setTimeout(() => {
          flippy.current.querySelector(`.${classes.cover_end}`).style.setProperty('visibility', 'hidden');
        }, 500);
      }

      // Change Book Status
      if (newPage > 0 && newPage < totalPages.middlePages.length + 1 && window.innerWidth > breakpoint) {
        if (flippyWidth !== (pageWidth || 500) * 2) setWidth((pageWidth || 500) * 2);
      } else {
        setWidth((pageWidth || 500));
      }

      // Change page changer visibility
      if (newPage > 0 && newPage < totalPages.middlePages.length + 1) {
        document.querySelector(`.${classes.page_changer_right}`).style.setProperty('visibility', 'visible');
        document.querySelector(`.${classes.page_changer_left}`).style.setProperty('visibility', 'visible');
      } else {
        document.querySelector(`.${classes.page_changer_right}`).style.setProperty('visibility', 'hidden');
        document.querySelector(`.${classes.page_changer_left}`).style.setProperty('visibility', 'hidden');
      }
      
      // add a book back skin
      if (newPage > 0 && newPage < totalPages.middlePages.length + 1) {
        if (!flippy.current.classList.contains(classes.bookOpen)) flippy.current.classList.add(classes.bookOpen);
      } else {
        flippy.current.classList.remove(classes.bookOpen);
      }
        
      // Run onFlip function
      if (typeof onFlip === 'function') onFlip(newPage + 1);
      
      // Set New Current Page
      return newPage;
    });

    if (currentPage - 1 === 0 || currentPage === totalPages.middlePages.length + 1) doPrevFlipping();
    else setTimeout(doPrevFlipping, flippingTime);
  }

  /***
   * @description
   * Show prev page flipping animation
   */
  const flipPagePrevAnimation = () => {
    isFlipping = true;

    if (!disableSound) runFlipSound();

    let leftFlipper = document.querySelector(`.${classes.page_changer_left} .${classes.flipped_page}`);
    leftFlipper.style.setProperty('transition', `width ${flippingTime}ms, right ${flippingTime}ms, left ${flippingTime}ms`);
    leftFlipper.style.setProperty(rtl ? 'right':'left', flippyWidth / 2 + 10 + 'px', 'important');
    leftFlipper.style.setProperty('width', flippyWidth / 2 + 10 + 'px', 'important');
    setTimeout(() => {
      leftFlipper.style.setProperty('transition', `none`);
      leftFlipper.style.opacity = 0;
      leftFlipper.style.setProperty(rtl ? 'right':'left', 10 + 'px');
      leftFlipper.style.setProperty('width', '0px');
      setTimeout(() => {
        leftFlipper.style.opacity = 1;
        isFlipping = false;
        leftFlipper.style.setProperty('transition', `width ${flippingTime}ms, right ${flippingTime}ms, left ${flippingTime}ms`);
      }, 10);
    }, flippingTime);
  }

  // Add flipPrev functionality to flippy instance
  flippy.flipPrev = goPrevPage;
  
  /***
   * @description
   * Change Current Page on click on the page changer elements
   */
  const handlePageChangerClick = (e) => {
    const page_changer_el = e.target.classList.contains(classes.page_changer) || e.target.parentElement.classList.contains(classes.page_changer);
    const page_changer_right_el = e.target.classList.contains(classes.page_changer_right) || e.target.parentElement.classList.contains(classes.page_changer_right);
    const page_changer_left_el = e.target.classList.contains(classes.page_changer_left) || e.target.parentElement.classList.contains(classes.page_changer_left);
    if (page_changer_el && page_changer_right_el) goNextPage();
    if (page_changer_el && page_changer_left_el) goPrevPage();
  }

  return (
    <div className={classes.flippy_container} style={{ width: flippyWidth + 80, height: flippyHeight + 60 }}>
      <div className={`${className} ${classes.flippy} ${rtl ? classes.rtl : ''}`} id={id} style={{ width: flippyWidth, height: flippyHeight }} ref={flippy}>
        <span
          className={`${classes.page_changer} ${classes.page_changer_right}`}
          onClick={handlePageChangerClick}
          style={{ zIndex: totalPages?.middlePages?.length + 3 || 9 }}
        >
          <span className={classes.edge} />
          <span className={classes.edge} />
          <span className={classes.edge} />
          <span className={classes.edge} />
          <span className={classes.flipped_page} />
        </span>
        {
          totalPages.coverPage &&
          <SinglePage
            page={totalPages.coverPage}
            isFlipped={currentPage >= 1}
            demoPages={totalPages.middlePages[0].pages}
            goNext={goNextPage}
            goPrev={goPrevPage}
          />
        }
        
        {
          totalPages.middlePages.length && currentPage > 0 && currentPage < totalPages.middlePages.length + 1 &&
          <MiddlePages
            pages={totalPages.middlePages}
            currentPage={currentPage}
            isFullWidth={isFullWidth}
          />
        }

        {
          totalPages.coverEndPage &&
          <SinglePage
            page={totalPages.coverEndPage}
            isFlipped={currentPage >= totalPages.middlePages.length + 1}
            demoPages={totalPages.middlePages[totalPages.middlePages.length - 1].pages}
            goNext={goNextPage}
            goPrev={goPrevPage}
          />
        }
        <span 
          className={`${classes.page_changer} ${classes.page_changer_left}`}
          onClick={handlePageChangerClick}
          style={{ zIndex: totalPages?.middlePages?.length + 3 || 9 }}
        >
          <span className={classes.edge} />
          <span className={classes.edge} />
          <span className={classes.edge} />
          <span className={classes.edge} />
          <span className={classes.flipped_page} />
        </span>
      </div>
    </div>
  );
}

const SinglePage = ({ page, demoPages, isFlipped, goNext, goPrev }) => {
  // Destructure Pages from page object prop
  const [CoverPage] = page.pages;

  // The Rendered Page
  const Page = CoverPage;

  // Check if the page is cover or end page
  const isCover = page.zIndex > 1;
  console.log(page);

  // Demo content for the backfaced cover & end pages
  const Front2DemoContent = isCover ? demoPages[1] : demoPages[0];
  const BackDemoContent = isCover ? demoPages[0] : "";

  return (
    <div
      className={`${classes.page} ${isCover ? classes.cover : classes.cover_end} ${isFlipped ? classes.flipped : ''}`}
      style={{ zIndex: page.zIndex }}
      title={isCover ? 'Open The Book' : 'Re-Open The Book'}
      onClick={() => isCover ? goNext() : goPrev()}
    >
      <div className={`${classes.face} ${classes.front2}`}>
        { Front2DemoContent }
      </div>
      <div className={`${classes.face} ${classes.front}`}>
        { Page }
      </div>
      <div className={`${classes.face} ${classes.back}`}>
        { BackDemoContent }
      </div>
    </div>
  );
}

const MiddlePages = ({ pages, currentPage, isFullWidth }) => {
  const currentPageIndex = currentPage - 1;
  const [FrontPage, BackPage] = pages[currentPageIndex].pages;

  return (
    <div className={`${classes.page} ${isFullWidth ? classes.full_width : ''}`} style={{ zIndex: pages[currentPageIndex].zIndex }}>
      <div className={`${classes.face} ${classes.front}`}>
        { FrontPage }
      </div>
      <div className={`${classes.face} ${classes.back}`}>
        { BackPage }
      </div>
    </div>
  );
}


export default forwardRef(Flip);
