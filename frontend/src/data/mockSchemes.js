/**
 * Mock data for Indian Government Schemes.
 * Shape: { id, name, benefit, why_eligible, documents: [], apply_link, source }
 */
export const mockSchemes = [
  {
    id: 'pm-kisan',
    name: 'PM Kisan Samman Nidhi (PM-KISAN)',
    benefit: 'Direct income support of ₹6,000 per year distributed in three equal four-monthly installments of ₹2,000.',
    why_eligible: 'Small and marginal landholding farmer families with cultivable landholding in their names.',
    documents: [
      'Aadhaar Card',
      'Proof of citizenship / Identity card',
      'Landholding ownership records (Khasra / Khatauni)',
      'Bank Account details linked with Aadhaar'
    ],
    apply_link: 'https://pmkisan.gov.in/',
    source: 'Ministry of Agriculture and Farmers Welfare'
  },
  {
    id: 'pm-awas-yojana',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    benefit: 'Financial assistance and interest subsidies up to ₹2.67 lakh for constructing or purchasing a pucca house.',
    why_eligible: 'Low-income and economically weaker families (EWS/LIG) who do not own a pucca house across India.',
    documents: [
      'Aadhaar Card of all family members',
      'Income Certificate / Salary Slips',
      'Proof of residential address',
      'Bank account passbook copy',
      'Affidavit declaring no pucca house ownership'
    ],
    apply_link: 'https://pmaymis.gov.in/',
    source: 'Ministry of Housing and Urban Affairs'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat - PMJAY',
    benefit: 'Cashless and paperless secondary & tertiary hospital treatment coverage up to ₹5 lakh per family per year.',
    why_eligible: 'Vulnerable and low-income rural and urban households identified through the SECC 2011 database.',
    documents: [
      'Aadhaar Card or Ration Card',
      'PMJAY Family ID or Letter / Ration Card',
      'Active Mobile Number',
      'Valid Government Photo ID'
    ],
    apply_link: 'https://beneficiary.nha.gov.in/',
    source: 'National Health Authority (NHA)'
  },
  {
    id: 'national-scholarship-portal',
    name: 'National Scholarship Portal (NSP)',
    benefit: 'Direct benefit transfer (DBT) of scholarship funds ranging from ₹10,000 to ₹50,000+ per year for tuition and maintenance.',
    why_eligible: 'Meritorious students belonging to SC/ST/OBC/Minority or low-income families enrolled in recognized schools or colleges.',
    documents: [
      'Aadhaar Card / Student ID',
      'Previous academic qualifying marksheets',
      'Valid Family Income Certificate',
      'Bonafide student certificate from educational institution',
      'Student Bank Passbook copy'
    ],
    apply_link: 'https://scholarships.gov.in/',
    source: 'Ministry of Electronics & Information Technology'
  },
  {
    id: 'pm-mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    benefit: 'Collateral-free business loans up to ₹10 lakh categorized into Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh).',
    why_eligible: 'Non-corporate, non-farm small and micro enterprise owners engaged in manufacturing, trading, or service sectors.',
    documents: [
      'Identity Proof (Aadhaar / Voter ID / PAN Card)',
      'Proof of business address and identity registration',
      'Bank account statements for the last 6 months',
      'Estimated business plan or project report',
      'Passport size photographs'
    ],
    apply_link: 'https://www.mudra.org.in/',
    source: 'Department of Financial Services, Ministry of Finance'
  }
];

export default mockSchemes;
