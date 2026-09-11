// ============================================================
// SKILL DATABASE
// CareerLens - Member 2 Skill Data
// ============================================================

// ============================================================
// ALL PLATFORM SKILLS
// ============================================================

export const skills = {
  Python: {
    category: "Programming",
    level: "Core",
    aliases: ["python"],
  },

  JavaScript: {
    category: "Programming",
    level: "Core",
    aliases: ["javascript", "js"],
  },

  Java: {
    category: "Programming",
    level: "Core",
    aliases: ["java"],
  },

  SQL: {
    category: "Database",
    level: "Core",
    aliases: ["sql", "mysql", "postgresql"],
  },

  "Machine Learning": {
    category: "Artificial Intelligence",
    level: "Advanced",
    aliases: [
      "machine learning",
      "machinelearning",
      "ml",
    ],
  },

  "Deep Learning": {
    category: "Artificial Intelligence",
    level: "Advanced",
    aliases: [
      "deep learning",
      "deeplearning",
      "dl",
    ],
  },

  TensorFlow: {
    category: "Artificial Intelligence",
    level: "Advanced",
    aliases: ["tensorflow"],
  },

  Pandas: {
    category: "Data Science",
    level: "Intermediate",
    aliases: ["pandas"],
  },

  Statistics: {
    category: "Data Science",
    level: "Core",
    aliases: [
      "statistics",
      "statistical analysis",
    ],
  },

  Excel: {
    category: "Data Analytics",
    level: "Core",
    aliases: [
      "excel",
      "microsoft excel",
    ],
  },

  "Power BI": {
    category: "Data Analytics",
    level: "Intermediate",
    aliases: [
      "power bi",
      "powerbi",
    ],
  },

  Tableau: {
    category: "Data Analytics",
    level: "Intermediate",
    aliases: ["tableau"],
  },

  React: {
    category: "Web Development",
    level: "Advanced",
    aliases: ["react", "reactjs"],
  },

  HTML: {
    category: "Web Development",
    level: "Core",
    aliases: ["html"],
  },

  CSS: {
    category: "Web Development",
    level: "Core",
    aliases: ["css"],
  },

  Git: {
    category: "Development Tools",
    level: "Core",
    aliases: ["git", "github"],
  },

  AWS: {
    category: "Cloud",
    level: "Advanced",
    aliases: [
      "aws",
      "amazon web services",
    ],
  },

  Linux: {
    category: "Operating Systems",
    level: "Core",
    aliases: ["linux"],
  },

  Docker: {
    category: "DevOps",
    level: "Advanced",
    aliases: ["docker"],
  },

  Kubernetes: {
    category: "DevOps",
    level: "Advanced",
    aliases: [
      "kubernetes",
      "k8s",
    ],
  },

  Terraform: {
    category: "DevOps",
    level: "Advanced",
    aliases: ["terraform"],
  },

  Networking: {
    category: "Networking",
    level: "Core",
    aliases: [
      "networking",
      "computer networking",
    ],
  },

  Cybersecurity: {
    category: "Security",
    level: "Advanced",
    aliases: [
      "cybersecurity",
      "cyber security",
      "information security",
    ],
  },

  SIEM: {
    category: "Security",
    level: "Advanced",
    aliases: ["siem"],
  },
};

// ============================================================
// SKILL CATEGORIES
// ============================================================

export const skillCategories = [
  "Programming",
  "Database",
  "Artificial Intelligence",
  "Data Science",
  "Data Analytics",
  "Web Development",
  "Development Tools",
  "Cloud",
  "Operating Systems",
  "DevOps",
  "Networking",
  "Security",
];

// ============================================================
// SKILL LIST
// ============================================================

export const skillNames = Object.keys(skills);

// ============================================================
// NORMALIZE SKILL
// ============================================================

export function normalizeSkill(skill) {
  return String(skill)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// ============================================================
// CHECK WHETHER TWO SKILLS MATCH
// ============================================================

export function hasMatchingSkill(
  userSkill,
  requiredSkill
) {
  const user = normalizeSkill(userSkill);
  const required = normalizeSkill(requiredSkill);

  if (user === required) {
    return true;
  }

  for (const skill of Object.values(skills)) {
    const aliases = skill.aliases.map(
      normalizeSkill
    );

    if (
      aliases.includes(user) &&
      aliases.includes(required)
    ) {
      return true;
    }
  }

  return false;
}

// ============================================================
// FIND CANONICAL SKILL NAME
// Example: "js" → "JavaScript"
// ============================================================

export function getCanonicalSkill(skill) {
  const normalized = normalizeSkill(skill);

  for (const [name, data] of Object.entries(skills)) {
    const aliases = data.aliases.map(
      normalizeSkill
    );

    if (
      normalized === normalizeSkill(name) ||
      aliases.includes(normalized)
    ) {
      return name;
    }
  }

  return skill;
}

// ============================================================
// GET SKILL INFORMATION
// ============================================================

export function getSkill(skill) {
  const canonicalName =
    getCanonicalSkill(skill);

  return (
    skills[canonicalName] || null
  );
}

// ============================================================
// CALCULATE SKILL MATCH
// ============================================================

export function calculateSkillMatch(
  userSkills,
  requiredSkills
) {
  if (!requiredSkills.length) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const matchedSkills =
    requiredSkills.filter(
      (requiredSkill) =>
        userSkills.some((userSkill) =>
          hasMatchingSkill(
            userSkill,
            requiredSkill
          )
        )
    );

  const missingSkills =
    requiredSkills.filter(
      (requiredSkill) =>
        !matchedSkills.includes(
          requiredSkill
        )
    );

  const percentage = Math.round(
    (matchedSkills.length /
      requiredSkills.length) *
      100
  );

  return {
    percentage,
    matchedSkills,
    missingSkills,
  };
}

// ============================================================
// GROUP SKILLS BY CATEGORY
// ============================================================

export function getSkillsByCategory() {
  const grouped = {};

  for (const category of skillCategories) {
    grouped[category] = [];
  }

  for (const [name, data] of Object.entries(skills)) {
    if (!grouped[data.category]) {
      grouped[data.category] = [];
    }

    grouped[data.category].push(name);
  }

  return grouped;
}