// ============================================================
// CAREER DATABASE
// CareerLens - Member 2 Career & Skill Data
// ============================================================

export const careers = {
  "Data Scientist": {
    demand: "High",
    growth: 18,
    salary: "₹11.5 LPA",
    jobs: "24,800+",
    topLocation: "Bangalore",

    salaryTrend: [5, 9, 15, 22],

    skills: [
      {
        name: "Python",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "Machine Learning",
        demand: 91,
        priority: "Critical",
      },
      {
        name: "SQL",
        demand: 84,
        priority: "High",
      },
      {
        name: "Statistics",
        demand: 78,
        priority: "High",
      },
      {
        name: "Deep Learning",
        demand: 72,
        priority: "Medium",
      },
      {
        name: "Cloud",
        demand: 61,
        priority: "Medium",
      },
    ],

    locations: [
      {
        name: "Bangalore",
        demand: 92,
      },
      {
        name: "Hyderabad",
        demand: 81,
      },
      {
        name: "Pune",
        demand: 74,
      },
      {
        name: "Chennai",
        demand: 66,
      },
      {
        name: "Delhi NCR",
        demand: 61,
      },
    ],
  },

  // ==========================================================
  // DATA ANALYST
  // ==========================================================

  "Data Analyst": {
    demand: "Very High",
    growth: 22,
    salary: "₹7.8 LPA",
    jobs: "31,500+",
    topLocation: "Bangalore",

    salaryTrend: [4, 7, 11, 16],

    skills: [
      {
        name: "SQL",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "Excel",
        demand: 90,
        priority: "Critical",
      },
      {
        name: "Python",
        demand: 80,
        priority: "High",
      },
      {
        name: "Statistics",
        demand: 78,
        priority: "High",
      },
      {
        name: "Power BI",
        demand: 75,
        priority: "High",
      },
      {
        name: "Tableau",
        demand: 70,
        priority: "Medium",
      },
    ],

    locations: [
      {
        name: "Bangalore",
        demand: 94,
      },
      {
        name: "Hyderabad",
        demand: 82,
      },
      {
        name: "Pune",
        demand: 76,
      },
      {
        name: "Mumbai",
        demand: 69,
      },
      {
        name: "Delhi NCR",
        demand: 64,
      },
    ],
  },

  // ==========================================================
  // SOFTWARE DEVELOPER
  // ==========================================================

  "Software Developer": {
    demand: "Very High",
    growth: 25,
    salary: "₹8.5 LPA",
    jobs: "45,200+",
    topLocation: "Bangalore",

    salaryTrend: [4.5, 8, 14, 21],

    skills: [
      {
        name: "JavaScript",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "React",
        demand: 88,
        priority: "Critical",
      },
      {
        name: "HTML",
        demand: 85,
        priority: "High",
      },
      {
        name: "CSS",
        demand: 80,
        priority: "High",
      },
      {
        name: "Git",
        demand: 75,
        priority: "High",
      },
      {
        name: "SQL",
        demand: 70,
        priority: "Medium",
      },
    ],

    locations: [
      {
        name: "Bangalore",
        demand: 96,
      },
      {
        name: "Hyderabad",
        demand: 85,
      },
      {
        name: "Pune",
        demand: 79,
      },
      {
        name: "Chennai",
        demand: 72,
      },
      {
        name: "Delhi NCR",
        demand: 68,
      },
    ],
  },

  // ==========================================================
  // MACHINE LEARNING ENGINEER
  // ==========================================================

  "Machine Learning Engineer": {
    demand: "Very High",
    growth: 28,
    salary: "₹13.2 LPA",
    jobs: "18,600+",
    topLocation: "Bangalore",

    salaryTrend: [6, 11, 18, 27],

    skills: [
      {
        name: "Python",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "Machine Learning",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "Deep Learning",
        demand: 90,
        priority: "Critical",
      },
      {
        name: "TensorFlow",
        demand: 80,
        priority: "High",
      },
      {
        name: "Cloud",
        demand: 75,
        priority: "High",
      },
      {
        name: "Docker",
        demand: 70,
        priority: "Medium",
      },
    ],

    locations: [
      {
        name: "Bangalore",
        demand: 95,
      },
      {
        name: "Hyderabad",
        demand: 84,
      },
      {
        name: "Pune",
        demand: 73,
      },
      {
        name: "Chennai",
        demand: 65,
      },
      {
        name: "Delhi NCR",
        demand: 60,
      },
    ],
  },

  // ==========================================================
  // CLOUD ENGINEER
  // ==========================================================

  "Cloud Engineer": {
    demand: "Very High",
    growth: 30,
    salary: "₹10.8 LPA",
    jobs: "21,400+",
    topLocation: "Hyderabad",

    salaryTrend: [5, 9, 15, 23],

    skills: [
      {
        name: "AWS",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "Linux",
        demand: 90,
        priority: "Critical",
      },
      {
        name: "Networking",
        demand: 85,
        priority: "High",
      },
      {
        name: "Docker",
        demand: 80,
        priority: "High",
      },
      {
        name: "Kubernetes",
        demand: 75,
        priority: "High",
      },
      {
        name: "Terraform",
        demand: 70,
        priority: "Medium",
      },
    ],

    locations: [
      {
        name: "Hyderabad",
        demand: 94,
      },
      {
        name: "Bangalore",
        demand: 90,
      },
      {
        name: "Pune",
        demand: 80,
      },
      {
        name: "Chennai",
        demand: 69,
      },
      {
        name: "Delhi NCR",
        demand: 62,
      },
    ],
  },

  // ==========================================================
  // CYBERSECURITY ANALYST
  // ==========================================================

  "Cybersecurity Analyst": {
    demand: "High",
    growth: 24,
    salary: "₹9.2 LPA",
    jobs: "16,700+",
    topLocation: "Hyderabad",

    salaryTrend: [4.5, 8, 13, 19],

    skills: [
      {
        name: "Cybersecurity",
        demand: 95,
        priority: "Critical",
      },
      {
        name: "Networking",
        demand: 90,
        priority: "Critical",
      },
      {
        name: "Linux",
        demand: 75,
        priority: "High",
      },
      {
        name: "Python",
        demand: 75,
        priority: "High",
      },
      {
        name: "SIEM",
        demand: 75,
        priority: "High",
      },
      {
        name: "Cloud",
        demand: 65,
        priority: "Medium",
      },
    ],

    locations: [
      {
        name: "Hyderabad",
        demand: 91,
      },
      {
        name: "Bangalore",
        demand: 88,
      },
      {
        name: "Pune",
        demand: 78,
      },
      {
        name: "Chennai",
        demand: 70,
      },
      {
        name: "Delhi NCR",
        demand: 67,
      },
    ],
  },
};

// ============================================================
// CAREER LIST
// ============================================================

export const careerNames = Object.keys(careers);

// ============================================================
// GET CAREER
// ============================================================

export function getCareer(careerName) {
  return (
    careers[careerName] ||
    careers["Data Scientist"]
  );
}