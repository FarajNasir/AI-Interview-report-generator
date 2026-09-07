const pdfParse = require("pdf-parse");

const interViewReportModel = require("../models/interViewReport.model");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")

async function generateInterviewReportController(req, res) {

  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();

  const { selfDescription, jobDescription } = req.body;

  const generateReportbyAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });


  const interviewReport = await interViewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...generateReportbyAi,
  });

  res.status(201).json({
    message: "interview report generated successfully",
    interviewReport,
  });
}


async function getInterviewReportById(req, res) {
  try {
    const { interviewId } = req.params;
    
    // Check if the provided ID is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    const interviewReport = await interViewReportModel.findOne({
      _id: interviewId,
      user: req.user.id
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "unable to fetch report"
      });
    }

    res.status(200).json({
      message: "Interview report fetch successfully ",
      interviewReport
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllInterviewReport(req, res) {
  const interviewReports = await interViewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

  res.status(200).json({
    message: "Interview report fetch successfully ",
    interviewReports
  })

}


async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interViewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}
module.exports = { generateInterviewReportController, getInterviewReportById, getAllInterviewReport,generateResumePdfController };