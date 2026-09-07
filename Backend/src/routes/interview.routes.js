const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRoutes = express.Router()

/**
 * @routes POST api/interview/generateinterviewreport
 * @description it is used to generate interview report based on user input
 * @access private 
 */

interviewRoutes.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @routes GET api/interview/getInterviewreportBiId
 * @description it is used to fetch the report by id from the database 
 * @access private 
 */

interviewRoutes.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportById)

/**
 * @routes GET api/interview/
 * @description it is used to fetch all the report of a user 
 * @access private 
 */

interviewRoutes.get("/",authMiddleware.authUser,interviewController.getAllInterviewReport)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRoutes.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

module.exports = interviewRoutes
