import { useState } from "react";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";

import Cookies from "universal-cookie";

import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Swal from "sweetalert2";

import cls from "./navbar.module.scss";

const cookie = new Cookies();

const Navbar = () => {
  const [userData, setUserData] = useState(cookie.get("EmicrolearnUser"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { user } = useSelector(({ user }) => user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (route) => {
    setAnchorEl(null);
    if (route) {
      router.push(route);
    }
  };

  const checkLogout = () => {
    handleClose("");
    Swal.fire({
      title: "تسجيل الخروج!",
      text: "هل تريد تسجيل الخروج!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "تسجيل الخروج",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const logout = () => {
    cookie.remove("EmicrolearnAuth");
    cookie.remove("EmicrolearnUser");
    router.push("/login");
  };

  return (
    <div className={cls.navbar}>
      <Container maxWidth="xl" className={cls.wrapper}>
        {/* <h5>Emicrolearn</h5> */}
        <img
          src="/imgs/logo.png"
          alt="logoImage"
          onClick={() => router.push("/home")}
        />

        <div>
          <button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <img
              src={
                userData?.logo_file ? userData?.logo_file : "/imgs/default.jpg"
              }
              alt=""
            />

            {/* <i className="fa-duotone fa-bars"></i> */}
          </button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose("")}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleClose("")}>الصفحة الشخصية</MenuItem>
            {user && user.type !== "parent" && (
              <MenuItem onClick={() => handleClose("/reports")}>
                تقارير الكتب
              </MenuItem>
            )}
            {user && user.type !== "parent" && (
              <MenuItem onClick={() => handleClose("/quizzes-reports")}>
                تقارير الإختبارات
              </MenuItem>
            )}
            <MenuItem onClick={checkLogout}>تسجيل خروج</MenuItem>
          </Menu>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
