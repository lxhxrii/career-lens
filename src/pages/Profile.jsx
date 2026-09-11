import { useEffect, useState } from "react";

import {
  ArrowLeft,
  User,
  GraduationCap,
  Code2,
  Briefcase,
  Plus,
  X,
  Target,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  createProfile,
  updateProfile,
  getProfile,
} from "../services/api";


function Profile({
  profileData,
  setProfileData,
  onBack,
  onAnalyze,
}) {

  // ============================================================
  // PROFILE ID
  // ============================================================

  const [profileId, setProfileId] = useState(
    () =>
      localStorage.getItem("careerLensProfileId") || ""
  );


  const [saving, setSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");


  // ============================================================
  // LOAD SAVED PROFILE
  // ============================================================

  useEffect(() => {

    async function loadProfile() {

      const savedProfileId =
        localStorage.getItem("careerLensProfileId");


      // No saved profile ID
      if (!savedProfileId) {
        return;
      }


      try {

        const result =
          await getProfile(savedProfileId);


        if (
          result.success &&
          result.profile
        ) {

          setProfileData({

            name:
              result.profile.name || "",

            education:
              result.profile.education ||
              "B.Tech Computer Science",

            college:
              result.profile.college || "",

            targetCareer:
              result.profile.targetCareer ||
              "Data Scientist",

            experience:
              result.profile.experience ||
              "Fresher",

            skills:
              Array.isArray(result.profile.skills)
                ? result.profile.skills
                : [],

          });


          // Make sure the correct ID is stored
          setProfileId(
            String(result.profile.id)
          );

          localStorage.setItem(
            "careerLensProfileId",
            String(result.profile.id)
          );
        }

      } catch (error) {

        console.error(
          "Profile loading error:",
          error
        );


        // ========================================================
        // IMPORTANT:
        // If old profile ID doesn't exist in SQLite,
        // remove it so a new profile can be created.
        // ========================================================

        localStorage.removeItem(
          "careerLensProfileId"
        );

        setProfileId("");

      }

    }


    loadProfile();

  }, [setProfileData]);


  // ============================================================
  // UPDATE FIELD
  // ============================================================

  function updateField(
    field,
    value
  ) {

    setProfileData(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );

  }


  // ============================================================
  // ADD SKILL
  // ============================================================

  function addSkill() {

    const input =
      document.getElementById(
        "newSkill"
      );


    if (!input) {
      return;
    }


    const skill =
      input.value.trim();


    if (!skill) {
      return;
    }


    const alreadyExists =
      profileData.skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      );


    if (alreadyExists) {

      alert(
        "This skill is already added."
      );

      return;
    }


    setProfileData(
      (previous) => ({
        ...previous,

        skills: [
          ...previous.skills,
          skill,
        ],
      })
    );


    input.value = "";

  }


  // ============================================================
  // REMOVE SKILL
  // ============================================================

  function removeSkill(
    skillToRemove
  ) {

    setProfileData(
      (previous) => ({

        ...previous,

        skills:
          previous.skills.filter(
            (skill) =>
              skill !== skillToRemove
          ),

      })
    );

  }


  // ============================================================
  // VALIDATE PROFILE
  // ============================================================

  function validateProfile() {

    if (
      !profileData.name ||
      !profileData.name.trim()
    ) {

      setErrorMessage(
        "Please enter your name."
      );

      return false;
    }


    if (
      !profileData.college ||
      !profileData.college.trim()
    ) {

      setErrorMessage(
        "Please enter your college name."
      );

      return false;
    }


    if (
      !Array.isArray(profileData.skills) ||
      profileData.skills.length === 0
    ) {

      setErrorMessage(
        "Please add at least one skill."
      );

      return false;
    }


    return true;
  }


  // ============================================================
  // CREATE NEW PROFILE
  // ============================================================

  async function createNewProfile() {

    const result =
      await createProfile(
        profileData
      );


    if (
      result.success &&
      result.profile
    ) {

      const newId =
        String(result.profile.id);


      setProfileId(newId);


      localStorage.setItem(
        "careerLensProfileId",
        newId
      );


      return result;

    }


    throw new Error(
      "Profile creation failed"
    );

  }


  // ============================================================
  // SAVE PROFILE
  // ============================================================

  async function saveProfile() {

    setSaveMessage("");

    setErrorMessage("");


    if (!validateProfile()) {
      return;
    }


    setSaving(true);


    try {

      let result;


      // ========================================================
      // IF WE HAVE A PROFILE ID
      // ========================================================

      if (profileId) {

        try {

          // Try updating existing profile
          result =
            await updateProfile(
              profileId,
              profileData
            );

        } catch (updateError) {

          console.log(
            "Existing profile not found."
          );

          console.log(
            "Creating a new profile..."
          );


          // ====================================================
          // OLD ID DOES NOT EXIST
          // CREATE NEW PROFILE
          // ====================================================

          localStorage.removeItem(
            "careerLensProfileId"
          );

          setProfileId("");


          result =
            await createNewProfile();

        }

      }

      // ========================================================
      // NO PROFILE ID
      // CREATE NEW PROFILE
      // ========================================================

      else {

        result =
          await createNewProfile();

      }


      // ========================================================
      // SUCCESS
      // ========================================================

      if (result.success) {

        setSaveMessage(
          "Profile saved successfully!"
        );

      }

    } catch (error) {

      console.error(
        "Profile save error:",
        error
      );


      setErrorMessage(
        "Unable to save profile. Please make sure the backend is running."
      );

    } finally {

      setSaving(false);

    }

  }


  // ============================================================
  // ANALYZE PROFILE
  // ============================================================

  async function analyzeProfile() {

    setSaveMessage("");

    setErrorMessage("");


    if (!validateProfile()) {
      return;
    }


    setSaving(true);


    try {

      let result;


      // ========================================================
      // UPDATE EXISTING PROFILE
      // ========================================================

      if (profileId) {

        try {

          result =
            await updateProfile(
              profileId,
              profileData
            );

        } catch (updateError) {

          console.log(
            "Existing profile not found."
          );

          console.log(
            "Creating a new profile..."
          );


          localStorage.removeItem(
            "careerLensProfileId"
          );

          setProfileId("");


          result =
            await createNewProfile();

        }

      }

      // ========================================================
      // CREATE PROFILE
      // ========================================================

      else {

        result =
          await createNewProfile();

      }


      // ========================================================
      // START ANALYSIS
      // ========================================================

      if (result.success) {

        setSaveMessage(
          "Profile saved. Starting career analysis..."
        );


        setTimeout(() => {

          onAnalyze();

        }, 500);

      }

    } catch (error) {

      console.error(
        "Profile analysis error:",
        error
      );


      setErrorMessage(
        "Unable to connect to the backend. Please make sure the server is running."
      );

    } finally {

      setSaving(false);

    }

  }


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-950 text-white">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-800">

        <div className="max-w-5xl mx-auto px-6 py-5">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >

            <ArrowLeft size={18} />

            Back to Home

          </button>

        </div>

      </div>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="max-w-5xl mx-auto px-6 py-12">


        {/* ====================================================
            TITLE
        ==================================================== */}

        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">

              <User size={25} />

            </div>


            <div>

              <p className="text-blue-400 text-sm font-semibold">
                CAREER PROFILE
              </p>


              <h1 className="text-3xl font-bold">
                Build Your Profile
              </h1>

            </div>

          </div>


          <p className="mt-4 text-slate-400">
            Tell us about yourself so CareerLens can analyze your career readiness.
          </p>

        </div>


        {/* ====================================================
            PERSONAL INFORMATION
        ==================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <User
              className="text-blue-500"
              size={22}
            />

            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

          </div>


          <div className="grid md:grid-cols-2 gap-6">


            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Full Name
              </label>


              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Experience
              </label>


              <select
                value={profileData.experience}
                onChange={(e) =>
                  updateField(
                    "experience",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              >

                <option>Fresher</option>

                <option>0–2 Years</option>

                <option>2–5 Years</option>

                <option>5+ Years</option>

              </select>

            </div>

          </div>

        </section>


        {/* ====================================================
            EDUCATION
        ==================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <GraduationCap
              className="text-blue-500"
              size={22}
            />

            <h2 className="text-xl font-semibold">
              Education
            </h2>

          </div>


          <div className="grid md:grid-cols-2 gap-6">


            <div>

              <label className="block text-sm text-slate-400 mb-2">
                Education
              </label>


              <select
                value={profileData.education}
                onChange={(e) =>
                  updateField(
                    "education",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              >

                <option>
                  B.Tech Computer Science
                </option>

                <option>
                  B.Tech Information Technology
                </option>

                <option>
                  BCA
                </option>

                <option>
                  MCA
                </option>

                <option>
                  M.Tech
                </option>

                <option>
                  Other
                </option>

              </select>

            </div>


            <div>

              <label className="block text-sm text-slate-400 mb-2">
                College / University
              </label>


              <input
                type="text"
                value={profileData.college}
                onChange={(e) =>
                  updateField(
                    "college",
                    e.target.value
                  )
                }
                placeholder="Enter college name"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />

            </div>

          </div>

        </section>


        {/* ====================================================
            SKILLS
        ==================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <Code2
              className="text-blue-500"
              size={22}
            />

            <h2 className="text-xl font-semibold">
              Your Skills
            </h2>

          </div>


          {/* CURRENT SKILLS */}

          <div className="flex flex-wrap gap-3 mb-6">

            {profileData.skills.map(
              (skill) => (

                <div
                  key={skill}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400"
                >

                  <span>
                    {skill}
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      removeSkill(skill)
                    }
                    className="hover:text-red-400 transition"
                  >

                    <X size={15} />

                  </button>

                </div>

              )
            )}

          </div>


          {/* ADD SKILL */}

          <div className="flex gap-3">

            <input
              id="newSkill"
              type="text"
              placeholder="Add a skill e.g. Machine Learning"
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  e.preventDefault();

                  addSkill();

                }

              }}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
            />


            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
            >

              <Plus size={18} />

              Add

            </button>

          </div>

        </section>


        {/* ====================================================
            CAREER GOAL
        ==================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Target
              className="text-blue-500"
              size={22}
            />

            <h2 className="text-xl font-semibold">
              Career Goal
            </h2>

          </div>


          <label className="block text-sm text-slate-400 mb-2">
            Target Career
          </label>


          <select
            value={profileData.targetCareer}
            onChange={(e) =>
              updateField(
                "targetCareer",
                e.target.value
              )
            }
            className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
          >

            <option>
              Data Scientist
            </option>

            <option>
              Data Analyst
            </option>

            <option>
              Software Developer
            </option>

            <option>
              Machine Learning Engineer
            </option>

            <option>
              Cloud Engineer
            </option>

            <option>
              Cybersecurity Analyst
            </option>

          </select>

        </section>


        {/* ====================================================
            SUCCESS MESSAGE
        ==================================================== */}

        {saveMessage && (

          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-4 mb-4">

            <CheckCircle2 size={20} />

            <span>
              {saveMessage}
            </span>

          </div>

        )}


        {/* ====================================================
            ERROR MESSAGE
        ==================================================== */}

        {errorMessage && (

          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 mb-4">

            <AlertCircle size={20} />

            <span>
              {errorMessage}
            </span>

          </div>

        )}


        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 mb-8">

          <div className="flex items-center gap-3">

            <Briefcase
              className="text-blue-400"
              size={22}
            />


            <div>

              <h3 className="font-semibold">
                Ready for your career analysis?
              </h3>


              <p className="text-sm text-slate-400 mt-1">
                CareerLens will compare your skills with the requirements of your target role.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            SAVE PROFILE
        ==================================================== */}

        <button
          type="button"
          onClick={saveProfile}
          disabled={saving}
          className="w-full mb-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >

          <Save size={18} />


          {saving
            ? "Saving..."
            : "Save Profile"}

        </button>


        {/* ====================================================
            ANALYZE PROFILE
        ==================================================== */}

        <button
          type="button"
          onClick={analyzeProfile}
          disabled={saving}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-semibold text-lg transition"
        >

          {saving
            ? "Saving Profile..."
            : "Analyze My Career →"}

        </button>

      </main>

    </div>

  );

}


export default Profile;