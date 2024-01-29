/**
 * Formats a date string into dd-mm-yyyy ( mm is month's short name e.g. Jan, Feb) and short month plus date.
 * @param {String} dateString - The date in string to convert.
 * @returns {<string>} - An object with date (e.g. 01-Jan-2000) and monthDate (e.g. Jan 20) property.
 */

function formatDate(dateString) {
  const date = new Date(dateString);
  //
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const monthShort = date.toLocaleString("en-US", { month: "short" });
  const year = date.toLocaleString("en-US", { year: "numeric" });
  //
  return {
    date: `${day}-${monthShort}-${year}`,
    monthDate: `${monthShort} ${parseInt(day)}`,
    year,
    monthShort,
    day: parseInt(day),
  };
}

export default formatDate;
