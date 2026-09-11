import express from "express";

import {
  jobs,
  getJobById,
  getJobLocations,
  getJobTypes,
} from "../../src/data/jobs.js";

const router = express.Router();

// ============================================================
// GET JOB LOCATIONS
// ============================================================

router.get("/meta/locations", (req, res) => {
  res.json({
    success: true,
    locations: getJobLocations(),
  });
});

// ============================================================
// GET JOB TYPES
// ============================================================

router.get("/meta/types", (req, res) => {
  res.json({
    success: true,
    types: getJobTypes(),
  });
});

// ============================================================
// GET ALL JOBS
// ============================================================

router.get("/", (req, res) => {
  const {
    role,
    location,
    type,
    search,
  } = req.query;

  let results = [...jobs];

  // FILTER BY CAREER

  if (role) {
    results = results.filter(
      (job) =>
        job.role.toLowerCase() ===
        role.toLowerCase()
    );
  }

  // FILTER BY LOCATION

  if (location) {
    results = results.filter(
      (job) =>
        job.location.toLowerCase() ===
        location.toLowerCase()
    );
  }

  // FILTER BY JOB TYPE

  if (type) {
    results = results.filter(
      (job) =>
        job.type.toLowerCase() ===
        type.toLowerCase()
    );
  }

  // SEARCH

  if (search) {
    const searchText =
      search.toLowerCase().trim();

    results = results.filter((job) => {

      const titleMatch =
        job.title
          .toLowerCase()
          .includes(searchText);

      const companyMatch =
        job.company
          .toLowerCase()
          .includes(searchText);

      const skillMatch =
        job.skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchText)
        );

      return (
        titleMatch ||
        companyMatch ||
        skillMatch
      );
    });
  }

  res.json({
    success: true,
    count: results.length,
    jobs: results,
  });
});

// ============================================================
// GET JOB BY ID
// ============================================================

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const job = getJobById(id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found",
    });
  }

  res.json({
    success: true,
    job,
  });
});

export default router;