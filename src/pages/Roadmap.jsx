import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";

import { getCareer } from "../data/careers";

import { getProfileAnalytics } from "../services/api";

// ============================================================
// MAIN COMPONENT
// ============================================================

function Roadmap({
  profileData,
  profileId,
  onBack,
}) {
  const targetCareer =
    profileData?.targetCareer ||
    "Data Scientist";

  // ============================================================
  // GET CENTRALIZED CAREER DATA
  // ============================================================

  const career = getCareer(targetCareer);

  const careerSkills =
    career.skills || [];

  // ============================================================
  // ANALYTICS STATE
  // ============================================================

  const [analytics, setAnalytics] =
    useState(null);

  const [loadingAnalytics, setLoadingAnalytics] =
    useState(false);

  const [analyticsError, setAnalyticsError] =
    useState("");

  // ============================================================
  // COMPLETED TASKS
  // ============================================================

  const [completedTasks, setCompletedTasks] =
    useState([]);

  // ============================================================
  // LOAD BACKEND ANALYTICS
  // ============================================================

  useEffect(() => {
    async function loadAnalytics() {
      if (!profileId) {
        setAnalytics(null);
        return;
      }

      try {
        setLoadingAnalytics(true);
        setAnalyticsError("");

        const response =
          await getProfileAnalytics(
            profileId
          );

        if (response.success) {
          setAnalytics(
            response.analytics
          );
        } else {
          setAnalyticsError(
            response.message ||
              "Unable to load career analytics."
          );
        }
      } catch (error) {
        console.error(
          "Roadmap analytics error:",
          error
        );

        setAnalyticsError(
          "Unable to connect to analytics service."
        );
      } finally {
        setLoadingAnalytics(false);
      }
    }

    loadAnalytics();
  }, [profileId]);

  // ============================================================
  // BUILD PERSONALIZED SKILL LIST
  // ============================================================

  /*
    Priority order:

    1. Backend recommended skills
    2. Backend missing skills
    3. Remaining career skills

    This means the roadmap is based on what
    the candidate actually needs.
  */

  const missingSkills =
    analytics?.missingSkills || [];

  const recommendedSkills =
    analytics?.recommendedSkills || [];

  // Remove duplicates while maintaining order.
  const personalizedSkills = [
    ...recommendedSkills,
    ...missingSkills,
    ...careerSkills.map(
      (skill) => skill.name
    ),
  ].filter(
    (skill, index, array) =>
      array.indexOf(skill) === index
  );

  // ============================================================
  // BUILD ROADMAP
  // ============================================================

  const skillFoundation =
    personalizedSkills.slice(0, 3);

  const skillMastery =
    personalizedSkills.slice(3, 6);

  const remainingSkills =
    personalizedSkills.slice(6);

  const roadmap = [
    {
      title: "Close Your Skill Gaps",
      duration: "4–6 weeks",
      skills:
        skillFoundation.length > 0
          ? [
              ...skillFoundation,
              "Programming Fundamentals",
            ]
          : [
              "Programming Fundamentals",
              "Core Career Concepts",
              "Technical Fundamentals",
            ],
    },

    {
      title: `Master ${targetCareer} Skills`,
      duration: "6–8 weeks",
      skills:
        skillMastery.length > 0
          ? [
              ...skillMastery,
              "Practical Applications",
              "Industry Best Practices",
            ]
          : [
              ...careerSkills
                .slice(3, 6)
                .map(
                  (skill) => skill.name
                ),
              "Practical Applications",
              "Industry Best Practices",
            ],
    },

    {
      title: "Build Real Projects",
      duration: "4–6 weeks",
      skills: [
        `${targetCareer} Project`,
        "Real-World Case Study",
        "Portfolio Project",
        ...(remainingSkills.length > 0
          ? remainingSkills.slice(0, 1)
          : ["End-to-End Project"]),
      ],
    },

    {
      title: "Become Job Ready",
      duration: "3–4 weeks",
      skills: [
        "Resume Optimization",
        "GitHub Portfolio",
        "Technical Interviews",
        "Mock Interviews",
      ],
    },
  ];

  // ============================================================
  // TOTAL TASKS
  // ============================================================

  const totalTasks =
    roadmap.reduce(
      (total, stage) =>
        total + stage.skills.length,
      0
    );

  // ============================================================
  // TOGGLE TASK
  // ============================================================

  function toggleTask(task) {
    setCompletedTasks(
      (previous) => {
        if (
          previous.includes(task)
        ) {
          return previous.filter(
            (item) => item !== task
          );
        }

        return [
          ...previous,
          task,
        ];
      }
    );
  }

  // ============================================================
  // PROGRESS
  // ============================================================

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks.length /
            totalTasks) *
            100
        );

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
            Back to Skill Gap
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

        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Target size={25} />
            </div>

            <div>

              <p className="text-blue-400 text-sm font-semibold uppercase">
                Personalized Career Roadmap
              </p>

              <h1 className="text-3xl font-bold">
                Become a {targetCareer}
              </h1>

            </div>

          </div>

          <p className="mt-4 text-slate-400">
            Follow a personalized step-by-step roadmap generated from your current skills and career gaps.
          </p>

        </div>

        {/* ==================================================
            PERSONALIZATION STATUS
        ================================================== */}

        {loadingAnalytics && (
          <div className="mb-8 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">

            <div className="flex items-center gap-3">

              <Sparkles
                size={20}
                className="text-blue-400"
              />

              <div>

                <p className="font-semibold text-blue-400">
                  Personalizing your roadmap...
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Analyzing your skill gaps and career requirements.
                </p>

              </div>

            </div>

          </div>
        )}

        {analyticsError && (
          <div className="mb-8 p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">

            <p className="text-yellow-400 font-semibold">
              Using career-based roadmap
            </p>

            <p className="text-sm text-yellow-500/70 mt-1">
              {analyticsError}
            </p>

          </div>
        )}

        {/* ==================================================
            PERSONALIZATION SUMMARY
        ================================================== */}

        {analytics && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <Sparkles
                className="text-blue-400"
                size={22}
              />

              <div>

                <h2 className="font-semibold text-lg">
                  Your Personalized Plan
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  This roadmap is generated using your CareerLens analytics.
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-4">

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">

                <p className="text-xs text-slate-500">
                  Current Readiness
                </p>

                <p className="text-2xl font-bold text-blue-400 mt-2">
                  {analytics.readinessScore}%
                </p>

              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">

                <p className="text-xs text-slate-500">
                  Skills to Improve
                </p>

                <p className="text-2xl font-bold text-red-400 mt-2">
                  {analytics.totalMissingSkills}
                </p>

              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">

                <p className="text-xs text-slate-500">
                  Recommended First
                </p>

                <p className="text-lg font-semibold text-green-400 mt-2">
                  {analytics.recommendedSkills?.[0] ||
                    "Core Skills"}
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ==================================================
            OVERVIEW CARDS
        ================================================== */}

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <OverviewCard
            icon={<Target />}
            title="Career Goal"
            value={targetCareer}
          />

          <OverviewCard
            icon={<Clock />}
            title="Estimated Time"
            value="4–6 Months"
          />

          <OverviewCard
            icon={<BookOpen />}
            title="Learning Stages"
            value={`${roadmap.length} Stages`}
          />

          <OverviewCard
            icon={<Trophy />}
            title="Roadmap Progress"
            value={`${progress}%`}
          />

        </div>

        {/* ==================================================
            CAREER SKILLS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="font-semibold">
                Core Skills for {targetCareer}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your roadmap prioritizes the skills you are currently missing.
              </p>

            </div>

            <Target
              className="text-blue-500"
              size={22}
            />

          </div>

          <div className="flex flex-wrap gap-3">

            {careerSkills.map(
              (skill) => {

                const isMissing =
                  missingSkills.some(
                    (missing) =>
                      missing.toLowerCase() ===
                      skill.name.toLowerCase()
                  );

                return (
                  <span
                    key={skill.name}
                    className={`px-4 py-2 rounded-lg border ${
                      isMissing
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    }`}
                  >
                    {isMissing
                      ? `Learn: ${skill.name}`
                      : `✓ ${skill.name}`}
                  </span>
                );
              }
            )}

          </div>

        </section>

        {/* ==================================================
            PROGRESS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="flex justify-between items-center mb-3">

            <div>

              <h2 className="font-semibold">
                Your Roadmap Progress
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {completedTasks.length} of{" "}
                {totalTasks} tasks completed
              </p>

            </div>

            <span className="text-2xl font-bold text-blue-500">
              {progress}%
            </span>

          </div>

          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* ==================================================
            ROADMAP STAGES
        ================================================== */}

        <div className="space-y-6">

          {roadmap.map(
            (stage, stageIndex) => {

              const completedInStage =
                stage.skills.filter(
                  (skill) =>
                    completedTasks.includes(
                      skill
                    )
                ).length;

              const stageCompleted =
                completedInStage ===
                stage.skills.length;

              return (

                <section
                  key={stage.title}
                  className={`bg-slate-900 border rounded-2xl p-7 transition ${
                    stageCompleted
                      ? "border-green-500/30"
                      : "border-slate-800"
                  }`}
                >

                  {/* STAGE HEADER */}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                          stageCompleted
                            ? "bg-green-500/10 text-green-400"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >

                        {stageCompleted ? (
                          <CheckCircle2
                            size={25}
                          />
                        ) : (
                          String(
                            stageIndex + 1
                          ).padStart(
                            2,
                            "0"
                          )
                        )}

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Stage{" "}
                          {stageIndex + 1}
                        </p>

                        <h2 className="text-xl font-bold">
                          {stage.title}
                        </h2>

                      </div>

                    </div>

                    <div className="flex items-center gap-4">

                      <span className="flex items-center gap-2 text-sm text-slate-400">

                        <Clock
                          size={16}
                        />

                        {stage.duration}

                      </span>

                      <span className="text-sm text-slate-500">
                        {completedInStage}/
                        {stage.skills.length}
                      </span>

                    </div>

                  </div>

                  {/* SKILLS */}

                  <div className="grid md:grid-cols-2 gap-3">

                    {stage.skills.map(
                      (skill) => {

                        const completed =
                          completedTasks.includes(
                            skill
                          );

                        return (

                          <button
                            key={skill}
                            type="button"
                            onClick={() =>
                              toggleTask(
                                skill
                              )
                            }
                            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                              completed
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-slate-950 border-slate-800 hover:border-blue-500/40"
                            }`}
                          >

                            {completed ? (

                              <CheckCircle2
                                className="text-green-400 shrink-0"
                                size={20}
                              />

                            ) : (

                              <Circle
                                className="text-slate-600 shrink-0"
                                size={20}
                              />

                            )}

                            <span
                              className={
                                completed
                                  ? "text-green-400 line-through"
                                  : "text-slate-200"
                              }
                            >
                              {skill}
                            </span>

                          </button>

                        );

                      }
                    )}

                  </div>

                </section>

              );

            }
          )}

        </div>

        {/* ==================================================
            COMPLETION
        ================================================== */}

        {progress === 100 && (

          <section className="mt-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">

            <Trophy
              className="mx-auto text-green-400"
              size={42}
            />

            <h2 className="mt-4 text-2xl font-bold">
              Congratulations! 🎉
            </h2>

            <p className="mt-2 text-slate-400">
              You have completed your{" "}
              {targetCareer} roadmap.
            </p>

            <p className="mt-4 text-green-400 font-semibold">
              You are ready to start applying for opportunities.
            </p>

          </section>

        )}

      </main>

    </div>
  );
}

// ============================================================
// OVERVIEW CARD
// ============================================================

function OverviewCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 font-semibold text-lg">
        {value}
      </p>

    </div>
  );
}

export default Roadmap;