const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { documentTypes, assessmentPrompts, uploaded_document, assessmentAreas } = require('./document-types');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Use multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Endpoint
app.post('/api/upload_policy', upload.single('file'), (req, res) => {
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
      new_document: uploaded_document
    });
  }, 100); // 1 sec delay
});

// Create Document Endpoint
app.post('/api/create_document', (req, res) => {
  const newDocument = req.body;
  if (!newDocument) return res.status(400).json({ error: "Document data is required" });

  setTimeout(() => {
    res.json(newDocument);
  }, 100); // 1 sec delay
});

// Summarize Endpoint
app.post('/api/summarize', (req, res) => {
  const { docId } = req.body;
  // if (!docId) return res.status(400).json({ error: "docId is required" });

  setTimeout(() => {
    // if (Math.random() < 0.2) {
    //   return res.status(500).json({ error: "Summarization failed. Try again later." });
    // }

    res.json({
      summaryPoints: [
        "Reducing carbon emissions by 40% by 2035",
        "Implementing green building standards",
        "Expanding public transportation networks",
        "Creating community green spaces near residential areas",
        "Developing water conservation infrastructure"
      ],
      summaryText:
        "This mock summary shows key goals and implementation phases. It emphasizes inclusiveness, equity, and infrastructure development phased over time.",
    });
  }, 2000); // 2 sec delay
});

app.post('/api/evaluations', (req, res) => {
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

app.post('/api/score', (req, res) => {
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

// Document type endpoints
app.get('/api/document_types', (req, res) => {
  res.json(documentTypes);
});

app.get('/api/document_types/:typeId/assessments', (req, res) => {
  const { typeId } = req.params;
  //const typeAssessments = assessmentPrompts[typeId] || [];
  res.json(assessmentPrompts);
});

// Get prompts for a specific assessment
app.get('/api/assessments/:assessmentId/prompts', (req, res) => {
  const { assessmentId } = req.params;
  let prompts = [];

  // Search through all document types for the assessment
  Object.values(assessmentPrompts).forEach(assessments => {
    const assessment = assessments.find(a => a.id === parseInt(assessmentId));
    if (assessment) {
      prompts = assessment.prompts;
    }
  });

  res.json(prompts);
});

// Assessment Areas endpoints
app.get('/api/assessment_areas', (req, res) => {
  // Return a mock list of assessment areas
  res.json(assessmentAreas);
});

app.get('/api/assessment_areas/:id', (req, res) => {
  // Return a single mock assessment area
  res.json({
    assessment_id: Number(req.params.id),
    name: 'Clarity',
    description: 'Clarity of the document',
    created_by: 'Admin',
    created_on: new Date().toISOString(),
    updated_by: null,
    updated_on: null
  });
});

// Document Types CRUD
app.post('/api/document_types', (req, res) => {
  const doc = req.body;
  doc.doc_type_id = Math.floor(Math.random() * 10000);
  // Accept and echo back assessments array if provided
  doc.assessments = doc.assessments || [];
  res.json(doc);
});
app.put('/api/document_types/:id', (req, res) => {
  const doc = req.body;
  doc.doc_type_id = Number(req.params.id);
  // Accept and echo back assessments array if provided
  doc.assessments = doc.assessments || [];
  res.json(doc);
});
app.delete('/api/document_types/:id', (req, res) => {
  res.status(204).send();
});

// Assessment Areas CRUD
app.post('/api/assessment_areas', (req, res) => {
  const area = req.body;
  area.assessment_id = Math.floor(Math.random() * 10000);
  res.json(area);
});
app.put('/api/assessment_areas/:id', (req, res) => {
  const area = req.body;
  area.assessment_id = Number(req.params.id);
  res.json(area);
});
app.delete('/api/assessment_areas/:id', (req, res) => {
  res.status(204).send();
});

// Prompts CRUD
app.post('/api/prompt', (req, res) => {
  const prompt = req.body;
  prompt.prompt_id = Math.floor(Math.random() * 10000);
  res.json(prompt);
});
app.put('/api/prompt/:id', (req, res) => {
  const prompt = req.body;
  prompt.prompt_id = Number(req.params.id);
  res.json(prompt);
});
app.delete('/api/prompt/:id', (req, res) => {
  res.status(204).send();
});
app.get('/api/prompt/:id', (req, res) => {
  res.json({
    prompt_id: Number(req.params.id),
    question: 'Is the policy clear?',
    category: 'Clarity',
    created_by: 'Admin',
    created_on: new Date().toISOString(),
    updated_by: null,
    updated_on: null
  });
});
app.get('/api/prompt', (req, res) => {
  res.json([
    {
      prompt_id: 1,
      criteria: 'Clarity',
      question: 'Is the policy clear?',
      created_by: 'Admin',
      created_on: new Date().toISOString(),
      updated_by: null,
      updated_on: null
    },
    {
      prompt_id: 2,
      criteria: 'Impact',
      question: 'Does the policy address impact?',
      created_by: 'Admin',
      created_on: new Date().toISOString(),
      updated_by: null,
      updated_on: null
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Mock server running at http://localhost:${PORT}`);
});
