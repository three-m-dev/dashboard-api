type FormatType = "text" | "email" | "phone" | "currency";

class Formatter {
  static format(input: string, type: FormatType): string {
    switch (type) {
      case "text":
        return Formatter.formatText(input);
      case "email":
        return Formatter.formatEmail(input);
      case "phone":
        return Formatter.formatPhone(input);
      case "currency":
        return Formatter.formatCurrency(input);
      default:
        throw new Error("Unsupported format type");
    }
  }

  private static formatText(text: string): string {
    return text
      .trim()
      .replace(/[^\w\s]/gi, "")
      .toLowerCase();
  }

  private static formatEmail(email: string): string {
    const trimmedEmail = email.trim();
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      throw new Error("Invalid email format");
    }
    return trimmedEmail.toLowerCase();
  }

  private static formatPhone(phone: string): string {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }

  private static formatCurrency(currency: string): string {
    const number = parseFloat(currency.replace(/[^0-9-.]/g, ""));
    if (isNaN(number)) {
      return currency;
    }
    return number.toFixed(2);
  }
}
