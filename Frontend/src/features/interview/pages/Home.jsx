import React, { useEffect, useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { UploadCloud, ChevronRight, FileText } from "lucide-react";

const Home = () => {
  const {
    loading,
    generateReport,
    reports,
    getAllReport,
  } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");

  const resumeInputRef = useRef();
  const navigate = useNavigate();

  // Get all previous reports
  useEffect(() => {
    getAllReport();
  }, []);

  // Generate new report
  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];

    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    if (!data?._id) {
      return;
    }

    navigate(`/interview/${data._id}`);
  };

  // Open existing report
  const handleReportClick = (id) => {
    navigate(`/interview/${id}`);
  };

  if (loading) {
    return (
      <main>
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <motion.main 
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* Generate Report Section */}
      <motion.div 
        className="interview-input-group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >

        {/* LEFT */}
        <div className="left">

          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            name="jobDescription"
            id="jobDescription"
            placeholder="Enter the job description here..."
          />

        </div>


        {/* RIGHT */}
        <div className="right">

          {/* Resume */}
          <div className="input-group">

            <label
              className="file-label"
              htmlFor="resume"
            >
              <UploadCloud className="upload-icon" size={42} strokeWidth={1.5} />
              <span>Upload Resume</span>
            </label>

            <input
              ref={resumeInputRef}
              hidden
              type="file"
              name="resume"
              id="resume"
              accept=".pdf"
            />

          </div>


          {/* Self Description */}
          <div className="input-group">

            <label htmlFor="SelfDescription">
              Self Description
            </label>

            <textarea
              value={selfDescription}
              onChange={(e) =>
                setSelfDescription(e.target.value)
              }
              name="selfDescription"
              id="SelfDescription"
              placeholder="Enter the self description here..."
            />

          </div>


          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateReport}
            className="generate-btn"
          >
            Generate Interview Report
          </motion.button>

        </div>

      </motion.div>


      {/* Previous Reports */}
      <motion.div 
        className="previous-reports"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >

        <h2>Previous Interview Reports</h2>

        {reports?.length === 0 && (
          <p>No interview reports generated yet.</p>
        )}

        <div className="reports-list">

          {reports?.map((report, index) => (

            <motion.div
              key={report._id}
              className="report-card"
              onClick={() =>
                handleReportClick(report._id)
              }
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >

              <div className="report-info">

                <h3>
                  <FileText size={18} className="title-icon" />
                  {report.title}
                </h3>

                <p>
                  Match Score:{" "}
                  <strong>
                    {report.matchScore}%
                  </strong>
                </p>

                <p>
                  Created:{" "}
                  {new Date(
                    report.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReportClick(report._id);
                }}
              >
                View Report
                <ChevronRight size={16} />
              </button>

            </motion.div>

          ))}

        </div>

      </motion.div>

    </motion.main>
  );
};

export default Home;