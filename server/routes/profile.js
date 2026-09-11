import express from "express";
import db from "../database/db.js";

const router = express.Router();


// ============================================================
// CREATE PROFILE
// POST /api/profile
// ============================================================

router.post("/", (req, res) => {
  try {
    const {
      name,
      education,
      college,
      targetCareer,
      experience,
      skills,
    } = req.body;

    if (!name || !targetCareer) {
      return res.status(400).json({
        success: false,
        message: "Name and target career are required",
      });
    }

    const now = new Date().toISOString();

    const skillsJson = JSON.stringify(
      Array.isArray(skills) ? skills : []
    );

    const statement = db.prepare(`
      INSERT INTO profiles
      (
        name,
        education,
        college,
        targetCareer,
        experience,
        skills,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
      name,
      education || "",
      college || "",
      targetCareer,
      experience || "Fresher",
      skillsJson,
      now,
      now
    );

    const profile = db
      .prepare(
        "SELECT * FROM profiles WHERE id = ?"
      )
      .get(result.lastInsertRowid);

    profile.skills = JSON.parse(profile.skills);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {

    console.error("Create profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create profile",
    });
  }
});


// ============================================================
// GET PROFILE
// GET /api/profile/:id
// ============================================================

router.get("/:id", (req, res) => {
  try {

    const id = Number(req.params.id);

    const profile = db
      .prepare(
        "SELECT * FROM profiles WHERE id = ?"
      )
      .get(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.skills = JSON.parse(profile.skills || "[]");

    res.json({
      success: true,
      profile,
    });

  } catch (error) {

    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
    });
  }
});


// ============================================================
// UPDATE PROFILE
// PUT /api/profile/:id
// ============================================================

router.put("/:id", (req, res) => {
  try {

    const id = Number(req.params.id);

    const existingProfile = db
      .prepare(
        "SELECT * FROM profiles WHERE id = ?"
      )
      .get(id);

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const {
      name,
      education,
      college,
      targetCareer,
      experience,
      skills,
    } = req.body;

    const updatedProfile = {
      name: name ?? existingProfile.name,
      education:
        education ?? existingProfile.education,
      college:
        college ?? existingProfile.college,
      targetCareer:
        targetCareer ?? existingProfile.targetCareer,
      experience:
        experience ?? existingProfile.experience,
      skills:
        Array.isArray(skills)
          ? skills
          : JSON.parse(existingProfile.skills || "[]"),
      updatedAt: new Date().toISOString(),
    };

    db.prepare(`
      UPDATE profiles
      SET
        name = ?,
        education = ?,
        college = ?,
        targetCareer = ?,
        experience = ?,
        skills = ?,
        updatedAt = ?
      WHERE id = ?
    `).run(
      updatedProfile.name,
      updatedProfile.education,
      updatedProfile.college,
      updatedProfile.targetCareer,
      updatedProfile.experience,
      JSON.stringify(updatedProfile.skills),
      updatedProfile.updatedAt,
      id
    );

    const profile = db
      .prepare(
        "SELECT * FROM profiles WHERE id = ?"
      )
      .get(id);

    profile.skills = JSON.parse(profile.skills || "[]");

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });

  } catch (error) {

    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});


// ============================================================
// DELETE PROFILE
// DELETE /api/profile/:id
// ============================================================

router.delete("/:id", (req, res) => {
  try {

    const id = Number(req.params.id);

    const result = db
      .prepare(
        "DELETE FROM profiles WHERE id = ?"
      )
      .run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });

  } catch (error) {

    console.error("Delete profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete profile",
    });
  }
});

export default router;