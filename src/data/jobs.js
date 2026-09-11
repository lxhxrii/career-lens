// ============================================================
// JOB DATABASE
// CareerLens - Member 2 Job Data
// ============================================================

export const jobs = [
  // ==========================================================
  // DATA SCIENTIST
  // ==========================================================

  {
    id: 1,
    title: "Junior Data Scientist",
    company: "TechNova Solutions",
    role: "Data Scientist",
    location: "Bangalore",
    salary: "₹6–10 LPA",
    experience: "0–2 yrs",
    type: "Full-time",
    skills: [
      "Python",
      "SQL",
      "Machine Learning",
    ],
  },

  {
    id: 2,
    title: "Data Scientist",
    company: "Insight Analytics",
    role: "Data Scientist",
    location: "Hyderabad",
    salary: "₹8–14 LPA",
    experience: "1–3 yrs",
    type: "Full-time",
    skills: [
      "Python",
      "SQL",
      "Statistics",
    ],
  },

  {
    id: 3,
    title: "Data Science Intern",
    company: "DataWorks India",
    role: "Data Scientist",
    location: "Pune",
    salary: "₹25K–40K/month",
    experience: "Fresher",
    type: "Internship",
    skills: [
      "Python",
      "Pandas",
      "Machine Learning",
    ],
  },

  // ==========================================================
  // DATA ANALYST
  // ==========================================================

  {
    id: 4,
    title: "Junior Data Analyst",
    company: "Analytics Hub",
    role: "Data Analyst",
    location: "Bangalore",
    salary: "₹5–8 LPA",
    experience: "0–2 yrs",
    type: "Full-time",
    skills: [
      "SQL",
      "Excel",
      "Power BI",
    ],
  },

  {
    id: 5,
    title: "Data Analyst",
    company: "Business Insights Pvt Ltd",
    role: "Data Analyst",
    location: "Hyderabad",
    salary: "₹6–10 LPA",
    experience: "1–3 yrs",
    type: "Full-time",
    skills: [
      "SQL",
      "Python",
      "Tableau",
    ],
  },

  // ==========================================================
  // SOFTWARE DEVELOPER
  // ==========================================================

  {
    id: 6,
    title: "Software Developer",
    company: "CodeCraft Technologies",
    role: "Software Developer",
    location: "Bangalore",
    salary: "₹7–12 LPA",
    experience: "0–2 yrs",
    type: "Full-time",
    skills: [
      "JavaScript",
      "React",
      "Git",
    ],
  },

  {
    id: 7,
    title: "Frontend Developer",
    company: "WebStack Solutions",
    role: "Software Developer",
    location: "Hyderabad",
    salary: "₹6–11 LPA",
    experience: "1–3 yrs",
    type: "Full-time",
    skills: [
      "React",
      "HTML",
      "CSS",
    ],
  },

  // ==========================================================
  // MACHINE LEARNING ENGINEER
  // ==========================================================

  {
    id: 8,
    title: "Machine Learning Engineer",
    company: "AI Labs India",
    role: "Machine Learning Engineer",
    location: "Bangalore",
    salary: "₹9–16 LPA",
    experience: "1–3 yrs",
    type: "Full-time",
    skills: [
      "Python",
      "Machine Learning",
      "TensorFlow",
    ],
  },

  {
    id: 9,
    title: "ML Engineer Intern",
    company: "Future AI Technologies",
    role: "Machine Learning Engineer",
    location: "Pune",
    salary: "₹30K–50K/month",
    experience: "Fresher",
    type: "Internship",
    skills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
    ],
  },

  // ==========================================================
  // CLOUD ENGINEER
  // ==========================================================

  {
    id: 10,
    title: "Cloud Engineer",
    company: "CloudSphere",
    role: "Cloud Engineer",
    location: "Hyderabad",
    salary: "₹7–13 LPA",
    experience: "0–2 yrs",
    type: "Full-time",
    skills: [
      "AWS",
      "Linux",
      "Docker",
    ],
  },

  {
    id: 11,
    title: "AWS Cloud Engineer",
    company: "CloudWorks India",
    role: "Cloud Engineer",
    location: "Bangalore",
    salary: "₹8–15 LPA",
    experience: "1–3 yrs",
    type: "Full-time",
    skills: [
      "AWS",
      "Kubernetes",
      "Terraform",
    ],
  },

  // ==========================================================
  // CYBERSECURITY ANALYST
  // ==========================================================

  {
    id: 12,
    title: "Cybersecurity Analyst",
    company: "SecureNet Technologies",
    role: "Cybersecurity Analyst",
    location: "Hyderabad",
    salary: "₹6–11 LPA",
    experience: "0–2 yrs",
    type: "Full-time",
    skills: [
      "Cybersecurity",
      "Networking",
      "Linux",
    ],
  },

  {
    id: 13,
    title: "Security Operations Analyst",
    company: "CyberGuard India",
    role: "Cybersecurity Analyst",
    location: "Bangalore",
    salary: "₹7–12 LPA",
    experience: "1–3 yrs",
    type: "Full-time",
    skills: [
      "SIEM",
      "Networking",
      "Cybersecurity",
    ],
  },
];

// ============================================================
// GET JOBS FOR A CAREER
// ============================================================

export function getJobsByCareer(careerName) {
  return jobs.filter(
    (job) => job.role === careerName
  );
}

// ============================================================
// GET SINGLE JOB
// ============================================================

export function getJobById(jobId) {
  return jobs.find(
    (job) => job.id === jobId
  );
}

// ============================================================
// GET AVAILABLE LOCATIONS
// ============================================================

export function getJobLocations() {
  return [
    ...new Set(
      jobs.map((job) => job.location)
    ),
  ];
}

// ============================================================
// GET AVAILABLE JOB TYPES
// ============================================================

export function getJobTypes() {
  return [
    ...new Set(
      jobs.map((job) => job.type)
    ),
  ];
}