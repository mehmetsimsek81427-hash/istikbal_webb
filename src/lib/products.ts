export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  emoji: string;
};

export const DEFAULT_PRODUCT_ID = "freya-koltuk-takimi";

const products: Product[] = [
  {
    id: "freya-koltuk-takimi",
    name: "Freya Koltuk Takımı",
    category: "Oturma Odası",
    price: "39.365,00 TL",
    description:
      "Modern çizgileri ve konforlu oturumuyla yaşam alanınıza şıklık katan Freya Koltuk Takımı, İstikbal kalitesiyle uzun yıllar keyifle kullanılabilir.",
    emoji: "🛋️",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id) ?? products[0];
}
