import cls from './bookBackCover.module.scss';

const BookBackCover = ({ data }) => {
  return (
    // <h2>{data}</h2>
    <div className={cls.bookBackCover}>
      <h2>نهاية الكتاب</h2>
    </div>
  )
}

export default BookBackCover;