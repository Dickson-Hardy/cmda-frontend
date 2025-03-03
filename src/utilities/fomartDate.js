/**
 * Formats a date string into dd-mm-yyyy ( mm is month's short name e.g. Jan, Feb) and short month plus date.
 * @param {String} dateString - The date in string to convert.
 * @returns {Object} - An object with date (e.g. 01-Jan-2000), monthDate (e.g. Jan 20), time (e.g. 12:34 PM),
 *                    and other properties such as year, monthShort, day, hours, minutes, am/pm.
 */
function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.toLocaleString("en-US", { day: "numeric" });
  const monthShort = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const ampm = hours > 12 ? "pm" : "am";
  const _date = `${monthShort} ${day}, ${year}`;

  return {
    date: _date,
    time,
    dateTime: `${_date} || ${time}`,
  };
}

export const eighteenYrsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  .toISOString()
  .split("T")[0];

export const fourteenYrsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 14))
  .toISOString()
  .split("T")[0];

export default formatDate;
