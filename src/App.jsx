import { useState } from "react";

import {
  Search,
  TrendingUp,
  Target,
  Briefcase,
  BarChart3,
  Map,
  ArrowRight,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

function App() {
  // ============================================================
  // PAGE STATE
  // ============================================================

  const [page, setPage] = useState("home");

  // ============================================================
  // PROFILE DATA
  // ============================================================

  const [profileData, setProfileData] = useState({
    name: "",
    education: "B.Tech Computer Science",
    college: "",
    targetCareer: "Data Scientist",
    experience: "Fresher",
    skills: ["Python", "SQL", "Java", "HTML", "CSS"],
  });

  // ============================================================
  // CAREER ROLE
  // ============================================================

  const [role, setRole] = useState("Data Scientist");

  // ============================================================
  // SELECTED JOB
  // ============================================================

  const [selectedJob, setSelectedJob] = useState(null);
  const [profileId, setProfileId] = useState(
  localStorage.getItem("careerLensProfileId")
);

  // ============================================================
  // ANALYZE ROLE FROM HOME SEARCH
  // ============================================================

  function analyzeRole() {
    const selectedRole = role.trim();

    if (!selectedRole) {
      alert("Please enter a career role.");
      return;
    }

    // Keep profile career synchronized with searched career
    setProfileData((previous) => ({
      ...previous,
      targetCareer: selectedRole,
    }));

    setRole(selectedRole);
    setPage("dashboard");
  }

  // ============================================================
  // OPEN PROFILE
  // ============================================================

  function openProfile() {
    setPage("profile");
  }

  // ============================================================
  // OPEN SKILL GAP
  // ============================================================

  function openSkillGap() {
    setPage("skillgap");
  }

  // ============================================================
  // OPEN DASHBOARD
  // ============================================================

  function openDashboard() {
    const selectedRole =
      profileData.targetCareer || "Data Scientist";

    setRole(selectedRole);
    setPage("dashboard");
  }

  // ============================================================
  // OPEN ROADMAP
  // ============================================================

  function openRoadmap() {
    setPage("roadmap");
  }

  // ============================================================
  // OPEN JOBS
  // ============================================================

  function openJobs() {
    const selectedRole =
      profileData.targetCareer ||
      role ||
      "Data Scientist";

    setRole(selectedRole);
    setPage("jobs");
  }

  // ============================================================
  // OPEN JOB DETAILS
  // ============================================================

  function openJobDetails(job) {
    setSelectedJob(job);
    setPage("jobDetails");
  }

  // ============================================================
  // DASHBOARD PAGE
  // ============================================================

  if (page === "dashboard") {
    return (
      <Dashboard
  role={
    profileData.targetCareer ||
    role ||
    "Data Scientist"
  }
  profileId={profileId}
  onBack={() => setPage("home")}
  onSkillGap={openSkillGap}
  onJobs={openJobs}
/>
    );
  }

  // ============================================================
  // PROFILE PAGE
  // ============================================================

  if (page === "profile") {
    return (
      <Profile
        profileData={profileData}
        setProfileData={setProfileData}
        onBack={() => setPage("home")}
        onAnalyze={() => {
          setRole(
            profileData.targetCareer ||
            "Data Scientist"
          );

          setPage("skillgap");
        }}
      />
    );
  }

  // ============================================================
  // SKILL GAP PAGE
  // ============================================================

  if (page === "skillgap") {
    return (
      <SkillGap
  profileData={profileData}
  profileId={profileId}
  onBack={() => setPage("profile")}
  onRoadmap={openRoadmap}
/>
    );
  }

  // ============================================================
  // ROADMAP PAGE
  // ============================================================

  if (page === "roadmap") {
    return (
     <Roadmap
  profileData={profileData}
  profileId={profileId}
  onBack={() => setPage("skillgap")}
/>
    );
  }

  // ============================================================
  // JOBS PAGE
  // ============================================================

  if (page === "jobs") {
    return (
      <Jobs
  role={profileData.targetCareer}
  profileData={profileData}
  profileId={profileId}
  onBack={() => setPage("dashboard")}
  onJobDetails={openJobDetails}
/>
    );
  }

  // ============================================================
  // JOB DETAILS PAGE
  // ============================================================

  if (page === "jobDetails") {
    const userSkills = profileData?.skills || [];

    const skillAliases = {
      javascript: ["javascript", "js"],
      js: ["javascript", "js"],

      react: ["react", "reactjs"],
      reactjs: ["react", "reactjs"],

      sql: ["sql", "mysql", "postgresql"],
      mysql: ["sql", "mysql"],
      postgresql: ["sql", "postgresql"],

      python: ["python"],

      ml: ["ml", "machine learning"],
      "machine learning": ["ml", "machine learning"],

      dl: ["dl", "deep learning"],
      "deep learning": ["dl", "deep learning"],

      tensorflow: ["tensorflow"],

      aws: ["aws"],
      linux: ["linux"],
      docker: ["docker"],
      kubernetes: ["kubernetes"],
      terraform: ["terraform"],

      cybersecurity: [
        "cybersecurity",
        "cyber security",
      ],

      "cyber security": [
        "cybersecurity",
        "cyber security",
      ],

      networking: ["networking"],
      siem: ["siem"],
      statistics: ["statistics"],
      excel: ["excel"],
      "power bi": ["power bi"],
      tableau: ["tableau"],

      git: ["git", "github"],
      github: ["git", "github"],

      html: ["html"],
      css: ["css"],
      pandas: ["pandas"],
    };

    function hasMatchingSkill(
      userSkill,
      requiredSkill
    ) {
      const user = userSkill
        .toLowerCase()
        .trim();

      const required = requiredSkill
        .toLowerCase()
        .trim();

      if (user === required) {
        return true;
      }

      const aliases =
        skillAliases[required] || [required];

      return aliases.some(
        (alias) =>
          user === alias ||
          user.includes(alias) ||
          alias.includes(user)
      );
    }

    const requiredSkills =
      selectedJob?.skills || [];

    const matchedSkills =
      requiredSkills.filter((requiredSkill) =>
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
          !matchedSkills.includes(requiredSkill)
      );

    const matchPercentage =
      requiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length /
              requiredSkills.length) *
              100
          );

    return (
      <JobDetails
        job={selectedJob}
        matchPercentage={matchPercentage}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        onBack={() => setPage("jobs")}
      />
    );
  }

  // ============================================================
  // HOME PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="border-b border-slate-800 bg-slate-950/90">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LOGO */}

          <button
            type="button"
            onClick={() => setPage("home")}
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>

            <div className="text-left">

              <h1 className="text-xl font-bold">
                CareerLens
              </h1>

              <p className="text-xs text-slate-400">
                Career Intelligence
              </p>

            </div>

          </button>

          {/* NAVIGATION */}

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">

            <button
              type="button"
              onClick={() => setPage("home")}
              className="hover:text-white transition"
            >
              Home
            </button>

            <button
              type="button"
              onClick={openProfile}
              className="hover:text-white transition"
            >
              My Profile
            </button>

            <button
              type="button"
              onClick={openDashboard}
              className="hover:text-white transition"
            >
              Analytics
            </button>

            <button
              type="button"
              onClick={openSkillGap}
              className="hover:text-white transition"
            >
              Skill Gap
            </button>

            <button
              type="button"
              onClick={openJobs}
              className="hover:text-white transition"
            >
              Jobs
            </button>

          </div>

          {/* GET STARTED */}

          <button
            type="button"
            onClick={openProfile}
            className="px-5 py-2.5 rounded-lg bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
          >
            Get Started
          </button>

        </div>

      </nav>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        {/* BACKGROUND GLOW */}

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-3xl rounded-full" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">

          {/* BADGE */}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">

            <TrendingUp size={16} />

            Data-driven career intelligence

          </div>

          {/* HEADING */}

          <h2 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight">

            Build the career

            <br />

            <span className="text-blue-500">
              you are ready for.
            </span>

          </h2>

          {/* DESCRIPTION */}

          <p className="mt-7 max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed">

            Explore job demand, salary trends, required skills,
            skill gaps and personalized career roadmaps — all in one platform.

          </p>

          {/* SEARCH */}

          <div className="mt-10 max-w-2xl mx-auto">

            <div className="flex items-center bg-white rounded-xl p-2 shadow-2xl">

              <Search
                size={22}
                className="ml-3 text-slate-400"
              />

              <input
                type="text"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    analyzeRole();
                  }
                }}
                placeholder="Search a career role..."
                className="flex-1 px-4 py-3 text-slate-900 outline-none"
              />

              <button
                type="button"
                onClick={analyzeRole}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                Analyze
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

          {/* POPULAR ROLES */}

          <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm">

            <span className="text-slate-500">
              Popular:
            </span>

            {[
              "Data Scientist",
              "Software Developer",
              "Data Analyst",
              "Cloud Engineer",
            ].map((item) => (

              <button
                key={item}
                type="button"
                onClick={() => {
                  setRole(item);

                  setProfileData((previous) => ({
                    ...previous,
                    targetCareer: item,
                  }));
                }}
                className="text-slate-300 hover:text-blue-400 transition"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* ======================================================
          FEATURE CARDS
      ====================================================== */}

      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="grid md:grid-cols-3 gap-6">

          <button
            type="button"
            onClick={openDashboard}
            className="text-left"
          >

            <FeatureCard
              icon={<BarChart3 />}
              title="Job Market Analytics"
              description="Understand job demand, salary trends, locations and emerging opportunities."
            />

          </button>

          <button
            type="button"
            onClick={openSkillGap}
            className="text-left"
          >

            <FeatureCard
              icon={<Target />}
              title="Skill Gap Analysis"
              description="Compare your current skills with the skills employers require."
            />

          </button>

          <button
            type="button"
            onClick={openProfile}
            className="text-left"
          >

            <FeatureCard
              icon={<Map />}
              title="Personalized Roadmap"
              description="Get a step-by-step learning roadmap based on your career goal."
            />

          </button>

        </div>

      </section>

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="border-t border-slate-800 bg-slate-900/40">

        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="text-center">

            <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
              How it works
            </p>

            <h3 className="mt-3 text-3xl md:text-4xl font-bold">
              From career goal to job-ready
            </h3>

            <p className="mt-4 text-slate-400">
              Make better career decisions using job-market insights.
            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-14">

            <Step
              number="01"
              title="Choose a Career"
              description="Select the role you want to pursue."
            />

            <Step
              number="02"
              title="Analyze the Market"
              description="Explore salary, demand and required skills."
            />

            <Step
              number="03"
              title="Find Your Gap"
              description="Compare your skills with industry requirements."
            />

            <Step
              number="04"
              title="Follow Your Roadmap"
              description="Build the skills needed to become job-ready."
            />

          </div>

        </div>

      </section>

      {/* ======================================================
          FINAL CTA
      ====================================================== */}

      <section className="border-t border-slate-800">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <Briefcase
            className="mx-auto text-blue-500"
            size={38}
          />

          <h3 className="mt-6 text-3xl md:text-4xl font-bold">
            Your career. Backed by data.
          </h3>

          <p className="mt-4 text-slate-400">
            Stop guessing what to learn. Start understanding what the market needs.
          </p>

          <button
            type="button"
            onClick={openProfile}
            className="mt-8 px-7 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Start Career Analysis →
          </button>

        </div>

      </section>

    </div>
  );
}

// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon,
  title,
  description,
}) {

  return (
    <div className="group p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition duration-300 cursor-pointer">

      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500/20 transition">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-slate-400 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

// ============================================================
// STEP
// ============================================================

function Step({
  number,
  title,
  description,
}) {

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">

      <span className="text-blue-500 font-bold">
        {number}
      </span>

      <h4 className="mt-4 text-lg font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>

    </div>
  );
}

export default App;