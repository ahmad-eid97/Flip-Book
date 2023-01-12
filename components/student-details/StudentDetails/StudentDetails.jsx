import Grid from '@mui/material/Grid';

import cls from "./studentDetails.module.scss";

const StudentDetails = ({ studentDetails }) => {
  return <div className={cls.studentDetails}>
    <div className={cls.user}>
      <img src={studentDetails.logo_file ? studentDetails.logo_file : '/imgs/default.jpg'} alt={studentDetails.name} />
      <div className={cls.details}>
        <h3>{studentDetails.name}</h3>
        <p>{studentDetails.username}</p>
      </div>
    </div>
    <Grid container columnSpacing={2}>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>البريد الإلكتروني</label>
          <p>{studentDetails.email}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>رقم الموبايل</label>
          <p>{studentDetails.phone}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>الجنس</label>
          <p>{studentDetails.gender}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>الدولة</label>
          <p>{studentDetails.country.title}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>المدينة</label>
          <p>{studentDetails.city.title}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>الصف الدراسي</label>
          <p>{studentDetails.level.title}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>الفصل الدراسي</label>
          <p>{studentDetails.semester.title}</p>
        </div>
      </Grid>
      <Grid item md={6}>
        <div className={cls.field}>
          <label>الفصل المدرسي</label>
          <p>{studentDetails.school_class.title ? studentDetails.school_class.title : "لم تتم إضافته"}</p>
        </div>
      </Grid>
    </Grid>
  </div>;
};

export default StudentDetails;
