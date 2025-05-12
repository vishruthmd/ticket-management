import jwt from "jsonwebtoken";
import db from "../libs/db.libs.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized, no token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized, no token provided",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authneticating user", error);
    res.status(500).json({
      success: false,
      message: "Error authenticating user",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: "Access denied, admins only",
      });
    }
    next();
  } catch (error) {
    console.error("Error checking admin role", error);
    res.status(500).json({
      success: false,
      message: "Error checking admin role",
    });
  }
};

const isAdminOrCoordinator = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.toUpperCase();

    if (userRole !== "ADMIN" && userRole !== "COORDINATOR") {
      return res.status(403).json({
        success: false,
        error: "Access denied, admins or coordinators only",
      });
    }
    next();
  } catch (error) {
    console.error("Error checking admin or coordinator role", error);
    res.status(500).json({
      success: false,
      message: "Error checking admin or coordinator role",
    });
  }
};


export { isLoggedIn, isAdmin, isAdminOrCoordinator };
