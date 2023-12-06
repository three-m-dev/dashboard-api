const formatWebsiteUrl = (website: string): string => {
  if (!website || !website.trim()) {
    throw new Error("Invalid input: Website URL is empty");
  }

  const urlPattern = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9./]+$/;
  if (!urlPattern.test(website)) {
    throw new Error("Invalid input: Website URL is not in a proper format");
  }

  let domain = website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
  return `https://${domain}`;
};

const formatEmail = (email: string): string => {
  if (!email || !email.trim()) {
    throw new Error("Invalid input: Email is empty");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new Error("Invalid input: Email is not in a proper format");
  }

  return email.trim().toLowerCase();
};

const formatPhoneNumber = (phone: string): string => {
  if (!phone || !phone.trim()) {
    throw new Error("Invalid input: Phone number is empty");
  }

  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.length < 10) {
    throw new Error("Invalid input: Phone number is too short");
  }

  if (cleaned.length === 10) {
    cleaned = `+1${cleaned}`;
  }

  return cleaned;
};

const formatUUID = (uuid: string): string => {
  if (!uuid || !uuid.trim()) {
    throw new Error("Invalid input: UUID is empty");
  }

  if (!uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
    throw new Error("Invalid input: UUID is not in a proper format");
  }

  return uuid;
};

const formatCurrency = (amount: number, currencySymbol: string = "$", decimalPlaces: number = 2): string => {
  if (isNaN(amount)) {
    throw new Error("Invalid input: Amount is not a number");
  }

  return `${currencySymbol}${amount.toFixed(decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

const formatString = (input: string, caseType: "upper" | "lower" | "title" = "lower"): string => {
  if (!input || !input.trim()) {
    throw new Error("Invalid input: String is empty");
  }

  let formattedString = input.trim();

  switch (caseType) {
    case "upper":
      formattedString = formattedString.toUpperCase();
      break;
    case "lower":
      formattedString = formattedString.toLowerCase();
      break;
    case "title":
      formattedString = formattedString.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      break;
  }

  return formattedString;
};

export { formatWebsiteUrl, formatEmail, formatPhoneNumber, formatUUID, formatCurrency, formatString };
