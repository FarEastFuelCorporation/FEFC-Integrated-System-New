// controllers/othersController.js

async function logoutController(req, res) {
  try {
    console.log(req.session);

    let route;

    if (Number.isInteger(req.session?.user?.userType)) {
      route = "/employee";
    } else if (!Number.isInteger(req.session?.user?.userType)) {
      route = "/client";
    } else {
      route = "/";
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Clear the cookie
        res.clearCookie("connect.sid", { path: "/" });

        // Prevent caching
        res.setHeader("Cache-Control", "no-store");

        // Redirect to the login page after successful logout
        res.status(200).json({ route });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function error404Controller(req, res, next) {
  res.status(404).send("404 Not Found");
}

module.exports = {
  logoutController,
  error404Controller,
};
