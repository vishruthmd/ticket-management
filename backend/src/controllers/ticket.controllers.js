import bcrypt from "bcryptjs";
import db from "../libs/db.libs.js";
import { STATUSES } from "../libs/constants.js";

// model Ticket {
//   id          String       @id @default(cuid())
//   title       String
//   description String
//   department  Department
//   location    String
//   deviceId    String
//   status      TicketStatus @default(OPEN)

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   coordinatorId String
//   technicianId  String?

//   // relations
//   coordinator User  @relation("CoordinatorTickets", fields: [coordinatorId], references: [id])
//   technician  User? @relation("TechnicianTickets", fields: [technicianId], references: [id])

//   assignedAt DateTime?
//   resolvedAt DateTime?
//   remarks    String?

//   // indexes for efficient querying
//   @@index([status])
//   @@index([technicianId])
//   @@index([coordinatorId])
//   @@index([department])
// }

const createTicket = async (req, res) => {
  const { title, department, deviceId, location, description, priority } = req.body;

  try {
    const newTicket = await db.ticket.create({
      data: {
        title,
        department,
        deviceId,
        location,
        description,
        priority,
        status: "OPEN", // All new tickets start as OPEN
        coordinator: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await db.ticket.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

const getAllOpenTickets = async (req, res, next) => {
  try {
    const tickets = await db.ticket.findMany({
      where: {
        status: "OPEN",
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!tickets) {
      return res.status(404).json({
        success: false,
        message: "No open tickets found",
      });
    }
    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets getAllOpenTickets catch:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

const getAllInProgressTickets = async (req, res) => {
  try {
    const tickets = await db.ticket.findMany({
      where: {
        status: "IN_PROGRESS",
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!tickets) {
      return res.status(404).json({
        success: false,
        message: "No in progress tickets found",
      });
    }
    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching in progresstickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch in progress tickets",
    });
  }
};

const getAllClosedTickets = async (req, res) => {
  try {
    const tickets = await db.ticket.findMany({
      where: {
        status: "CLOSED",
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!tickets) {
      return res.status(404).json({
        success: false,
        message: "No closed tickets found",
      });
    }
    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching closed tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch closed tickets",
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await db.ticket.findUnique({
      where: {
        id,
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }
    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket by id",
    });
  }
};

const setStatusToInProgress = async (req, res) => {
  const { id, technicianId } = req.params;

  try {
    const updatedTicket = await db.ticket.update({
      where: { id },
      data: {
        status: "IN_PROGRESS",
        technician: {
          connect: { id: technicianId },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Ticket status updated to IN_PROGRESS",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error(
      "Error updating ticket status in setStatusToInProgress:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to update ticket status",
    });
  }
};

const getAllTechnicianTickets = async (req, res) => {
  try {
    const id = req.user.id;
    const tickets = await db.ticket.findMany({
      where: {
        technicianId: id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!tickets) {
      return res.status(404).json({
        success: false,
        message: "No tickets found for this technician",
      });
    }
    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching technician tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch technician tickets",
    });
  }
};

const setStatusToClosed = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTicket = await db.ticket.update({
      where: { id },
      data: {
        status: "CLOSED",
        resolvedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Ticket status updated to CLOSED",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status in setStatusToClosed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update ticket status",
    });
  }
};

const getAllCoordinatorTickets = async (req, res) => {
  try {
    const id = req.user.id;
    const tickets = await db.ticket.findMany({
      where: {
        coordinatorId: id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching coordinator tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coordinator tickets",
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const content = req.body.content;

    const updatedTicket = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        content,
      },
    });

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update ticket",
    });
  }
};

const getAllTicketsDepartmentWise = async (req, res) => {
  try {
    const tickets = await db.ticket.findMany({
      include: {
        coordinator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technician: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Group tickets by department
    const ticketsByDepartment = tickets.reduce((acc, ticket) => {
      const dept = ticket.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(ticket);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      ticketsByDepartment,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};

export {
  createTicket,
  getTicketById,
  getAllTickets,
  getAllOpenTickets,
  getAllInProgressTickets,
  getAllClosedTickets,
  getAllTechnicianTickets,
  getAllCoordinatorTickets,
  setStatusToInProgress,
  setStatusToClosed,
  updateTicket,
  getAllTicketsDepartmentWise,
};
