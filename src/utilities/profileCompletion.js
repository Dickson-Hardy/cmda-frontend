const BASE_FIELDS = [
  ["avatarUrl", "profile photo"],
  ["phone", "phone number"],
  ["gender", "gender"],
  ["region", "region"],
  ["bio", "bio"],
];

const ROLE_FIELDS = {
  Student: [
    ["admissionYear", "admission year"],
    ["yearOfStudy", "year of study"],
  ],
  Doctor: [
    ["licenseNumber", "licence number"],
    ["specialty", "specialty"],
    ["yearsOfExperience", "years of experience"],
  ],
  GlobalNetwork: [
    ["specialty", "specialty"],
    ["yearsOfExperience", "years of experience"],
  ],
};

const hasValue = (value) =>
  value !== null && value !== undefined && (typeof value !== "string" || value.trim().length > 0);

export const missingProfileFields = (user) => {
  if (!user) return [];
  return [...BASE_FIELDS, ...(ROLE_FIELDS[user.role] || [])]
    .filter(([key]) => !hasValue(user[key]))
    .map(([, label]) => label);
};
