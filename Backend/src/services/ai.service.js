const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

// -----------------------------------------
// ZOD SCHEMA
// -----------------------------------------

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description.",
    ),

  title: z.string().describe("The job title from the job description."),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview.",
          ),

        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question.",
          ),

        answer: z
          .string()
          .describe(
            "How to answer this question, including the key points to cover and the approach to take.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview, along with their intention and how to answer them.",
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview.",
          ),

        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking this question.",
          ),

        answer: z
          .string()
          .describe(
            "How to answer this question, including the key points to cover and the approach to take.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview, along with their intention and how to answer them.",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill that the candidate is lacking."),

        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap based on how important the skill is for the job and how much it can impact the candidate's chances.",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity.",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .int()
          .min(1)
          .describe("The day number in the preparation plan, starting from 1."),

        focus: z
          .string()
          .describe(
            "The main focus of this day, such as data structures, system design, or mock interviews.",
          ),

        tasks: z
          .array(z.string())
          .describe("List of tasks to complete on this day."),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to effectively prepare for the interview.",
    ),
});

// -----------------------------------------
// GEMINI
// -----------------------------------------

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

// -----------------------------------------
// GENERATE INTERVIEW REPORT
// -----------------------------------------

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer and career advisor.

Analyze the candidate's resume, self-description, and job description.

Generate a personalized interview preparation report.

IMPORTANT:
Your response MUST follow the provided response schema exactly.

The response MUST contain these fields:

- matchScore
- title
- technicalQuestions
- behavioralQuestions
- skillGaps
- preparationPlan

Do not omit any field.

--------------------------------------------------
MATCH SCORE
--------------------------------------------------

Generate a matchScore.

Rules:

- It MUST be a number between 0 and 100.
- It MUST NOT be a string.
- Calculate it based on how well the candidate's skills, projects, education, and experience match the job description.
- Do not generate a random score.

--------------------------------------------------
TITLE
--------------------------------------------------

"title" must contain the relevant job title from the job description.

--------------------------------------------------
TECHNICAL QUESTIONS
--------------------------------------------------

technicalQuestions MUST be an array of OBJECTS.

Each object MUST have exactly:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

NEVER return:

"technicalQuestions": [
  "question",
  "intention",
  "answer"
]

ALWAYS return:

"technicalQuestions": [
  {
    "question": "How does React work?",
    "intention": "To evaluate React fundamentals.",
    "answer": "Explain components, virtual DOM and reconciliation."
  }
]

Generate questions specifically from the candidate's resume and job description.

Use the candidate's actual projects whenever relevant.

--------------------------------------------------
BEHAVIORAL QUESTIONS
--------------------------------------------------

behavioralQuestions MUST be an array of OBJECTS.

Each object MUST have exactly:

{
  "question": "...",
  "intention": "...",
  "answer": "..."
}

Do not return strings.

Use the candidate's actual background and projects where possible.

Do not invent experiences that are not present in the resume.

--------------------------------------------------
SKILL GAPS
--------------------------------------------------

skillGaps MUST be an array of OBJECTS.

Each object MUST have exactly:

{
  "skill": "...",
  "severity": "low | medium | high"
}

Compare the candidate's resume against the job description.

Only identify realistic skill gaps.

--------------------------------------------------
PREPARATION PLAN
--------------------------------------------------

preparationPlan MUST be an array of OBJECTS.

Each object MUST have exactly:

{
  "day": 1,
  "focus": "...",
  "tasks": [
    "...",
    "...",
    "..."
  ]
}

IMPORTANT:

- preparationPlan must contain objects.
- Do not return strings.
- Start day numbering from 1.
- Create a practical preparation plan.
- Each day must contain day, focus and tasks.

--------------------------------------------------
FINAL RULES
--------------------------------------------------

- Follow the response schema exactly.
- Do not add extra fields.
- Do not remove fields.
- Do not convert objects into strings.
- technicalQuestions must contain objects.
- behavioralQuestions must contain objects.
- skillGaps must contain objects.
- preparationPlan must contain objects.
- matchScore must be a number.
- Base everything only on the provided candidate information and job description.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}
`;

  // -----------------------------------------
  // GEMINI JSON SCHEMA
  // -----------------------------------------

  const responseSchema = {
    type: "object",

    properties: {
      matchScore: {
        type: "number",
      },

      title: {
        type: "string",
      },

      technicalQuestions: {
        type: "array",

        items: {
          type: "object",

          properties: {
            question: {
              type: "string",
            },

            intention: {
              type: "string",
            },

            answer: {
              type: "string",
            },
          },

          required: ["question", "intention", "answer"],
        },
      },

      behavioralQuestions: {
        type: "array",

        items: {
          type: "object",

          properties: {
            question: {
              type: "string",
            },

            intention: {
              type: "string",
            },

            answer: {
              type: "string",
            },
          },

          required: ["question", "intention", "answer"],
        },
      },

      skillGaps: {
        type: "array",

        items: {
          type: "object",

          properties: {
            skill: {
              type: "string",
            },

            severity: {
              type: "string",

              enum: ["low", "medium", "high"],
            },
          },

          required: ["skill", "severity"],
        },
      },

      preparationPlan: {
        type: "array",

        items: {
          type: "object",

          properties: {
            day: {
              type: "integer",
            },

            focus: {
              type: "string",
            },

            tasks: {
              type: "array",

              items: {
                type: "string",
              },
            },
          },

          required: ["day", "focus", "tasks"],
        },
      },
    },

    required: [
      "matchScore",
      "title",
      "technicalQuestions",
      "behavioralQuestions",
      "skillGaps",
      "preparationPlan",
    ],
  };

  // -----------------------------------------
  // GEMINI API CALL
  // -----------------------------------------

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      // IMPORTANT:
      // Do NOT use zodToJsonSchema here
      responseSchema: responseSchema,
    },
  });

  // -----------------------------------------
  // PARSE RESPONSE
  // -----------------------------------------

  const result = JSON.parse(response.text);

  // -----------------------------------------
  // VALIDATE RESPONSE WITH ZOD
  // -----------------------------------------

  const validatedResult = interviewReportSchema.parse(result);

  return validatedResult;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `Generate resume for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using puppeteer.

    The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience.

    The HTML content should be well-formatted and structured, making it easy to read and visually appealing.

    The content of resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.

    You can highlight the content using some colors or different font styles but the overall design should be simple and professional.

    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.

    The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF.

    Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          html: {
            type: "string",
          },
        },

        required: ["html"],
      },
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(
    jsonContent.html
  );

  return pdfBuffer;
}

module.exports = {generateInterviewReport,generateResumePdf};
