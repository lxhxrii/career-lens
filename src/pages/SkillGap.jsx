import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Target,
  TrendingUp,
  BookOpen,
} from "lucide-react";

import { getCareer } from "../data/careers";

import {
  hasMatchingSkill,
  getCanonicalSkill,
} from "../data/skills";

import { getProfileAnalytics } from "../services/api";

// ============================================================
// MAIN COMPONENT
// ============================================================

function SkillGap({
  profileData,
  profileId,
  onBack,
  onRoadmap,
}) {
  // ============================================================
  // BACKEND ANALYTICS STATE
  // ============================================================

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] =
    useState(false);
  const [analyticsError, setAnalyticsError] =
    useState("");

  // ============================================================
  // PROFILE DATA
  // ============================================================

  const targetCareer =
    profileData?.targetCareer || "Data Scientist";

  const userSkills =
    profileData?.skills || [];

  // ============================================================
  // GET CAREER DATA
  // ============================================================

  const career = getCareer(targetCareer);

  const requiredSkills =
    career.skills || [];

  // ============================================================
  // LOAD ANALYTICS FROM BACKEND
  // ============================================================

  useEffect(() => {
    async function loadAnalytics() {
      if (!profileId) {
        setAnalytics(null);
        setAnalyticsError("");
        return;
      }

      try {
        setLoadingAnalytics(true);
        setAnalyticsError("");

        const response =
          await getProfileAnalytics(profileId);

        if (response.success) {
          setAnalytics(response.analytics);
        } else {
          setAnalyticsError(
            response.message ||
              "Unable to load career analytics."
          );

          setAnalytics(null);
        }
      } catch (error) {
        console.error(
          "Skill gap analytics error:",
          error
        );

        setAnalyticsError(
          "Unable to connect to analytics service."
        );

        setAnalytics(null);
      } finally {
        setLoadingAnalytics(false);
      }
    }

    loadAnalytics();
  }, [profileId]);

  // ============================================================
  // CALCULATE SKILL STATUS
  // ============================================================
  // Backend is the primary source.
  // Frontend calculation is used as a fallback.

  const analyzedSkills =
    requiredSkills.map((skill) => {
      const backendMatched =
        analytics?.matchedSkills?.some(
          (matchedSkill) =>
            matchedSkill.toLowerCase() ===
            skill.name.toLowerCase()
        );

      const matched =
        analytics
          ? Boolean(backendMatched)
          : userSkills.some((userSkill) =>
              hasMatchingSkill(
                userSkill,
                skill.name
              )
            );

      return {
        ...skill,

        importance:
          skill.priority === "Critical"
            ? "Critical"
            : skill.priority === "High"
            ? "Important"
            : "Recommended",

        matched,
      };
    });

  // ============================================================
  // FRONTEND FALLBACK MATCH CALCULATION
  // ============================================================

  const totalDemand =
    analyzedSkills.reduce(
      (sum, skill) =>
        sum + skill.demand,
      0
    );

  const matchedDemand =
    analyzedSkills.reduce(
      (sum, skill) =>
        sum +
        (skill.matched
          ? skill.demand
          : 0),
      0
    );

  const frontendMatchPercentage =
    totalDemand === 0
      ? 0
      : Math.round(
          (matchedDemand /
            totalDemand) *
            100
        );

  // ============================================================
  // BACKEND READINESS SCORE
  // ============================================================

  const matchPercentage =
    analytics?.readinessScore ??
    frontendMatchPercentage;

  // ============================================================
  // COUNTS
  // ============================================================

  const strongSkills =
    analyzedSkills.filter(
      (skill) => skill.matched
    );

  const missingSkills =
    analyzedSkills.filter(
      (skill) => !skill.matched
    );

  const criticalMissing =
    missingSkills.filter(
      (skill) =>
        skill.importance ===
        "Critical"
    );

  const importantMissing =
    missingSkills.filter(
      (skill) =>
        skill.importance ===
        "Important"
    );

  const recommendedMissing =
    missingSkills.filter(
      (skill) =>
        skill.importance ===
        "Recommended"
    );

  // ============================================================
  // READINESS LABEL
  // ============================================================

  let readiness =
    "Needs Development";

  if (analytics?.readinessLevel) {
    readiness =
      analytics.readinessLevel;
  } else if (matchPercentage >= 80) {
    readiness =
      "Highly Job Ready";
  } else if (matchPercentage >= 60) {
    readiness =
      "Almost Job Ready";
  } else if (matchPercentage >= 40) {
    readiness =
      "Developing";
  }

  // ============================================================
  // BACKEND RECOMMENDED SKILLS
  // ============================================================

  const backendRecommendedSkills =
    analytics?.recommendedSkills || [];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-800">

        <div className="max-w-6xl mx-auto px-6 py-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back to Profile
          </button>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ==================================================
            TITLE
        ================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Target size={25} />
            </div>

            <div>

              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wide">
                Career Analysis
              </p>

              <h1 className="text-3xl font-bold">
                {targetCareer}
              </h1>

            </div>

          </div>

          <p className="mt-4 text-slate-400">
            Personalized skill gap analysis based on your profile.
          </p>

        </div>

        {/* ==================================================
            ANALYTICS STATUS
        ================================================== */}

        {loadingAnalytics && (
          <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            Calculating your career readiness from your profile...
          </div>
        )}

        {analyticsError && (
          <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
            {analyticsError}
            <p className="text-xs text-yellow-500/70 mt-1">
              Showing locally calculated results as a fallback.
            </p>
          </div>
        )}

        {/* ==================================================
            PROFILE SUMMARY
        ================================================== */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Candidate
            </p>

            <p className="mt-2 font-semibold text-lg">
              {profileData?.name ||
                "Your Profile"}
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Experience
            </p>

            <p className="mt-2 font-semibold text-lg">
              {profileData?.experience ||
                "Fresher"}
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <p className="text-sm text-slate-500">
              Skills Added
            </p>

            <p className="mt-2 font-semibold text-lg">
              {userSkills.length}
            </p>

          </div>

        </div>

        {/* ==================================================
            SKILL MATCH / READINESS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <p className="text-slate-400">
                Career Readiness
              </p>

              <div className="flex items-end gap-3 mt-2">

                <span className="text-6xl font-bold text-blue-500">

                  {loadingAnalytics
                    ? "..."
                    : `${matchPercentage}%`}

                </span>

                <span className="text-slate-400 mb-2">
                  skill match
                </span>

              </div>

              <p className="mt-3 text-slate-300">
                {loadingAnalytics
                  ? "Calculating..."
                  : readiness}
              </p>

            </div>

            <div className="w-full md:w-72">

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-400">
                  Overall Match
                </span>

                <span className="font-semibold">
                  {loadingAnalytics
                    ? "..."
                    : `${matchPercentage}%`}
                </span>

              </div>

              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${matchPercentage}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* BACKEND ANALYTICS SUMMARY */}

          {analytics && (
            <div className="grid grid-cols-3 gap-4 mt-7 pt-6 border-t border-slate-800">

              <div className="text-center">

                <p className="text-2xl font-bold text-green-400">
                  {analytics.totalMatchedSkills}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Matched Skills
                </p>

              </div>

              <div className="text-center">

                <p className="text-2xl font-bold text-red-400">
                  {analytics.totalMissingSkills}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Missing Skills
                </p>

              </div>

              <div className="text-center">

                <p className="text-2xl font-bold text-blue-400">
                  {analytics.totalRequiredSkills}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Required Skills
                </p>

              </div>

            </div>
          )}

        </section>

        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <SummaryCard
            icon={<CheckCircle2 />}
            title="Strong Skills"
            value={strongSkills.length}
            description="Skills you already have"
            type="success"
          />

          <SummaryCard
            icon={<AlertTriangle />}
            title="Needs Improvement"
            value={
              importantMissing.length +
              recommendedMissing.length
            }
            description="Skills to develop"
            type="warning"
          />

          <SummaryCard
            icon={<XCircle />}
            title="Critical Gaps"
            value={criticalMissing.length}
            description="High-priority missing skills"
            type="danger"
          />

        </div>

        {/* ==================================================
            SKILL ANALYSIS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex items-center justify-between mb-7">

            <div>

              <h2 className="text-xl font-semibold">
                Skill Analysis
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Your skills compared with {targetCareer} requirements.
              </p>

            </div>

            <TrendingUp
              className="text-blue-500"
              size={24}
            />

          </div>

          <div className="space-y-4">

            {analyzedSkills.map((skill) => (

              <div
                key={skill.name}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800"
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        skill.matched
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >

                      {skill.matched ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}

                    </div>

                    <div>

                      <h3 className="font-semibold">
                        {skill.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        Market demand: {skill.demand}%
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        skill.matched
                          ? "bg-green-500/10 text-green-400"
                          : skill.importance === "Critical"
                          ? "bg-red-500/10 text-red-400"
                          : skill.importance === "Important"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >

                      {skill.matched
                        ? "Strong"
                        : skill.importance}

                    </span>

                  </div>

                </div>

                {/* DEMAND BAR */}

                <div className="mt-4">

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        skill.matched
                          ? "bg-green-500"
                          : "bg-slate-600"
                      }`}
                      style={{
                        width: `${skill.demand}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* ==================================================
            CURRENT SKILLS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <h2 className="text-xl font-semibold mb-5">
            Your Current Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {userSkills.length > 0 ? (

              userSkills.map((skill) => (

                <span
                  key={skill}
                  className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400"
                >
                  {getCanonicalSkill(skill) ||
                    skill}
                </span>

              ))

            ) : (

              <p className="text-slate-500">
                No skills added yet.
              </p>

            )}

          </div>

        </section>

        {/* ==================================================
            RECOMMENDED PRIORITIES
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <BookOpen
              className="text-blue-500"
              size={22}
            />

            <div>

              <h2 className="text-xl font-semibold">
                Recommended Priorities
              </h2>

              <p className="text-sm text-slate-400">
                Focus on these skills to improve your career readiness.
              </p>

            </div>

          </div>

          {missingSkills.length === 0 ? (

            <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20">

              <p className="text-green-400 font-semibold">
                Excellent! You have all the major skills required for this role.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {[
                ...criticalMissing,
                ...importantMissing,
                ...recommendedMissing,
              ].map((skill, index) => (

                <div
                  key={skill.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800"
                >

                  <span className="text-blue-500 font-bold text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">

                    <p className="font-semibold">
                      {skill.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Market demand: {skill.demand}%
                    </p>

                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      skill.importance === "Critical"
                        ? "bg-red-500/10 text-red-400"
                        : skill.importance === "Important"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {skill.importance}
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ==================================================
            BACKEND RECOMMENDATIONS
        ================================================== */}

        {analytics &&
          backendRecommendedSkills.length > 0 && (

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <Target
                className="text-blue-500"
                size={22}
              />

              <div>

                <h2 className="text-xl font-semibold">
                  AI-Recommended Skills
                </h2>

                <p className="text-sm text-slate-400">
                  Top skills selected by the CareerLens analytics engine.
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-4">

              {backendRecommendedSkills.map(
                (skill, index) => (

                  <div
                    key={skill}
                    className="p-5 rounded-xl bg-slate-950 border border-blue-500/20"
                  >

                    <span className="text-xs text-blue-400 font-semibold">
                      PRIORITY {index + 1}
                    </span>

                    <h3 className="font-semibold text-lg mt-2">
                      {skill}
                    </h3>

                    <p className="text-xs text-slate-500 mt-2">
                      Recommended based on your skill gap and market demand.
                    </p>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* ==================================================
            ROADMAP CTA
        ================================================== */}

        <section className="bg-blue-600 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <h2 className="text-2xl font-bold">
                Ready to close your skill gaps?
              </h2>

              <p className="mt-2 text-blue-100">
                Follow a personalized learning roadmap based on your career goal.
              </p>

            </div>

            <button
              onClick={onRoadmap}
              className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition whitespace-nowrap"
            >
              Generate My Roadmap →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  icon,
  title,
  value,
  description,
  type,
}) {
  const styles = {
    success: {
      icon: "bg-green-500/10 text-green-400",
      border: "border-green-500/20",
    },

    warning: {
      icon: "bg-yellow-500/10 text-yellow-400",
      border: "border-yellow-500/20",
    },

    danger: {
      icon: "bg-red-500/10 text-red-400",
      border: "border-red-500/20",
    },
  };

  const currentStyle =
    styles[type] || styles.success;

  return (
    <div
      className={`bg-slate-900 border ${currentStyle.border} rounded-2xl p-6`}
    >

      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentStyle.icon}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-slate-400 text-sm">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

      <p className="text-xs text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );
}

export default SkillGap;