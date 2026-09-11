// ============================================================
// CAREERLENS API SERVICE
// ============================================================

const API_BASE_URL = "https://career-lens-8hil.onrender.com/api";

// ============================================================
// GENERIC API REQUEST
// ============================================================

async function apiRequest(endpoint) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    );
  }

  return response.json();
}

// ============================================================
// HEALTH
// ============================================================

export async function getHealth() {
  return apiRequest("/health");
}

// ============================================================
// CAREERS
// ============================================================

export async function getCareers() {
  return apiRequest("/careers");
}

export async function getCareer(careerName) {
  return apiRequest(
    `/careers/${encodeURIComponent(careerName)}`
  );
}

// ============================================================
// JOBS
// ============================================================

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();

  if (filters.role) {
    params.append("role", filters.role);
  }

  if (filters.location) {
    params.append("location", filters.location);
  }

  if (filters.type) {
    params.append("type", filters.type);
  }

  if (filters.search) {
    params.append("search", filters.search);
  }

  const query =
    params.toString();

  return apiRequest(
    `/jobs${query ? `?${query}` : ""}`
  );
}

export async function getJob(jobId) {
  return apiRequest(
    `/jobs/${jobId}`
  );
}

export async function getJobLocations() {
  return apiRequest(
    "/jobs/meta/locations"
  );
}

export async function getJobTypes() {
  return apiRequest(
    "/jobs/meta/types"
  );
}

// ============================================================
// SKILLS
// ============================================================

export async function getSkills() {
  return apiRequest("/skills");
}

export async function getSkill(skillName) {
  return apiRequest(
    `/skills/${encodeURIComponent(skillName)}`
  );
}

export async function getSkillsByCategory(
  category
) {
  return apiRequest(
    `/skills/category/${encodeURIComponent(category)}`
  );
}

// ============================================================
// PROFILE
// ============================================================

// Create a new profile
export async function createProfile(profileData) {
  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Profile creation failed: ${response.status}`
    );
  }

  return response.json();
}


// Get profile by ID
export async function getProfile(profileId) {
  return apiRequest(
    `/profile/${profileId}`
  );
}


// Update existing profile
export async function updateProfile(
  profileId,
  profileData
) {
  const response = await fetch(
    `${API_BASE_URL}/profile/${profileId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Profile update failed: ${response.status}`
    );
  }

  return response.json();
}


// Delete profile
export async function deleteProfile(profileId) {
  const response = await fetch(
    `${API_BASE_URL}/profile/${profileId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Profile deletion failed: ${response.status}`
    );
  }

  return response.json();
}


// ============================================================
// ANALYTICS
// ============================================================

// Get career readiness analytics for a profile
export async function getProfileAnalytics(
  profileId
) {
  return apiRequest(
    `/analytics/profile/${profileId}`
  );
}