import {
  ArrowLeft,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Circle,
  ExternalLink,
  Building2,
} from "lucide-react";

function JobDetails({ job, matchPercentage, matchedSkills, missingSkills, onBack }) {
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-950/95">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back to Jobs
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Job Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <Building2 className="text-blue-400" size={25} />
                </div>

                <div>
                  <p className="text-slate-400 text-sm">{job.company}</p>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {job.title}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-300 mt-5">
                <span className="flex items-center gap-2">
                  <MapPin size={17} />
                  {job.location}
                </span>

                <span className="flex items-center gap-2">
                  <IndianRupee size={17} />
                  {job.salary}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {job.experience}
                </span>

                <span className="flex items-center gap-2">
                  <Briefcase size={17} />
                  {job.type}
                </span>
              </div>
            </div>

            {/* Match Score */}
            <div className="min-w-[180px] bg-slate-800 rounded-xl p-5 text-center">
              <p className="text-sm text-slate-400 mb-2">
                Your Skill Match
              </p>

              <div className="text-4xl font-bold text-green-400">
                {matchPercentage}%
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                {matchPercentage >= 80
                  ? "Excellent Match"
                  : matchPercentage >= 60
                  ? "Good Match"
                  : "Skills Gap"}
              </p>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* About Job */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                About the Job
              </h2>

              <p className="text-slate-300 leading-7">
                This role is a great opportunity to work on real-world
                projects and develop your professional skills. You will
                collaborate with experienced professionals and contribute
                to meaningful projects in a technology-driven environment.
              </p>

              <h3 className="font-semibold mt-6 mb-3">
                What you will work on
              </h3>

              <ul className="space-y-3 text-slate-300">
                <li>• Develop and maintain projects related to {job.title}.</li>
                <li>• Work with team members to solve technical problems.</li>
                <li>• Analyze requirements and implement effective solutions.</li>
                <li>• Learn and apply modern industry practices.</li>
              </ul>
            </section>

            {/* Required Skills */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-5">
                Required Skills
              </h2>

              <div className="space-y-3">
                {job.skills.map((skill) => {
                  const isMatched = matchedSkills.includes(skill);

                  return (
                    <div
                      key={skill}
                      className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3"
                    >
                      <span className="text-slate-200">
                        {skill}
                      </span>

                      {isMatched ? (
                        <span className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle2 size={18} />
                          You have this
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-400 text-sm">
                          <Circle size={18} />
                          Skill gap
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Skills to Improve */}
            {missingSkills.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-3">
                  Skills You Should Improve
                </h2>

                <p className="text-slate-400 mb-5">
                  Improving these skills can increase your chances of
                  qualifying for this role.
                </p>

                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Application Card */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-3">
                Ready to Apply?
              </h2>

              <p className="text-slate-400 text-sm leading-6 mb-6">
                Review your skill match and apply for this position when
                you are ready.
              </p>

              <button
                onClick={() =>
                  alert(
                    `Application started for ${job.title} at ${job.company}`
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold transition"
              >
                Apply Now
                <ExternalLink size={18} />
              </button>

              <p className="text-xs text-slate-500 text-center mt-3">
                Demo application flow
              </p>
            </section>

            {/* Match Summary */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">
                Match Summary
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Matching Skills
                  </span>
                  <span className="text-green-400 font-semibold">
                    {matchedSkills.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Skill Gaps
                  </span>
                  <span className="text-red-400 font-semibold">
                    {missingSkills.length}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-4 flex justify-between">
                  <span className="text-slate-300">
                    Overall Match
                  </span>
                  <span className="text-blue-400 font-bold">
                    {matchPercentage}%
                  </span>
                </div>

              </div>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
}

export default JobDetails;