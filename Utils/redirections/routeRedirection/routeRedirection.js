export const routeRedirection = (req, resolvedUrl) => {
  const authenticated = req.cookies['EmicrolearnAuth'];

  const requireNoAuthRoutes = ['/signup', '/login'];

  const requireAuthRoutes = ['/home', '/levels', '/levels/books', '/book'];

  const requireNoAuth = requireNoAuthRoutes.find(route => resolvedUrl.startsWith(route));

  const requireAuth = requireAuthRoutes.find(route => resolvedUrl.startsWith(route));

  if(authenticated && requireNoAuth) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    }
  } else if (!authenticated && requireAuth) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  } else if (resolvedUrl === '/') {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return false
}