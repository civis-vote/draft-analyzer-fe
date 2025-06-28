const documentTypes = [
  {
    "doc_type_id": 1,
    "doc_type_name": "Consultation",
    "description": "Documents issued for public or stakeholder feedback before finalizing a policy.",
    "created_by": "Admin",
    "created_on": "2025-06-07T17:46:44.022931",
    "updated_by": null,
    "updated_on": "2025-06-07T17:46:44.022931"
  },
  {
    "doc_type_id": 3,
    "doc_type_name": "Amendment",
    "description": "Changes or modifications made to existing policies or laws.",
    "created_by": "Admin",
    "created_on": "2025-06-07T17:48:32.073516",
    "updated_by": null,
    "updated_on": "2025-06-07T17:48:32.073516"
  },
  {
    "doc_type_id": 2,
    "doc_type_name": "Law Order",
    "description": "Legally binding government orders or laws enacted to enforce specific regulations.",
    "created_by": "Admin",
    "created_on": "2025-06-07T17:48:11.311810",
    "updated_by": "Bhagwan",
    "updated_on": null
  }
];

const assessmentPrompts = [
  {
    title: "Does the Draft Clearly Explain Why and What?",
    description:
      "This area evaluates how well the policy document explains its purpose, objectives, and structure.",
    prompts: [
      {
        category: "Justification",
        question:
          "Is the need for the policy well-founded? Does the policy provide relevant context, data, or rationale for why it is needed?",
      },
      {
        category: "Essential Elements",
        question:
          "Are the main objectives, provisions, or changes the policy introduces clearly stated? Does it specify what the policy aims to achieve?",
      },
      {
        category: "Comprehension",
        question:
          "Is the policy text accessible, logically structured, and free of contradictions? Does it use clear language, headings, or summaries that aid understanding?",
      },
    ],
  },
  {
    title: "Does the Draft Thoroughly Assess the Impact?",
    description:
      "This area evaluates the depth and breadth of impact analysis in the policy document.",
    prompts: [
      {
        category: "Problem Identification",
        question:
          "Does the policy define the root cause or specific issue it aims to address? Are challenges or market failures clearly outlined?",
      },
      {
        category: "Evidence for the Problem",
        question:
          "Does the policy provide data, research, or statistics to illustrate the problem? Are references or external studies cited?",
      },
      {
        category: "Cost-Benefit Analysis:",
        question:
          "Does the policy include an economic or financial appraisal of its measures? Does it weigh potential benefits against costs or risks?",
      },
      {
        category: "Alternatives",
        question:
          "Does the draft discuss other policy models or approaches? Is there a reason the chosen approach is deemed preferable?",
      },
      {
        category: "Stakeholder Impacts",
        question:
          "How does the policy affect regulated entities, intended beneficiaries, and indirect stakeholders like communities or supply-chain actors?",
      },
      {
        category: "Environmental Considerations",
        question:
          "Does the policy mention potential environmental impacts? Does it provide mitigation measures?",
      },
      {
        category: "Time Frames",
        question:
          "Are there clear timelines for implementation or achieving policy goals? Does it distinguish between short-, medium-, and long-term impacts?",
      },
      {
        category: "Continuous Evaluation",
        question:
          "Is there a mechanism for ongoing monitoring or iterative review? Are oversight committees or annual reporting procedures mentioned?",
      },
      {
        category: "Territorial Impact",
        question:
          "Does the policy address geographic considerations (rural vs. urban, different zones or clusters)? Are regional disparities or localized impacts accounted for?",
      },
    ],
  },
  {
    title: "Does the Draft Enable Meaningful Public Participation?",
    description:
      "This area evaluates how well the policy enables and encourages public feedback and participation.",
    prompts: [
      {
        category: "Feedback",
        question:
          "Consultation Duration: Is there a defined window (e.g., 30 days) for public feedback? Does the policy specify timelines or deadlines for submitting comments?",
      },
      {
        category: "Feedback",
        question:
          "Feedback Collection: Are there multiple avenues for providing feedback (online, offline, in-person)? Does the policy specify how feedback will be gathered, documented, or addressed?",
      },
      {
        category: "Accessibility",
        question:
          "Translations: Does the policy mention translations into local/regional languages? Are accessibility measures for disabled or non-English-speaking stakeholders discussed?",
      },
    ],
  },
];

const assessmentAreas = [
  {
    assessment_id: 1,
    name: 'Clarity',
    description: 'Clarity of the document',
    created_by: 'Admin',
    created_on: '2025-06-07T17:46:44.022931',
    updated_by: null,
    updated_on: '2025-06-07T17:46:44.022931'
  },
  {
    assessment_id: 2,
    name: 'Impact',
    description: 'Impact assessment',
    created_by: 'Admin',
    created_on: '2025-06-07T17:48:32.073516',
    updated_by: null,
    updated_on: '2025-06-07T17:48:32.073516'
  }
];

uploaded_document = {
      "doc_id": "feee3807cadc5677d4fd630076e876a369253b1b39140f8caf6c256f370214bf_2",
      "file_name": "New Draft File.pdf",
      "file_type": "application/pdf",
      "number_of_pages": 12,
      "doc_size_kb": 568
    };

module.exports = {
  documentTypes,
  assessmentPrompts,
  uploaded_document,
  assessmentAreas
};