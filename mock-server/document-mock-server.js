const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const {
  prompts,
  assessmentAreas,
  assessmentAreaPrompt,
  documentTypes,
  documentTypeAssessmentArea,
  documentMetadata,
} = require('./mock-data.ts');

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());

// Use multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Endpoint
app.post('/upload_policy', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'File is required' });

  const fileName = `${Date.now()}-${file.originalname}`;
  const docId = `${Date.now()}-${file.originalname}`;
  const warning = file.originalname.toLowerCase().includes("test")
    ? "This document has already been uploaded."
    : null;

  // Optional delay
  setTimeout(() => {
    res.json({
      "doc_id": "feee3807cadc5677d4fd630076e876a369253b1b",
      "file_name": "DRAFTDISCLOSURECLIMATERELATEDFINANCIALRIS.pdf",
      "file_type": "pdf",
      "number_of_pages": 12,
      "doc_size_kb": 568,
      warning,
    });
  }, 100); // 1 sec delay
});

app.get('/document/:doc_id/document-type/:doc_type_id/validate', (req, res) => {
  const { doc_type_id } = req.params;

  const isValid = parseInt(doc_type_id, 10) % 2 === 0;

  const mockResponse = {
    "doc_summary_id": 1,
    "doc_id": "9961b70d-4c05-433e-a2fc-7a8225a89582",
    "doc_type_id": 1,
    "is_valid_document": isValid,
    "doc_valid_status_msg": isValid
      ? 'The uploaded document passed validation.'
      : 'The uploaded document is not valid document for selected document type.',
  };

  res.json(mockResponse);
});

// Create Document Endpoint
app.post('/create_document', (req, res) => {
  const newDocument = req.body;
  if (!newDocument) return res.status(400).json({ error: "Document data is required" });

  setTimeout(() => {
    res.json(newDocument);
  }, 100); // 1 sec delay
});

// Summarize Endpoint
app.get('/summarize/:document_id', (req, res) => {
  const document_id = req.params.document_id;
  if (!document_id) return res.status(400).json({ error: "document_id is required" });

  setTimeout(() => {

    res.json({
      doc_summary_id: 1,
      document_id: document_id,
      summary_text:
        `
          <h2>Odisha State Data Policy – 2024 Summary</h2>
          <p>The Odisha State Data Policy for 2024 outlines several critical components:</p>

          <ol>
            <li><strong>Requirements, Commercial Use, and Restrictions:</strong> 
              This document sets the foundational requirements for data usage in various sectors.
            </li>

            <li><strong>User Feedback and Collaboration:</strong> 
              Encourages user engagement through feedback mechanisms, allowing public and relevant stakeholders to suggest improvements via forums or platforms.
            </li>

            <li><strong>Data Transparency and Open Data Initiatives:</strong> 
              Supports transparency by publishing government data and ensuring open access for users.
            </li>

            <li><strong>Feedback Loop for OSDP:</strong> 
              Features a feedback mechanism with a sample form accessible via OCAC's web portal, aiming to refine the policy through constructive suggestions.
            </li>

            <li><strong>Data Protection Components:</strong> 
              Includes sections on data destruction, preservation, security, and usage, emphasizing the importance of permanent deletion in secure environments.
            </li>
          </ol>

          <p>This summary highlights key areas such as user feedback, data transparency, and data protection mechanisms.</p>
        
        
          `
    });
  }, 2000); // 2 sec delay
});

app.post('/evaluations', (req, res) => {
  const { docId } = req.body;

  // Simulate delay
  setTimeout(() => {
    if (!docId || docId === "invalid.doc") {
      return res.status(400).json({ error: "Invalid or missing docId" });
    }

    res.json({
      evaluations: [
        {
          description: 'What are the main policy objectives?',
          answer: 'Carbon reduction, green buildings, public transit, green space, and water conservation.',
          score: 9.5,
        },
        {
          description: 'How does this policy address equity concerns?',
          answer: 'Focus on equitable benefit distribution and community involvement.',
          score: 7.8,
        },
        {
          description: 'What is the implementation timeline?',
          answer: 'Phased: regulation (1–2), investment (3–7), monitoring (8–10).',
          score: 9.0,
        },
        {
          description: 'What funding mechanisms are proposed?',
          answer: 'Public-private partnerships and federal grants are mentioned, but lacking detail.',
          score: 5.2,
        },
      ],
    });
  }, 1500);
});

app.get('/prompt_score/:doc_summary_id', (req, res) => {
  const { doc_summary_id } = req.params;
  setTimeout(() => {
    if (!doc_summary_id) {
      return res.status(400).json({ error: 'Missing doc_summary_id' });
    }

    const scoreAnalysisData = [
    {
      assessment_id: 1,
      prompt_id: 101,
      criteria: "Clarity of Purpose",
      prompt_score: 7,
      max_score: 10
    },
    {
      assessment_id: 1,
      prompt_id: 102,
      criteria: "Impact Assessment",
      prompt_score: 8,
      max_score: 10
    },
    {
      assessment_id: 1,
      prompt_id: 103,
      criteria: "Public Participation",
      prompt_score: 6,
      max_score: 10
    },
    {
      assessment_id: 1,
      prompt_id: 104,
      criteria: "Feasibility",
      prompt_score: 9,
      max_score: 10
    },
    {
      assessment_id: 2,
      prompt_id: 104,
      criteria: "Feasibility",
      prompt_score: 6,
      max_score: 10
    },
    {
      assessment_id: 3,
      prompt_id: 109,
      criteria: "Technology",
      prompt_score: 4,
      max_score: 10
    }
  ];

    res.json(scoreAnalysisData);
  }, 2500);
});

// ---------- DOCUMENT TYPES ----------
app.get('/document_types', (_req, res) => res.json(documentTypes));

app.get('/document_types/:id', (req, res) => {
  const type = documentTypes.find(t => t.doc_type_id === parseInt(req.params.id));
  type ? res.json(type) : res.status(404).send('Document type not found');
});

app.post('/document_types', (req, res) => {
  const newType = req.body;
  newType.doc_type_id = documentTypes.length + 1; // Simple ID assignment
  documentTypes.push(newType);
  res.status(201).json(newType);
});

app.put('/document_types/:id', (req, res) => {
  const index = documentTypes.findIndex(t => t.doc_type_id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Document type not found');
  documentTypes[index] = req.body;
  res.json(documentTypes[index]);
});

app.delete('/document_types/:id', (req, res) => {
  const index = documentTypes.findIndex(t => t.doc_type_id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Document type not found');
  const removed = documentTypes.splice(index, 1);
  res.json(removed[0]);
});

app.get('/document_types/:typeId/assessments', (req, res) => {
  const typeId = parseInt(req.params.typeId);
  const assessments = documentTypeAssessmentArea
    .filter(rel => rel.doc_type_id === typeId)
    .map(rel => assessmentAreas.find(a => a.assessment_id === rel.assessment_id))
    .filter(Boolean);
  res.json(assessments);
});

// ---------- PROMPTS ----------
app.get('/prompt', (_req, res) => res.json(prompts));

app.get('/prompt/:id', (req, res) => {
  const prompt = prompts.find(p => p.prompt_id === parseInt(req.params.id));
  prompt ? res.json(prompt) : res.status(404).send('Prompt not found');
});

app.post('/prompt', (req, res) => {
  const newPrompt = req.body;
  newPrompt.prompt_id = prompts.length + 1; // Simple ID assignment
  prompts.push(newPrompt);
  res.status(201).json(newPrompt);
});

app.put('/prompt/:id', (req, res) => {
  const index = prompts.findIndex(p => p.prompt_id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Prompt not found');
  prompts[index] = req.body;
  res.json(prompts[index]);
});

app.delete('/prompt/:id', (req, res) => {
  const index = prompts.findIndex(p => p.prompt_id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Prompt not found');
  const removed = prompts.splice(index, 1);
  res.json(removed[0]);
});

// ---------- ASSESSMENT AREAS ----------
app.get('/assessment_areas', (_req, res) => res.json(assessmentAreas));

app.get('/assessment_areas/:id', (req, res) => {
  const area = assessmentAreas.find(a => a.assessment_id === parseInt(req.params.id));
  area ? res.json(area) : res.status(404).send('Assessment area not found');
});

app.post('/assessment_areas', (req, res) => {
  const newArea = req.body;
  newArea.assessment_id = assessmentAreas.length + 1; // Simple ID assignment
  assessmentAreas.push(newArea);
  res.status(201).json(newArea);
});

app.put('/assessment_areas/:id', (req, res) => {
  const index = assessmentAreas.findIndex(a => a.assessment_id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Assessment area not found');
  assessmentAreas[index] = req.body;
  res.json(assessmentAreas[index]);
});

app.delete('/assessment_areas/:id', (req, res) => {
  const index = assessmentAreas.findIndex(a => a.assessment_id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Assessment area not found');
  const removed = assessmentAreas.splice(index, 1);
  res.json(removed[0]);
});

app.get('/assessment_areas/:areaId/prompt', (req, res) => {
  const areaId = parseInt(req.params.areaId);
  const promptIds = assessmentAreaPrompt
    .filter(rel => rel.assessment_id === areaId)
    .map(rel => rel.prompt_id);
  const relatedPrompts = prompts.filter(p => promptIds.includes(p.prompt_id));
  res.json(relatedPrompts);
});

app.get('/report/download/:doc_summary_id', (req, res) => {
  const { doc_summary_id } = req.params;

  const filePath = 'draft_policy_report.pdf';

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Report not found');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="draft_policy_report_${doc_summary_id}.pdf"`);

  fs.createReadStream(filePath).pipe(res);
});

app.get("/summary/:doc_summary_id/assessment/:assessment_id", (req, res) => {

  const random_delay = parseFloat((60 + Math.random() * 30).toFixed(1)) * 100;
  setTimeout(() => {
    const { doc_summary_id, assessment_id } = req.params;
    const mockResponse = {
      assessment_id: parseInt(assessment_id, 10),
      summary: 
      
      `
        <div>
            <h3>Data Management & Governance Summary</h3>
            <ul>
                <li><strong>Data Handling Skills:</strong> Develop expertise in data analysis to enable informed decision-making across all organizational levels.</li>
                <li><strong>Data Portal Features:</strong> 
                    <ul>
                        <li>APIs, documentation, and developer resources for seamless integration.</li>
                        <li>Multi-format data downloads (CSV, Excel, JSON, etc.) with bulk and subset options.</li>
                        <li>Metadata, quality scores, and validation reports to ensure data reliability.</li>
                        <li>Clear licensing terms, usage restrictions, and attribution requirements.</li>
                    </ul>
                </li>
                <li><strong>IT & Security Measures:</strong> 
                    <ul>
                        <li>Encryption, anonymization, and privacy-enhancing technologies (PETs) for data protection.</li>
                        <li>Disaster recovery plans and business continuity protocols.</li>
                        <li>Integration of emerging technologies (AI, IoT, blockchain) for advanced data management.</li>
                    </ul>
                </li>
                <li><strong>Consent Management:</strong> 
                    <ul>
                        <li>Explicit consent for sensitive data (health, biometrics) and third-party sharing.</li>
                        <li>Granular opt-in/opt-out options for specific data uses and communication preferences.</li>
                    </ul>
                </li>
                <li><strong>Governance Framework:</strong> 
                    <ul>
                        <li>Centralized oversight for data standards, security, and emerging tool adoption.</li>
                        <li>Interdepartmental collaboration to reduce data duplication and enhance synergy.</li>
                        <li>Capacity-building initiatives to improve data literacy and technical competency.</li>
                    </ul>
                </li>
            </ul>
        </div>
      `,
      overall_score: parseFloat((Math.random() * 10).toFixed(1)),
    };
    res.json(mockResponse);
  }, random_delay);
});

app.listen(PORT, () => {
  console.log(`✅ Mock server running at http://localhost:${PORT}`);
});
