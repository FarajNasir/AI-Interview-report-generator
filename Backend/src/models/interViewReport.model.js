/**
 * job description schema : string
 * resume text : string
 * self description: string
 *
 * matchScore:Number
 *
 * technical question :[{
 * question : "",
 * intention :"",
 * answer:""
 * }]
 *
 * Behavioral question :[{
 * question : "",
 * intention :"",
 * answer:""
 * }]
 *
 * skill gaps :[{
 * skill:""
 * severity:{
 * type:string
 * enum:["low","medium","high"]
 *  }
 *
 * }]
 */

const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    intention: {
      type: String,
      required: [true, "intention is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    intention: {
      type: String,
      required: [true, "intention is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapsSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  {
    _id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "day is required"],
    },
    focus: {
      type: String,
      required: [true, "focus is rrquired"],
    },
    tasks: [
      {
        type: String,
        required: [true, "task is required"],
      },
    ],
  },
  {
    _id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "job description is required"],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
    },
  },
  { timestamps: true },
);

const InterViewreportModel = mongoose.model(
  "InterViewreportModel",
  interviewReportSchema,
);
module.exports = InterViewreportModel;
