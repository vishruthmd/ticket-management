import express from "express";
import bcrypt from "bcryptjs";
import db from "../libs/db.libs.js";
import { userRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const getAllTechnicians = async (req, res) => {
  try {
    const technicians = await db.user.findMany({
      where: {
        role: userRole.TECHNICIAN,
      },
    });
    res.status(200).json({
      success: true,
      message: "Technicians fetched successfully",
      technicians,
    });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch technicians",
    });
  }
};

const getAllCoordinators = async (req, res) => {
  try {
    const coordinators = await db.user.findMany({
      where: {
        role: userRole.COORDINATOR,
      },
    });
    res.status(200).json({
      success: true,
      message: "Coordinators fetched successfully",
      coordinators,
    });
  } catch (error) {
    console.error("Error fetching coordinators:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch coordinators",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role } = req.body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { name, role },
    });

    res
      .status(200)
      .json({ success: true, message: "User updated", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

const createUser = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    // check existing
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "user already exists",
      });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user with hashed pw
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
      },
    });

    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.log("error creating user", error);
    res.status(500).json({
      success: false,
      error: "Error creating a user",
    });
  }
}

export { getAllTechnicians, getAllCoordinators, getUserById, updateUser, createUser };
