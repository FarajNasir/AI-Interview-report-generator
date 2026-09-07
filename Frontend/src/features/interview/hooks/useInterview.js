import { useContext } from "react";
import { InterviewContext } from "../Interview.context";

import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReport as fetchAllInterviewReports,
  generateResumePdf,
} from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within the InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    error,
    setError,
  } = context;

  // =========================
  // Generate Interview Report
  // =========================
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      console.log("GENERATE RESPONSE:", response);

      // API agar direct report bheje
      // ya interviewReport ke andar report bheje,
      // dono cases handle honge
      const interviewReport = response?.interviewReport || response;

      console.log("ACTUAL INTERVIEW REPORT:", interviewReport);
      console.log("REPORT ID:", interviewReport?._id);

      if (!interviewReport?._id) {
        throw new Error("Interview report ID not found");
      }

      setReport(interviewReport);

      return interviewReport;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to generate interview report";

      setError(message);

      console.error(
        "FAILED TO GENERATE REPORT:",
        error.response?.status,
        error.response?.data || error.message,
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Get Report By ID
  // =========================
  const getreportById = async (interviewId) => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await getInterviewReportById(interviewId);

      console.log("GET REPORT RESPONSE:", response);

      const interviewReport = response?.interviewReport || response;

      console.log("ACTUAL REPORT FROM GET:", interviewReport);

      if (!interviewReport?._id) {
        throw new Error("Interview report not found");
      }

      setReport(interviewReport);

      return interviewReport;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to load the interview report";

      setError(message);

      console.error(
        "GET REPORT ERROR:",
        error.response?.status,
        error.response?.data || error.message,
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Get All Reports
  // =========================
  const getAllReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAllInterviewReports();

      //   console.log("ALL REPORTS RESPONSE:", response);

      const interviewReports = response?.interviewReports || response;

      setReports(interviewReports);

      return interviewReports;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to load interview reports";

      setError(message);

      console.error(
        "FAILED TO FETCH ALL REPORTS:",
        error.response?.status,
        error.response?.data || error.message,
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getreportById,
    getAllReport,
    getResumePdf,
    generateResumePdf,
    error,
  };
};
