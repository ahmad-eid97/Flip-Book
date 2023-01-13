export const routeRedirection = (req, resolvedUrl) => {
  const authenticated = req.cookies["EmicrolearnAuth"];

  const authenticatedUserData =
    req.cookies["EmicrolearnUser"] &&
    JSON.parse(req.cookies["EmicrolearnUser"]);

  const parentOptions =
    req.cookies["EmicrolearnParentOptions"] &&
    JSON.parse(req.cookies["EmicrolearnParentOptions"]);

  const userType = authenticatedUserData && authenticatedUserData.type;

  const requireNoAuthRoutes = ["/signup", "/login", "/login-parents"];

  const requireAuthRoutes = [
    "/home",
    "/levels",
    "/levels/books",
    "/reports",
    "/quizzes-reports",
    "/book",
    "/parent",
  ];

  const studentRoutes = [
    "/home",
    "/levels",
    "/levels/books",
    "/reports",
    "/quizzes-reports",
    "/book",
  ];

  const parentRoutes = ["/parent", "/add-student"];

  const requireNoAuth = requireNoAuthRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  const requireAuth = requireAuthRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  const requireStudent = studentRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  const requireParent = parentRoutes.find((route) =>
    resolvedUrl.startsWith(route)
  );

  if (authenticated && requireNoAuth) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }
  // else if (
  //   requireParent &&
  //   resolvedUrl === "/add-student" &&
  //   userType === "parent" &&
  //   parentOptions.feature_remaining <= 0
  // ) {
  //   return {
  //     redirect: {
  //       destination: "/parent",
  //       permanent: false,
  //     },
  //   };
  // }
  else if (authenticated && requireAuth) {
    if (requireParent && userType === "student") {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    } else if (requireStudent && userType === "parent") {
      return {
        redirect: {
          destination: "/parent",
          permanent: false,
        },
      };
    } else if (!authenticated && requireAuth) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    } else if (resolvedUrl === "/") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }

  return false;
};
