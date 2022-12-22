import { useState } from "react";
import { useRouter } from "next/router";

import Cookies from "universal-cookie";

import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Swal from "sweetalert2";

import cls from "./navbar.module.scss";

const cookie = new Cookies();

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

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
            <i className="fa-duotone fa-bars"></i>
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
            <MenuItem onClick={() => handleClose("")}>Profile</MenuItem>
            <MenuItem onClick={() => handleClose("/reports")}>
              Books Reports
            </MenuItem>
            <MenuItem onClick={() => handleClose("/quizzes-reports")}>
              Quizzes Reports
            </MenuItem>
            <MenuItem onClick={checkLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
