export const formatPrice = (price) => {
  return price
    ? price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";
};

export function parseCurrency(amount) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount || 0);
}

export function calculateAge(dateOfBirth) {
  // check if date is in dd-mm-yyyy format and convert to yyyy-mm-dd format
  const dob = new Date(
    dateOfBirth.slice(0, 4).includes("-") ? dateOfBirth.split("-").reverse().join("-") : dateOfBirth
  );
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();

  // Check if the birthday has occurred this year
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
