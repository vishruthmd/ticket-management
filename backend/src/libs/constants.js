const DEPARTMENTS = [
  "ISE",
  "CSE",
  "AIML",
  "BT",
  "CV",
  "ME",
  "ETE",
  "EIE",
  "ECE",
  "ASE",
  "IDRC",
  "LIB",
  "CMT",
  "MCA",
  "ADMIN_BLOCK",
  "CHEM",
  "PHY",
  "MATH",
];

const departmentOptions = [
  { value: "CSE", label: "CSE - Computer Science and Engineering" },
  { value: "ISE", label: "ISE - Information Science and Engineering" },
  { value: "AIML", label: "AIML - Artificial Intelligence and Machine Learning" },
  { value: "BT", label: "BT - Biotechnology" },
  { value: "CV", label: "CV - Civil" },
  { value: "ME", label: "ME - Mechanical Engineering" },
  { value: "ETE", label: "ETE - Electronics and Telecommunication Engineering" },
  { value: "EIE", label: "EIE - Electronics and Instrumentation Engineering" },
  { value: "ECE", label: "ECE - Electronics and Communication Engineering" },
  { value: "ASE", label: "ASE - Aerospace Engineering" },
  { value: "IDRC", label: "IDRC - IDRC" },
  { value: "LIB", label: "LIB - Library" },
  { value: "CMT", label: "CMT - Central Maintenance" },
  { value: "MCA", label: "MCA - Masters of Computer Applications" },
  { value: "ADMIN_BLOCK", label: "ADMIN_BLOCK - Admin Block" },
  { value: "CHEM", label: "CHEM - Chemical Engineering" },
  { value: "PHY", label: "PHY - Physics Department" },
  { value: "MATH", label: "MATH - Mathematics Department" },
];

const ROLES = ["TECHNICIAN", "ADMIN", "COORDINATOR"];

const STATUSES = ["OPEN", "IN_PROGRESS", "CLOSED"];

export { DEPARTMENTS, STATUSES, ROLES, departmentOptions };
