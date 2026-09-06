export const BRAND = {
  name: "SHRI Online Gift Shop",
  tagline: "Gifts That Create Memories",
  city: "Erode",
  address: "21, Kamatchi Amman Kovil Street, Karungalpalayam, Erode - 638003",
  phones: ["9042770400", "9042870400"],
  facebook: "https://www.facebook.com/Shrionlinegiftshoperode",
  handle: "Shrionlinegiftshoperode",
};

export const CATEGORIES = [
  "Birthday",
  "Anniversary",
  "Surprise",
  "Kids",
  "All Occasion",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function formatPrice(price: number) {
  return `₹${Number(price).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
}

export function orderMessage(opts: { name: string; price: number; quantity: number }) {
  return `Hello ${BRAND.name}, I would like to order:\n\nProduct: ${opts.name}\nPrice: ${formatPrice(opts.price)}\nQuantity: ${opts.quantity}\n\nPlease confirm availability and delivery.`;
}
