import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  calculateSkillMatch,
  hasMatchingSkill,
} from "../data/skills";

import {
  getJobs,
  getJobLocations,
  getJobTypes,
  getProfileAnalytics,
} from "../services/api";

// ============================================================
// JOBS PAGE
// ============================================================

function Jobs({
  role,
  profileData,
  profileId,
  onBack,
  onJobDetails,
}) {
  // ============================================================
  // FILTER STATE
  // ============================================================

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");

  // ============================================================
  // API DATA STATE
  // ============================================================

  const [jobsData, setJobsData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // CAREER ANALYTICS
  // ============================================================

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] =
    useState(false);

  // ============================================================
  // SELECTED CAREER
  // ============================================================

  const selectedRole =
    role || "Data Scientist";

  // ============================================================
  // USER SKILLS
  // ============================================================

  const userSkills =
    profileData?.skills || [];

  // ============================================================
  // LOAD JOB DATA
  // ============================================================

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        setError("");

        const [
          jobsResponse,
          locationsResponse,
          typesResponse,
        ] = await Promise.all([
          getJobs(),
          getJobLocations(),
          getJobTypes(),
        ]);

        setJobsData(
          jobsResponse.jobs || []
        );

        setLocations(
          locationsResponse.locations || []
        );

        setJobTypes(
          typesResponse.types || []
        );
      } catch (err) {
        console.error(
          "Jobs API error:",
          err
        );

        setError(
          "Unable to connect to CareerLens backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  // ============================================================
  // LOAD PROFILE ANALYTICS
  // ============================================================

  useEffect(() => {
    async function loadAnalytics() {
      if (!profileId) {
        setAnalytics(null);
        return;
      }

      try {
        setAnalyticsLoading(true);

        const response =
          await getProfileAnalytics(profileId);

        if (response.success) {
          setAnalytics(response.analytics);
        } else {
          setAnalytics(null);
        }
      } catch (err) {
        console.error(
          "Job recommendation analytics error:",
          err
        );

        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    }

    loadAnalytics();
  }, [profileId]);

  // ============================================================
  // PERSONALIZED JOB MATCHING
  // ============================================================

  const filteredJobs = useMemo(() => {
    // ----------------------------------------------------------
    // TARGET CAREER JOBS
    // ----------------------------------------------------------

    const careerJobs =
      jobsData.filter(
        (job) =>
          job.role === selectedRole
      );

    // ----------------------------------------------------------
    // BACKEND RECOMMENDED SKILLS
    // ----------------------------------------------------------

    const recommendedSkills =
      analytics?.recommendedSkills || [];

    // ----------------------------------------------------------
    // CALCULATE MATCH + RECOMMENDATION SCORE
    // ----------------------------------------------------------

    const jobsWithMatch =
      careerJobs.map((job) => {

        const match =
          calculateSkillMatch(
            userSkills,
            job.skills
          );

        // Check recommended skills using
        // the project's skill alias system.
        const prioritySkillMatches =
          job.skills.filter(
            (jobSkill) =>
              recommendedSkills.some(
                (recommendedSkill) =>
                  hasMatchingSkill(
                    recommendedSkill,
                    jobSkill
                  )
              )
          ).length;

        /*
          Recommendation score:

          Normal skill match = 0–100

          Each recommended skill appearing
          in the job gives an additional boost.

          Maximum is capped at 100.
        */

        const recommendationScore =
          Math.min(
            100,
            match.percentage +
              prioritySkillMatches * 2
          );

        return {
          ...job,

          percentage:
            match.percentage,

          matchedSkills:
            match.matchedSkills,

          missingSkills:
            match.missingSkills,

          prioritySkillMatches,

          recommendationScore,
        };
      });

    // ----------------------------------------------------------
    // SEARCH + FILTERS
    // ----------------------------------------------------------

    const filtered =
      jobsWithMatch.filter((job) => {

        const searchText =
          search
            .toLowerCase()
            .trim();

        const matchesSearch =
          searchText === "" ||
          job.title
            .toLowerCase()
            .includes(searchText) ||
          job.company
            .toLowerCase()
            .includes(searchText) ||
          job.skills.some((skill) =>
            skill
              .toLowerCase()
              .includes(searchText)
          );

        const matchesLocation =
          location === "All" ||
          job.location === location;

        const matchesType =
          jobType === "All" ||
          job.type === jobType;

        return (
          matchesSearch &&
          matchesLocation &&
          matchesType
        );
      });

    // ----------------------------------------------------------
    // PERSONALIZED RANKING
    // ----------------------------------------------------------

    return [...filtered].sort(
      (a, b) => {

        // First compare recommendation score
        if (
          b.recommendationScore !==
          a.recommendationScore
        ) {
          return (
            b.recommendationScore -
            a.recommendationScore
          );
        }

        // If scores are equal,
        // prefer more direct skill matches.
        return (
          b.percentage -
          a.percentage
        );
      }
    );

  }, [
    jobsData,
    selectedRole,
    userSkills,
    search,
    location,
    jobType,
    analytics,
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center">

            <Briefcase
              className="text-blue-400"
              size={25}
            />

          </div>

          <h2 className="mt-5 text-xl font-semibold">
            Loading recommended jobs...
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Connecting to CareerLens API
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

        <div className="max-w-md text-center">

          <div className="w-14 h-14 mx-auto rounded-xl bg-red-500/10 flex items-center justify-center">

            <Briefcase
              className="text-red-400"
              size={28}
            />

          </div>

          <h2 className="mt-5 text-xl font-semibold">
            Backend Connection Failed
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-800 bg-slate-950/90">

        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-400">
              CareerLens
            </p>

            <h1 className="text-2xl font-bold">
              Recommended Jobs
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              AI-powered opportunities matched to your skills
            </p>

          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* ==================================================
            CAREER SUMMARY
        ================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-500/10 p-3">

                <Briefcase
                  className="text-blue-400"
                  size={24}
                />

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Target Career
                </p>

                <h2 className="text-xl font-bold">
                  {selectedRole}
                </h2>

              </div>

            </div>

            <div className="text-sm text-slate-400">
              Jobs are ranked using your skill compatibility.
            </div>

          </div>

        </div>

        {/* ==================================================
            PERSONALIZED INSIGHT
        ================================================== */}

        {analytics && (
          <section className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-blue-500/10 p-3 shrink-0">

                  <Sparkles
                    className="text-blue-400"
                    size={25}
                  />

                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h2 className="text-lg font-semibold">
                      Personalized Job Recommendations
                    </h2>

                    {analyticsLoading && (
                      <span className="text-xs text-slate-500">
                        Updating...
                      </span>
                    )}

                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">

                    CareerLens calculated a{" "}

                    <span className="font-semibold text-blue-400">
                      {analytics.readinessScore}%
                    </span>{" "}

                    readiness score for{" "}

                    <span className="font-semibold text-slate-200">
                      {selectedRole}
                    </span>
                    .

                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Jobs are prioritized using your current
                    skills and CareerLens recommended skills.
                  </p>

                </div>

              </div>

              {/* READINESS */}

              <div className="min-w-[180px] rounded-xl bg-slate-950 border border-slate-800 px-5 py-4">

                <div className="flex items-center gap-2">

                  <Target
                    size={16}
                    className="text-blue-400"
                  />

                  <p className="text-xs text-slate-500">
                    Career Readiness
                  </p>

                </div>

                <p className="mt-1 text-3xl font-bold text-blue-400">
                  {analytics.readinessScore}%
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {analytics.readinessLevel}
                </p>

              </div>

            </div>

            {/* RECOMMENDED SKILLS */}

            {analytics.recommendedSkills?.length > 0 && (

              <div className="mt-6 pt-5 border-t border-slate-800">

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={17}
                    className="text-emerald-400"
                  />

                  <p className="text-sm font-medium text-slate-300">
                    Skills that can improve your opportunities
                  </p>

                </div>

                <div className="flex flex-wrap gap-2 mt-3">

                  {analytics.recommendedSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
                      >
                        + {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            )}

          </section>
        )}

        {/* ==================================================
            PROFILE WARNING
        ================================================== */}

        {!profileId && (

          <div className="mb-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

            <div className="flex items-start gap-3">

              <Target
                size={20}
                className="text-yellow-400 shrink-0"
              />

              <div>

                <p className="font-semibold text-yellow-400">
                  Complete your profile for personalized recommendations
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Jobs are currently ranked using your available
                  skills. Save your profile to unlock CareerLens
                  career analytics.
                </p>

              </div>

            </div>

          </div>

        )}

        {/* ==================================================
            SEARCH + FILTERS
        ================================================== */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />

          </div>

          {/* LOCATION */}

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >

            <option value="All">
              All Locations
            </option>

            {locations.map((item) => (

              <option
                key={item}
                value={item}
              >
                {item}
              </option>

            ))}

          </select>

          {/* JOB TYPE */}

          <select
            value={jobType}
            onChange={(e) =>
              setJobType(e.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >

            <option value="All">
              All Job Types
            </option>

            {jobTypes.map((type) => (

              <option
                key={type}
                value={type}
              >
                {type}
              </option>

            ))}

          </select>

        </div>

        {/* ==================================================
            RESULT COUNT
        ================================================== */}

        <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">

          <Filter size={17} />

          Showing{" "}
          {filteredJobs.length}{" "}
          matching opportunities

        </div>

        {/* ==================================================
            JOB CARDS
        ================================================== */}

        {filteredJobs.length > 0 ? (

          <div className="grid gap-5 md:grid-cols-2">

            {filteredJobs.map((job) => {

              const hasRecommendedSkill =
                analytics?.recommendedSkills?.some(
                  (recommendedSkill) =>
                    job.skills.some(
                      (jobSkill) =>
                        hasMatchingSkill(
                          recommendedSkill,
                          jobSkill
                        )
                    )
                );

              return (

                <div
                  key={job.id}
                  className={`rounded-2xl border bg-slate-900 p-6 transition hover:-translate-y-1 ${
                    hasRecommendedSkill
                      ? "border-emerald-500/30"
                      : "border-slate-800"
                  }`}
                >

                  {/* JOB HEADER */}

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {job.company}
                      </p>

                    </div>

                    <div className="rounded-xl bg-blue-500/10 p-2">

                      <Briefcase
                        size={20}
                        className="text-blue-400"
                      />

                    </div>

                  </div>

                  {/* RECOMMENDED BADGE */}

                  {hasRecommendedSkill && (

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5">

                      <Sparkles
                        size={13}
                        className="text-emerald-400"
                      />

                      <span className="text-xs font-medium text-emerald-400">
                        Recommended for you
                      </span>

                    </div>

                  )}

                  {/* ==================================================
                      SKILL MATCH
                  ================================================== */}

                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <div className="flex items-center justify-between mb-3">

                      <div>

                        <p className="text-sm text-slate-400">
                          Skill Match
                        </p>

                        <p className="text-2xl font-bold text-blue-400">
                          {job.percentage}%
                        </p>

                      </div>

                      <div className="text-right">

                        {job.percentage >= 80 ? (

                          <span className="text-xs text-emerald-400">
                            Strong Match
                          </span>

                        ) : job.percentage >= 50 ? (

                          <span className="text-xs text-yellow-400">
                            Good Match
                          </span>

                        ) : (

                          <span className="text-xs text-red-400">
                            Skill Gap
                          </span>

                        )}

                      </div>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${job.percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      JOB DETAILS
                  ================================================== */}

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                    <div className="flex items-center gap-2 text-slate-300">

                      <MapPin
                        size={16}
                        className="text-slate-500"
                      />

                      {job.location}

                    </div>

                    <div className="text-slate-300">
                      💰 {job.salary}
                    </div>

                    <div className="text-slate-400">
                      Experience: {job.experience}
                    </div>

                    <div className="text-slate-400">
                      Type: {job.type}
                    </div>

                  </div>

                  {/* ==================================================
                      REQUIRED SKILLS
                  ================================================== */}

                  <div className="mt-5">

                    <p className="mb-3 text-sm font-medium text-slate-300">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {job.skills.map((skill) => {

                        const matched =
                          job.matchedSkills.includes(
                            skill
                          );

                        return (

                          <span
                            key={skill}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                              matched
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >

                            {matched ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <Circle size={13} />
                            )}

                            {skill}

                          </span>

                        );

                      })}

                    </div>

                  </div>

                  {/* ==================================================
                      MISSING SKILLS
                  ================================================== */}

                  {job.missingSkills.length > 0 && (

                    <div className="mt-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-3">

                      <p className="text-xs text-yellow-400">
                        Improve these skills to increase your match:
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {job.missingSkills.join(", ")}
                      </p>

                    </div>

                  )}

                  {/* ==================================================
                      WHY RECOMMENDED
                  ================================================== */}

                  {job.prioritySkillMatches > 0 && (

                    <div className="mt-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">

                      <p className="text-xs text-emerald-400">
                        Why CareerLens recommends this
                      </p>

                      <p className="mt-1 text-xs text-slate-400">

                        This job contains{" "}
                        <span className="font-semibold text-emerald-400">
                          {job.prioritySkillMatches}
                        </span>{" "}
                        skill
                        {job.prioritySkillMatches > 1
                          ? "s"
                          : ""}{" "}
                        from your personalized development recommendations.

                      </p>

                    </div>

                  )}

                  {/* ==================================================
                      APPLY BUTTON
                  ================================================== */}

                  <button
                    onClick={() =>
                      onJobDetails(job)
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold transition hover:bg-blue-500"
                  >

                    Apply Now

                    <ExternalLink
                      size={17}
                    />

                  </button>

                </div>

              );
            })}

          </div>

        ) : (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <Briefcase
              size={40}
              className="mx-auto text-slate-600"
            />

            <h3 className="mt-4 text-lg font-semibold">
              No matching jobs found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Jobs;