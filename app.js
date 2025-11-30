// app.js
// ============================================================================
// 1) CONFIG & CONSTANTS
// ============================================================================

// NOTE: We expect GEMINI_API_KEY to be injected from your config/.env setup,
// for example by including a small config.js that does:
//
//   window.GEMINI_API_KEY = "<your real key>";
//
// This avoids hardcoding secrets in the repo. For quick local testing only,
// you *could* temporarily hardcode it here.
const GEMINI_API_KEY = window.GEMINI_API_KEY || "AIzaSyC85kvMCKjaopQmLnxXGnrW3oZkBC0DwMc"; // <-- from your config/env
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// LocalStorage keys
const CHAT_HISTORY_KEY = "skillMatchChatHistory";
const CERT_CATALOG_KEY = "skillMatchCertCatalog";

// Default (built-in) certificate catalog.
// This will be used the first time and then stored in localStorage.
// Later, if you build an "admin" UI, you can update it and re-save.
const FINAL_CERTIFICATE_CATALOG = [
  // --- 1. Cloud Infrastructure & Architecture ---
  {
    id: "aws_ccp",
    name: "AWS Certified Cloud Practitioner (CCP)",
    description:
      "Validates fundamental understanding of AWS cloud concepts, security, and pricing.",
    level: "Foundational",
    officialLink: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  },
  {
    id: "azure_fund",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    description:
      "Demonstrates foundational knowledge of core Azure services, security, and pricing.",
    level: "Foundational",
    officialLink:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  },
  {
    id: "gcp_cdl",
    name: "Google Cloud Certified Cloud Digital Leader (CDL)",
    description:
      "Understanding of basic cloud computing and how Google Cloud products enable business transformation.",
    level: "Foundational",
    officialLink: "https://cloud.google.com/learn/certification/cloud-digital-leader",
  },
  {
    id: "aws_saa",
    name: "AWS Certified Solutions Architect - Associate",
    description:
      "Designing and deploying secure, cost-effective, and scalable systems on AWS.",
    level: "Associate",
    officialLink: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
  },
  {
    id: "azure_admin",
    name: "Microsoft Certified: Azure Administrator Associate (AZ-104)",
    description:
      "Implementation, management, and monitoring of Azure identity, governance, compute, and networking.",
    level: "Associate",
    officialLink:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/",
  },
  {
    id: "gcp_pca",
    name: "Professional Cloud Architect (PCA)",
    description:
      "Designing, planning, and managing secure, highly available, and scalable cloud architecture on Google Cloud.",
    level: "Expert",
    officialLink: "https://cloud.google.com/learn/certification/cloud-architect",
  },

  // --- 2. Integration & Digital Workflow (ServiceNow, MuleSoft, Salesforce) ---
  {
    id: "sn_csa",
    name: "ServiceNow Certified System Administrator (CSA)",
    description:
      "Core knowledge of the ServiceNow platform configuration, management, and maintenance.",
    level: "Foundational",
    officialLink:
      "https://learning.servicenow.com/lxp/en/credentials/certified-system-administrator-mainline-exam-blueprint?id=kb_article_view&sysparm_article=KB0011554",
  },
  {
    id: "sn_cis_itsm",
    name: "ServiceNow CIS - IT Service Management (ITSM)",
    description:
      "Expertise in deploying and configuring the core IT Service Management suite (Incident, Problem, Change).",
    level: "Specialist",
    officialLink: "https://learning.servicenow.com/lxp/en/pages/now-learning-get-certified?id=amap_detail&achievement_id=6c8e1d77dbc27f40de3cdb85ca961970",
  },
  {
    id: "mulesoft_dev1",
    name: "MuleSoft Certified Developer - Level 1",
    description:
      "Building, testing, troubleshooting, and deploying basic APIs and integrations using Anypoint Platform (Mule 4).",
    level: "Associate",
    officialLink: "https://trailheadacademy.salesforce.com/certificate/exam-mule-dev---Mule-Dev-201",
  },
  {
    id: "sf_admin",
    name: "Salesforce Certified Platform Administrator",
    description:
      "Foundational knowledge of managing users, security, and standard functionality of a Salesforce organization.",
    level: "Associate",
    officialLink: "https://trailhead.salesforce.com/credentials/administrator",
  },
  {
    id: "sf_app_arch",
    name: "Salesforce Certified Application Architect",
    description:
      "Designing and building technical solutions that are secure, scalable, and tailored for enterprise data management and sharing.",
    level: "Expert",
    officialLink:
      "https://trailhead.salesforce.com/credentials/applicationarchitect",
  },

  // --- 3. Data, AI & Analytics ---
  {
    id: "snowflake_core",
    name: "SnowPro Core Certification",
    description:
      "Core features and implementation of the Snowflake Cloud Data Platform.",
    level: "Foundational",
    officialLink: "https://learn.snowflake.com/en/certifications/snowpro-core/",
  },
  {
    id: "databricks_associate",
    name: "Databricks Certified Data Engineer Associate",
    description:
      "Building and deploying ETL/ELT pipelines using Databricks (PySpark, SQL).",
    level: "Associate",
    officialLink: "https://www.databricks.com/learn/certification/data-engineer-associate",
  },
  {
    id: "power_bi_analyst",
    name: "Microsoft Power BI Data Analyst (PL-300)",
    description:
      "Designing and building scalable data models and reports for business insight using Power BI.",
    level: "Associate",
    officialLink:
      "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/?practice-assessment-type=certification",
  },
  {
    id: "azure_ai_eng",
    name: "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
    description:
      "Designing and implementing AI solutions using Azure services (Cognitive Services, Azure ML).",
    level: "Professional",
    officialLink:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
  },

  // --- 4. Business, Process & Strategy (Digital Transformation) ---
  {
    id: "pmp",
    name: "Project Management Professional (PMP)",
    description:
      "Validates skills in leading and directing complex projects, using predictive, agile, and hybrid approaches.",
    level: "Expert",
    officialLink: "https://www.pmi.org/certifications/project-management-pmp",
  },
  {
    id: "itil_f",
    name: "ITIL 4 Foundation",
    description:
      "Core principles and practices for IT Service Management (ITSM) and the Service Value System.",
    level: "Foundational",
    officialLink:
      "https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-4-foundation-2565",
  },
  {
    id: "csm",
    name: "Certified ScrumMaster (CSM)",
    description:
      "Understanding and application of the Scrum framework to facilitate teams and manage agile delivery.",
    level: "Specialist",
    officialLink:
      "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster",
  },
  {
    id: "cbap",
    name: "Certified Business Analysis Professional (CBAP)",
    description:
      "Expertise in defining requirements, driving strategic outcomes, and liaison between business and IT stakeholders.",
    level: "Expert",
    officialLink: "https://www.iiba.org/business-analysis-certifications/cbap/",
  },
  {
    id: "ccmp",
    name: "Certified Change Management Professional (CCMP)",
    description:
      "Structured methodologies for managing the human and organizational side of digital change.",
    level: "Specialist",
    officialLink: "https://www.acmpglobal.org/page/CCMP",
  },
  {
    id: "focp",
    name: "FinOps Certified Practitioner (FOCP)",
    description:
      "Principles for managing cloud financial operations, cost optimization, and financial accountability.",
    level: "Foundational",
    officialLink: "https://learn.finops.org/page/finops-certified-practitioner",
  },

  // --- 5. Cybersecurity, DevOps & Governance ---
  {
    id: "cissp",
    name: "Certified Information Systems Security Professional (CISSP)",
    description:
      "Executive-level knowledge in designing, implementing, and managing a security program.",
    level: "Expert",
    officialLink: "https://www.isc2.org/certifications/CISSP",
  },
  {
    id: "cism",
    name: "Certified Information Security Manager (CISM)",
    description:
      "Focuses on security governance, program development, risk management, and incident management.",
    level: "Expert",
    officialLink: "https://www.isaca.org/credentialing/cism",
  },
  {
    id: "cka",
    name: "Certified Kubernetes Administrator (CKA)",
    description:
      "Hands-on ability to deploy, configure, and manage Kubernetes clusters (Cloud Native App Development).",
    level: "Specialist",
    officialLink:
      "https://trainingportal.linuxfoundation.org/courses/certified-kubernetes-administrator-cka",
  },
  {
    id: "terraform",
    name: "HashiCorp Certified: Terraform Associate",
    description:
      "Foundational skills in Infrastructure as Code (IaC) using Terraform for multi-cloud automation.",
    level: "Associate",
    officialLink: "https://developer.hashicorp.com/certifications/infrastructure-automation",
  },
  {
    id: "github_as",
    name: "GitHub Advanced Security",
    description:
      "Expertise in implementing security tools and practices within GitHub repositories and workflows.",
    level: "Specialist",
    officialLink: "https://github.com/features/security",
  },
];

// This variable will hold the *active* catalog (loaded from localStorage or default)
let certificateCatalog = [];

// ============================================================================
// 2) SYSTEM PROMPTS & AGENT BEHAVIOR (EDIT HERE MOST OFTEN)
// ============================================================================
//
// This section controls how the AI "behaves". You can tweak wording, tone,
// and instructions without touching the rest of the code.
//
// - CHAT_SYSTEM_PROMPT: used for the chat assistant.
// - ANALYSIS_SYSTEM_PROMPT: used for CV → certification analysis.
// - RULES_SYSTEM_PROMPT: used to parse free-text rules.
//

// System / persona prompt for the chat assistant.
const CHAT_SYSTEM_PROMPT = `
You are "SkillMatch Pro", an AI-powered assistant that helps people:
- understand training and certification options,
- analyze their CV or experience at a high level,
- and discuss skill gaps in a clear, practical way.

Your style:
- concise but helpful,
- friendly and professional,
- focused on actionable recommendations.
`;

// System prompt for the CV analysis engine.
// This is combined with the certification catalog, business rules, and CV text.
// You can adjust instructions, strictness of JSON, or the level of explanation here.
const ANALYSIS_SYSTEM_PROMPT = `
You are an expert career counselor and training analyst.
Your job is to:

1. Read CVs.
2. Identify key skills, experience levels, and roles.
3. Recommend the most relevant training and certifications from the provided catalog.
4. Respect the business rules when applicable.
5. Return a single strict JSON object in the specified structure.
`;

// System prompt for parsing natural-language business rules into normalized text.
const RULES_SYSTEM_PROMPT = `
You are a business rules parser.
You read natural-language rules from the user and convert them into a clean, structured list of rule sentences.
Each rule should be returned as a single string in an array.
Respond ONLY with a JSON array of strings, no extra text or formatting.
`;

// ============================================================================
// 3) GLOBAL STATE
// ============================================================================
//
// All cross-section state lives here. This keeps the rest of the code simple.
// ----------------------------------------------------------------------------

let chatHistory = [];        // [{ text: string, isUser: boolean }]
let userRules = [];          // [string]
let uploadedCvs = [];        // [{ name: string, text: string }]

// ============================================================================
// 4) GENERIC HELPERS (UI, LocalStorage, Catalog)
// ============================================================================

// Append a message to the chat UI.
function addMessage(text, isUser = false) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
  // Convert newlines to <br> for simple formatting
  messageDiv.innerHTML = text.replace(/\n/g, "<br>");

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show status messages (success / error) in a given container element.
function updateStatus(element, message, isError = false) {
  if (!element) return;
  element.innerHTML = `
    <div class="status-message ${isError ? "status-error" : "status-success"}">
      ${message}
    </div>
  `;
  setTimeout(() => {
    element.innerHTML = "";
  }, 8000);
}

// Show a little loader spinner + text.
function showLoading(element, message) {
  if (!element) return;
  element.innerHTML = `<div class="loader"></div>${message}`;
}

// Hide any loader text.
function hideLoading(element) {
  if (!element) return;
  element.innerHTML = "";
}

// Save chat history to localStorage so it persists across refreshes.
function saveChatHistory() {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
  } catch (err) {
    console.error("Failed to save chat history:", err);
  }
}

// Load chat history from localStorage on startup.
function loadChatHistory() {
  const saved = localStorage.getItem(CHAT_HISTORY_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      chatHistory = parsed;
      chatHistory.forEach((msg) => addMessage(msg.text, msg.isUser));
    }
  } catch (err) {
    console.error("Failed to parse chat history:", err);
    chatHistory = [];
  }
}

// Load certificate catalog from localStorage OR fallback to the default.
// This is where you can later plug in an "editor" UI that modifies the catalog.
function loadCertificateCatalog() {
  const stored = localStorage.getItem(CERT_CATALOG_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn("Failed to parse stored certificate catalog, using default.", err);
    }
  }
  // If nothing valid stored → use default, and persist it once.
  saveCertificateCatalog(DEFAULT_CERTIFICATE_CATALOG);
  return DEFAULT_CERTIFICATE_CATALOG;
}

// Save a given catalog array to localStorage.
function saveCertificateCatalog(catalogArray) {
  try {
    localStorage.setItem(CERT_CATALOG_KEY, JSON.stringify(catalogArray));
  } catch (err) {
    console.error("Failed to save certificate catalog:", err);
  }
}

// Create a string representation of the catalog to embed in prompts.
function getCatalogAsPromptString() {
  return certificateCatalog
    .map(
      (c) =>
        `- ID: ${c.id}, Name: ${c.name}, Description: ${c.description}`
    )
    .join("\n");
}

// ============================================================================
// 5) AI CLIENT (Gemini HTTP Wrapper)
// ============================================================================
//
// This is the only place that talks to Gemini. Everywhere else just calls
// callGeminiAPI(prompt, history?) and doesn't care about HTTP details.
// ----------------------------------------------------------------------------

async function callGeminiAPI(userPrompt, history = [], systemPrompt = "") {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not set. Please make sure it is injected via your config/env."
    );
  }

  // Format history for Gemini
  const formattedHistory = history.map((msg) => ({
    role: msg.isUser ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  // We simulate a "system" message by prefixing userPrompt with instructions,
  // since this API does not have a separate system role.
  const combinedPrompt = systemPrompt
    ? `${systemPrompt.trim()}\n\nUser message:\n${userPrompt}`
    : userPrompt;

  const requestBody = {
    contents: [
      ...formattedHistory,
      { role: "user", parts: [{ text: combinedPrompt }] },
    ],
  };

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errMsg = "";
    try {
      const errData = await response.json();
      errMsg = errData.error?.message || "Unknown error";
    } catch {
      errMsg = await response.text();
    }
    throw new Error(`API Error: ${response.status} - ${errMsg}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't generate a response.";
  return text;
}

// ============================================================================
// 6) CV PARSING (PDF, DOCX, TXT)
// ============================================================================
//
// Uses pdf.js and mammoth.js which are loaded via CDN in index.html.
// ----------------------------------------------------------------------------

// Configure PDF.js worker (global pdfjsLib is provided by CDN)
if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

/**
 * Extract text from a single file.
 * Supports: PDF, DOCX, TXT.
 */
async function extractTextFromFile(file) {
  if (file.type === "application/pdf") {
    const dataBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: dataBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  }

  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (file.type === "text/plain") {
    return await file.text();
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}

// ============================================================================
// 7) RULE ENGINE (Parse + Store Business Rules)
// ============================================================================
//
// userRules is kept in memory. This section only worries about converting
// natural-language rules into a normalized list of strings.
// ----------------------------------------------------------------------------

async function parseAndApplyRules(rulesText) {
  const prompt = `
${RULES_SYSTEM_PROMPT.trim()}

User's rules:
${rulesText}

Remember:
- Respond with ONLY a JSON array of strings.
- No extra commentary or formatting.
`;

  const rawResponse = await callGeminiAPI(prompt, [], ""); // systemPrompt already embedded above
  const cleaned = rawResponse.replace(/```json\s*|\s*```/g, "").trim();

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error("Parsed rules are not an array.");
  }

  userRules = parsed;
  return userRules;
}

// ============================================================================
// 8) RECOMMENDATION ENGINE (CV → Certs)
// ============================================================================
//
// Builds the large prompt for CV analysis + uses Gemini to return a JSON object.
// Then, renders the recommendations in the UI.
// ----------------------------------------------------------------------------

function buildAnalysisPromptForCvs(cvArray, rulesArray) {
  const catalogString = getCatalogAsPromptString();

  return `
${ANALYSIS_SYSTEM_PROMPT.trim()}

**Catalog of Certifications:**
${catalogString}

**Business Rules:**
${rulesArray && rulesArray.length > 0
      ? rulesArray.map((r) => `- ${r}`).join("\n")
      : "No specific business rules provided."
    }

**CVs to Analyze:**
${cvArray
      .map((cv) => `--- CV for: ${cv.name} ---\n${cv.text}`)
      .join("\n\n")}

**Task:**
For each CV, provide recommendations in a structured JSON format. The JSON must be an object with a "candidates" field, where each candidate is an object.

**JSON Structure:**
{
  "candidates": [
    {
      "candidateName": "Full Name of Candidate",
      "recommendations": [
        {
          "certId": "pmp",
          "certName": "Project Management Professional (PMP)",
          "reason": "Clear explanation of why this certification is relevant.",
          "rulesApplied": ["List of rules that influenced this recommendation"]
        }
      ]
    }
  ]
}

Important:
- Respond with ONLY the JSON object. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json.
- The entire response must be a single, valid JSON object that can be parsed.
- If no recommendations can be made for a candidate, provide an empty array for their "recommendations".
`;
}

// Call Gemini to analyze the CVs and parse the recommendations JSON.
async function analyzeCvsWithAI(cvArray, rulesArray) {
  const analysisPrompt = buildAnalysisPromptForCvs(cvArray, rulesArray || []);
  const rawResponse = await callGeminiAPI(analysisPrompt, [], ""); // systemPrompt already baked in
  const cleaned = rawResponse.replace(/```json\s*|\s*```/g, "").trim();

  let recommendations;
  try {
    recommendations = JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parsing Error:", err);
    throw new Error(
      "The AI returned an invalid JSON format. Check the console for the raw response."
    );
  }

  return recommendations;
}

// Render the recommendations object into the HTML.
function displayRecommendations(recommendations, containerEl, resultsSectionEl) {
  if (!containerEl || !resultsSectionEl) return;

  containerEl.innerHTML = "";

  if (
    !recommendations ||
    !recommendations.candidates ||
    recommendations.candidates.length === 0
  ) {
    containerEl.innerHTML =
      "<p>No recommendations could be generated. Please check the CVs, rules, and the console for errors.</p>";
  } else {
    recommendations.candidates.forEach((candidate) => {
      const candidateDiv = document.createElement("div");
      candidateDiv.className = "candidate-result";

      const nameDiv = document.createElement("h3");
      nameDiv.className = "candidate-name";
      nameDiv.textContent = candidate.candidateName || "Candidate";
      candidateDiv.appendChild(nameDiv);

      if (candidate.recommendations && candidate.recommendations.length > 0) {
        candidate.recommendations.forEach((rec) => {
          const card = document.createElement("div");
          card.className = "recommendation-card";
          card.innerHTML = `
            <div class="recommendation-title">${rec.certName}</div>
            <div class="recommendation-reason">
              <i class="fas fa-lightbulb"></i> ${rec.reason}
            </div>
            ${
              rec.rulesApplied && rec.rulesApplied.length > 0
                ? `<div class="recommendation-rule">
                     <i class="fas fa-gavel"></i> Rules Applied: ${rec.rulesApplied.join(
                       ", "
                     )}
                   </div>`
                : ""
            }
          `;
          candidateDiv.appendChild(card);
        });
      } else {
        const noRecP = document.createElement("p");
        noRecP.textContent =
          "No specific recommendations found for this candidate based on the current rules and catalog.";
        candidateDiv.appendChild(noRecP);
      }

      containerEl.appendChild(candidateDiv);
    });
  }

  resultsSectionEl.classList.remove("hidden");
}

// ============================================================================
// 9) DOM BINDING & EVENT HANDLERS
// ============================================================================
//
// This section wires everything together once the DOM is ready.
// - Chat send button & Enter key
// - CV upload, drag & drop, analyze button
// - Rules textarea + Update Rules button
// ----------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Load the certificate catalog from localStorage or defaults
  certificateCatalog = loadCertificateCatalog();

  // DOM elements
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  const fileInput = document.getElementById("file-input");
  const analyzeButton = document.getElementById("analyze-button");
  const cvUploadArea = document.getElementById("cv-upload-area");

  const rulesInput = document.getElementById("rules-input");
  const updateRulesButton = document.getElementById("update-rules");

  const uploadStatus = document.getElementById("upload-status");
  const rulesStatus = document.getElementById("rules-status");

  const resultsSection = document.getElementById("results-section");
  const recommendationsContainer = document.getElementById(
    "recommendations-container"
  );

  // Load chat history into UI
  loadChatHistory();

  // --- Chat events ---
  async function handleSendMessage() {
    const message = (userInput.value || "").trim();
    if (!message) return;

    addMessage(message, true);
    chatHistory.push({ text: message, isUser: true });
    saveChatHistory();

    userInput.value = "";
    sendButton.disabled = true;

    try {
      const reply = await callGeminiAPI(message, chatHistory, CHAT_SYSTEM_PROMPT);
      addMessage(reply, false);
      chatHistory.push({ text: reply, isUser: false });
      saveChatHistory();
    } catch (err) {
      console.error("Chat API Error:", err);
      addMessage(
        "Sorry, I'm having trouble connecting. Please verify the API key and network.",
        false
      );
    } finally {
      sendButton.disabled = false;
    }
  }

  sendButton.addEventListener("click", handleSendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  });

  // --- File upload events ---
  cvUploadArea.addEventListener("click", () => fileInput.click());

  cvUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    cvUploadArea.style.borderColor = "var(--primary)";
  });

  cvUploadArea.addEventListener("dragleave", () => {
    cvUploadArea.style.borderColor = "var(--border-color)";
  });

  cvUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    cvUploadArea.style.borderColor = "var(--border-color)";
    fileInput.files = e.dataTransfer.files;
    handleFileSelect();
  });

  fileInput.addEventListener("change", handleFileSelect);

  function handleFileSelect() {
    uploadedCvs = [];
    const files = Array.from(fileInput.files || []);
    if (files.length > 0) {
      updateStatus(
        uploadStatus,
        `Selected ${files.length} file(s): ${files.map((f) => f.name).join(", ")}`
      );
    } else {
      uploadStatus.innerHTML = "";
    }
  }

  analyzeButton.addEventListener("click", async () => {
    const files = Array.from(fileInput.files || []);
    if (files.length === 0) {
      updateStatus(uploadStatus, "Please select at least one CV file.", true);
      return;
    }

    showLoading(uploadStatus, "Extracting text from CVs...");
    analyzeButton.disabled = true;
    uploadedCvs = [];

    try {
      // 1) Extract text from all files
      for (const file of files) {
        const text = await extractTextFromFile(file);
        console.log(`--- DEBUG: Extracted text from ${file.name} ---`);
        console.log(text);
        uploadedCvs.push({ name: file.name, text });
      }

      showLoading(uploadStatus, "Analyzing CVs with AI...");

      // 2) Analyze with AI using current rules + catalog
      const recommendations = await analyzeCvsWithAI(uploadedCvs, userRules);

      // 3) Render
      displayRecommendations(
        recommendations,
        recommendationsContainer,
        resultsSection
      );

      updateStatus(uploadStatus, `Analysis complete for ${files.length} CV(s).`);
    } catch (err) {
      console.error("Analysis Error:", err);
      updateStatus(
        uploadStatus,
        `Failed to analyze CVs. Error: ${err.message}`,
        true
      );
    } finally {
      hideLoading(uploadStatus);
      analyzeButton.disabled = false;
    }
  });

  // --- Rules events ---
  updateRulesButton.addEventListener("click", async () => {
    const rulesText = (rulesInput.value || "").trim();
    if (!rulesText) {
      updateStatus(
        rulesStatus,
        "Please enter some rules before updating.",
        true
      );
      return;
    }

    showLoading(rulesStatus, "Parsing rules with AI...");
    updateRulesButton.disabled = true;

    try {
      const parsedRules = await parseAndApplyRules(rulesText);
      updateStatus(
        rulesStatus,
        `Successfully parsed and applied ${parsedRules.length} rules.`
      );
      addMessage(
        "I've updated my recommendation logic based on your new rules.",
        false
      );
    } catch (err) {
      console.error("Rule Parsing Error:", err);
      updateStatus(
        rulesStatus,
        `Failed to parse rules. Error: ${err.message}`,
        true
      );
    } finally {
      hideLoading(rulesStatus);
      updateRulesButton.disabled = false;
    }
  });
});
