const express = require('express');
const cors = require('cors');
const multer = require('multer');
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
      "doc_id": "feee3807cadc5677d4fd630076e876a369253b1b39140f8caf6c256f370214bf",
      "file_name": "DRAFTDISCLOSURECLIMATERELATEDFINANCIALRISKS20249FBE3A566E7F487EBF9974642E6CCDB1 (1).pdf",
      "file_type": "application/pdf",
      "number_of_pages": 12,
      "doc_size_kb": 568,
      warning,
    });
  }, 100); // 1 sec delay
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
          question: 'What are the main policy objectives?',
          answer: 'Carbon reduction, green buildings, public transit, green space, and water conservation.',
          score: 9.5,
        },
        {
          question: 'How does this policy address equity concerns?',
          answer: 'Focus on equitable benefit distribution and community involvement.',
          score: 7.8,
        },
        {
          question: 'What is the implementation timeline?',
          answer: 'Phased: regulation (1–2), investment (3–7), monitoring (8–10).',
          score: 9.0,
        },
        {
          question: 'What funding mechanisms are proposed?',
          answer: 'Public-private partnerships and federal grants are mentioned, but lacking detail.',
          score: 5.2,
        },
      ],
    });
  }, 1500);
});

app.post('/score', (req, res) => {
  const { docId } = req.body;

  setTimeout(() => {
    if (!docId) {
      return res.status(400).json({ error: 'Missing docId' });
    }

    res.json({
      overallScore: "8.4",
      clarityRating: "93%",
      implementationDetail: "87%",
      stakeholderEngagement: "76%",
      policyElementScores: [
        { name: "Objectives", value: 25 },
        { name: "Implementation", value: 20 },
        { name: "Clarity", value: 20 },
        { name: "Equity", value: 15 },
        { name: "Funding", value: 20 },
      ],
      performanceByCategory: [
        { name: "Environmental", score: 88 },
        { name: "Economic", score: 65 },
        { name: "Social", score: 78 },
        { name: "Governance", score: 80 },
        { name: "Technology", score: 70 },
      ],
    });
  }, 1500);
});

// ---------- DOCUMENT TYPES ----------
app.get('/document_types', (_req, res) => res.json(documentTypes));

app.get('/document_types/:id', (req, res) => {
  const type = documentTypes.find(t => t.doc_type_id === parseInt(req.params.id));
  type ? res.json(type) : res.status(404).send('Document type not found');
});

app.post('/document_types', (req, res) => {
  const newType = req.body;
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

app.listen(PORT, () => {
  console.log(`✅ Mock server running at http://localhost:${PORT}`);
});
