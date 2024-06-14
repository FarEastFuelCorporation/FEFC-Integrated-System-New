// middlewares/auth.js

// Middleware to check authentication and role
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role) {
    const userRole = req.session.user.role;

    // Check if user's role allows access to the requested route
    const isAuthorized =
      (req.path === "/marketingDashboard" && userRole === 2) ||
      (req.path === "/dispatchingDashboard" && userRole === 3) ||
      (req.path === "/receivingDashboard" && userRole === 4) ||
      (req.path === "/hrDashboard" && userRole === 9);

    if (isAuthorized) {
      // User is authenticated and authorized
      res.json({ authenticated: true });
    } else {
      res.status(403).json({ authenticated: false, message: "Unauthorized" });
    }
  } else {
    res
      .status(401)
      .json({ authenticated: false, message: "Not authenticated" });
  }
};

module.exports = { isAuthenticated };
