export const formatCurrency = (amount = 0, currency) => {
  const formatter = new Intl.NumberFormat("en-NG", {
    currency: currency || "NGN",
    style: "currency",
  });

  return formatter.format(+amount);
};

export const formatProductPrice = (prod = {}, role) => {
  return formatCurrency(
    role === "GlobalNetwork" ? prod?.priceUSD : prod?.price,
    role === "GlobalNetwork" ? "USD" : "NGN"
  );
};
