import React, { useEffect, useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, UserCircle, Target, DownloadCloud } from "lucide-react";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");

  const { report, loading, error, getreportById, getResumePdf } = useInterview();

  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getreportById(interviewId);
    }
  }, [interviewId]);

  // Loading
  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview report...</h1>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="error-screen">
        <h1>{error}</h1>

        <p>
          Unable to load this report. Please return to the dashboard and try
          again.
        </p>

        <button onClick={() => navigate("/")}>
          Go Back
        </button>
      </main>
    );
  }

  // Report not available
  if (!report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview report...</h1>
      </main>
    );
  }

  return (
    <motion.div 
      className="interview-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* HEADER */}
      <motion.header 
        className="interview-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >

        <div className="header-info">
          <h1>{report.title}</h1>

          <p>
            AI Generated Interview Report & Preparation Plan
          </p>

        </div>

        <div className="header-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="download-resume-button"
            type="button"
            onClick={() => getResumePdf(report._id)}
            disabled={loading}
          >
            <DownloadCloud size={18} />
            {loading ? "Preparing Resume..." : "Download Resume"}
          </motion.button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="score-badge"
            style={{
              "--score": `${report.matchScore}%`,
            }}
          >
            <div className="score-value">
              {report.matchScore}
              <span>%</span>
            </div>
          </motion.div>
        </div>

      </motion.header>


      {/* MAIN GRID */}
      <div className="interview-grid">

        {/* LEFT COLUMN */}
        <motion.div 
          className="details-column"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >

          {/* JOB DESCRIPTION */}
          <div className="card">
            <h2><Briefcase size={20} className="card-icon" /> Job Description</h2>

            <p>
              {report.jobDescription}
            </p>
          </div>


          {/* RESUME */}
          <div className="card">
            <h2><FileText size={20} className="card-icon" /> Resume Summary</h2>

            <p>
              {report.resume}
            </p>
          </div>


          {/* SELF DESCRIPTION */}
          <div className="card">
            <h2><UserCircle size={20} className="card-icon" /> Self Description</h2>

            <p>
              {report.selfDescription}
            </p>
          </div>


          {/* SKILL GAPS */}
          <div className="card">
            <h2><Target size={20} className="card-icon" /> Skill Gaps</h2>

            <div className="skill-gaps">

              {report.skillGaps?.map((gap, index) => (
                <div
                  key={index}
                  className="skill-badge"
                >

                  <span className="skill-name">
                    {gap.skill}
                  </span>

                  <span
                    className={`severity ${gap.severity}`}
                  >
                    {gap.severity}
                  </span>

                </div>
              ))}

            </div>
          </div>

        </motion.div>


        {/* RIGHT COLUMN */}
        <div className="content-column">

          <div className="card">

            {/* TABS */}
            <div className="tabs-container">

              <button
                className={
                  activeTab === "technical"
                    ? "active"
                    : ""
                }
                onClick={() => setActiveTab("technical")}
              >
                Technical Q&A
              </button>


              <button
                className={
                  activeTab === "behavioral"
                    ? "active"
                    : ""
                }
                onClick={() => setActiveTab("behavioral")}
              >
                Behavioral Q&A
              </button>


              <button
                className={
                  activeTab === "plan"
                    ? "active"
                    : ""
                }
                onClick={() => setActiveTab("plan")}
              >
                Preparation Plan
              </button>

            </div>


            {/* TAB CONTENT */}
            <div className="tab-content">
              <AnimatePresence mode="wait">

                {/* TECHNICAL QUESTIONS */}
                {activeTab === "technical" && (
                  <motion.div 
                    key="tech"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="questions-list"
                  >

                  {report.technicalQuestions?.map(
                    (q, i) => (
                      <div
                        key={i}
                        className="question-item"
                      >

                        <div className="question-header">
                          Q: {q.question}
                        </div>

                        <div className="question-intention">
                          Intention: {q.intention}
                        </div>

                        <div className="question-answer">
                          <strong>
                            Ideal Answer:
                          </strong>{" "}
                          {q.answer}
                        </div>

                      </div>
                    )
                  )}

                  </motion.div>
                )}


                {/* BEHAVIORAL QUESTIONS */}
                {activeTab === "behavioral" && (
                  <motion.div 
                    key="behav"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="questions-list"
                  >

                  {report.behavioralQuestions?.map(
                    (q, i) => (
                      <div
                        key={i}
                        className="question-item"
                      >

                        <div className="question-header">
                          Q: {q.question}
                        </div>

                        <div className="question-intention">
                          Intention: {q.intention}
                        </div>

                        <div className="question-answer">
                          <strong>
                            Ideal Answer:
                          </strong>{" "}
                          {q.answer}
                        </div>

                      </div>
                    )
                  )}

                  </motion.div>
                )}


                {/* PREPARATION PLAN */}
                {activeTab === "plan" && (
                  <motion.div 
                    key="plan"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="timeline"
                  >

                  {report.preparationPlan?.map(
                    (plan, i) => (
                      <div
                        key={i}
                        className="timeline-item"
                      >

                        <div className="day-badge">
                          Day {plan.day}
                        </div>

                        <div className="focus-area">
                          {plan.focus}
                        </div>

                        <ul className="tasks-list">

                          {plan.tasks?.map(
                            (task, idx) => (
                              <li key={idx}>
                                {task}
                              </li>
                            )
                          )}

                        </ul>

                      </div>
                    )
                  )}

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
};

export default Interview;