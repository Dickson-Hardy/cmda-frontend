// Conference-specific constants for the frontend
export const conferenceTypes = [
  { value: "National", label: "National Conference" },
  { value: "Zonal", label: "Zonal Conference" },
  { value: "Regional", label: "Regional Conference" },
];

export const conferenceZones = [
  { value: "Western", label: "Western Zone" },
  { value: "Eastern", label: "Eastern Zone" },
  { value: "Northern", label: "Northern Zone" },
];

export const conferenceRegions = [
  { value: "Americas & Caribbean", label: "Americas & Caribbean Region" },
  { value: "UK/Europe", label: "UK/Europe Region" },
  { value: "Australia/Asia", label: "Australia/Asia Region" },
  { value: "Middle East", label: "Middle East Region" },
  { value: "Africa", label: "Africa Region" },
];

export const registrationPeriods = [
  { value: "Regular", label: "Regular Registration" },
  { value: "Late", label: "Late Registration" },
];

// Enhanced member groups with new doctor categories
export const memberGroups = [
  { value: "Student", label: "Students" },
  { value: "Doctor_0_5_Years", label: "Doctors (0-5 years)" },
  { value: "Doctor_Above_5_Years", label: "Doctors (Above 5 years)" },
  { value: "Doctor", label: "All Doctors (Legacy)" }, // For backward compatibility
  { value: "GlobalNetwork", label: "Global Network" },
];

// Helper function to get display-friendly member group names
export const getMemberGroupDisplayName = (group) => {
  const groupMap = {
    Student: "Students",
    Doctor_0_5_Years: "Doctors (0-5 years)",
    Doctor_Above_5_Years: "Doctors (Above 5 years)",
    Doctor: "All Doctors",
    GlobalNetwork: "Global Network",
  };
  return groupMap[group] || group;
};

// Helper function to determine if user can see conference
export const canUserSeeConference = (userRole, userExperience, conferenceMemberGroups) => {
  if (!Array.isArray(conferenceMemberGroups)) return false;

  // Determine user's category
  let userCategory;
  if (userRole === "Student") {
    userCategory = "Student";
  } else if (userRole === "GlobalNetwork") {
    userCategory = "GlobalNetwork";
  } else if (userRole === "Doctor") {
    // Determine doctor category based on experience
    if (userExperience && (userExperience.includes("0 - 5") || userExperience.includes("0-5"))) {
      userCategory = "Doctor_0_5_Years";
    } else if (userExperience && (userExperience.includes("5 Years and Above") || userExperience.includes("Above 5"))) {
      userCategory = "Doctor_Above_5_Years";
    } else {
      userCategory = "Doctor_0_5_Years"; // Default to junior for unclear experience
    }
  }

  // Check if user's category is in the conference's member groups
  if (conferenceMemberGroups.includes(userCategory)) {
    return true;
  }
  // Check for legacy support - if conference includes old DOCTOR enum
  // and user is any doctor category, allow access
  if (
    conferenceMemberGroups.includes("Doctor") &&
    (userCategory === "Doctor_0_5_Years" || userCategory === "Doctor_Above_5_Years")
  ) {
    return true;
  }

  return false;
};

// Zone mapping for different audience types
export const zonalConferenceTypes = {
  Student: "Student Zonal Conference",
  Doctor_0_5_Years: "Junior Doctor Zonal Conference",
  Doctor_Above_5_Years: "Senior Doctor Zonal Conference",
  Doctor: "Doctor Zonal Conference",
  GlobalNetwork: "Global Network Conference",
};
