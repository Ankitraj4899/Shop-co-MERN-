export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  // Allows international format: +1 (555) 000-0000 or 10-15 digits
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/.test(phone.trim());
};

export const isValidPostalCode = (postal) => {
  if (!postal || typeof postal !== "string") return false;
  return /^[a-zA-Z0-9\s-]{3,10}$/.test(postal.trim());
};

export const isValidUrlOrPath = (str) => {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("./")
  );
};
