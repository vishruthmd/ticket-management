import jwt from "jsonwebtoken";
import db from "../libs/db.libs.js";

const isOpen = async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    const ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      select: {
        status: true,
      },
    });

    if (ticket.status === "OPEN") {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Ticket is not open",
      });
    }
  } catch (error) {
    console.error("Error checking isOpen middleware status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to isOpen middleware ticket status",
    });
  }
};

const isInProgress = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
      },
      select: {
        status: true,
      },
    });

    if (ticket.status === "IN_PROGRESS") {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: "Ticket is not in progress",
      });
    }
  } catch (error) {
    console.error("Error checking isInProgress middleware status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to isInProgress middleware ticket status",
    });
  }
};



export { isOpen, isInProgress };
