import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ShaishaArts database...");

  // Create categories
  const jewelry = await prisma.category.create({
    data: { name: "Jewelry", slug: "jewelry" },
  });
  const antiTarnish = await prisma.category.create({
    data: { name: "Anti-Tarnish", slug: "anti-tarnish", parentId: jewelry.id },
  });
  const charms = await prisma.category.create({
    data: { name: "Charms", slug: "charms" },
  });
  const keychains = await prisma.category.create({
    data: { name: "Keychains", slug: "keychains", parentId: charms.id },
  });
  const macrame = await prisma.category.create({
    data: { name: "Macrame", slug: "macrame" },
  });
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories" },
  });
  const stationery = await prisma.category.create({
    data: { name: "Stationery", slug: "stationery" },
  });
  const hampers = await prisma.category.create({
    data: { name: "Hampers", slug: "hampers" },
  });

  console.log("✅ Categories created");

  // Sample product images (using Unsplash placeholder images)
  const productData = [
    {
      name: "Anti-Tarnish Necklace",
      slug: "anti-tarnish-necklace",
      categoryId: antiTarnish.id,
      price: 499,
      description: "Elegant and stylish anti-tarnish necklace that stays as good as new for a long time. Perfect for everyday wear and special occasions.",
      materials: "Anti-tarnish coated metal, Premium quality finish",
      careInstructions: "Keep away from water and perfume. Store in a dry place.",
      stock: 15,
      images: JSON.stringify(["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500", "https://images.unsplash.com/photo-1515562141589-67f0d727b750?w=500"]),
      isFeatured: true,
      isBestseller: true,
    },
    {
      name: "Anti-Tarnish Bracelet",
      slug: "anti-tarnish-bracelet",
      categoryId: antiTarnish.id,
      price: 399,
      description: "Beautiful anti-tarnish bracelet with delicate design. Handcrafted with love for a premium feel.",
      materials: "Anti-tarnish coated metal",
      careInstructions: "Avoid contact with chemicals. Wipe with soft cloth.",
      stock: 20,
      images: JSON.stringify(["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500"]),
      isFeatured: true,
      isBestseller: false,
    },
    {
      name: "Phone Charms",
      slug: "phone-charms",
      categoryId: charms.id,
      price: 199,
      description: "Cute and trendy phone charms to add personality to your phone. Handmade with premium beads and materials.",
      materials: "Beads, String, Metal clips",
      stock: 30,
      images: JSON.stringify(["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500"]),
      isFeatured: true,
      isBestseller: true,
    },
    {
      name: "Bag Charms",
      slug: "bag-charms",
      categoryId: charms.id,
      price: 249,
      description: "Adorable bag charms to make your bags stand out. Each piece is uniquely handcrafted.",
      materials: "Beads, Tassels, Metal hardware",
      stock: 25,
      images: JSON.stringify(["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"]),
      isFeatured: false,
      isBestseller: true,
    },
    {
      name: "Keychains / Key Rings",
      slug: "keychains-key-rings",
      categoryId: keychains.id,
      price: 149,
      description: "Handmade keychains that make perfect gifts. Available in various designs and colors.",
      materials: "Macrame cord, Beads, Metal keyring",
      stock: 40,
      images: JSON.stringify(["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500"]),
      isFeatured: true,
      isBestseller: false,
    },
    {
      name: "Macrame Car Hanging",
      slug: "macrame-car-hanging",
      categoryId: macrame.id,
      price: 349,
      description: "Beautiful macrame car hanging to add a boho touch to your car. Handcrafted with natural cotton cord.",
      materials: "Natural cotton macrame cord, Wooden beads",
      careInstructions: "Dust gently. Keep away from direct sunlight.",
      stock: 12,
      images: JSON.stringify(["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"]),
      isFeatured: true,
      isBestseller: true,
    },
    {
      name: "Macrame Key Ring",
      slug: "macrame-key-ring",
      categoryId: macrame.id,
      price: 179,
      description: "Boho-style macrame keyring. Perfect accessory or gift item.",
      materials: "Macrame cord, Metal ring",
      stock: 35,
      images: JSON.stringify(["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500"]),
      isFeatured: false,
      isBestseller: false,
    },
    {
      name: "Macrame Necklace",
      slug: "macrame-necklace",
      categoryId: macrame.id,
      price: 299,
      description: "Handcrafted macrame necklace with bohemian charm. Lightweight and comfortable to wear.",
      materials: "Natural macrame cord, Gemstone beads",
      stock: 18,
      images: JSON.stringify(["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"]),
      isFeatured: true,
      isBestseller: false,
    },
    {
      name: "Scrunchies",
      slug: "scrunchies",
      categoryId: accessories.id,
      price: 99,
      description: "Soft and stylish scrunchies in beautiful colors. Gentle on your hair.",
      materials: "Satin, Velvet, Cotton fabric",
      stock: 50,
      images: JSON.stringify(["https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500"]),
      isFeatured: false,
      isBestseller: true,
    },
    {
      name: "Clutchers",
      slug: "clutchers",
      categoryId: accessories.id,
      price: 149,
      description: "Trendy hair clutchers in various designs. Perfect for everyday use.",
      materials: "Acrylic, Metal",
      stock: 30,
      images: JSON.stringify(["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"]),
      isFeatured: false,
      isBestseller: false,
    },
    {
      name: "Diaries",
      slug: "diaries",
      categoryId: stationery.id,
      price: 399,
      description: "Beautifully handmade diaries with unique cover designs. Perfect for journaling or gifting.",
      materials: "Handmade paper, Fabric cover",
      stock: 15,
      images: JSON.stringify(["https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500"]),
      isFeatured: true,
      isBestseller: false,
    },
    {
      name: "Gift Hampers",
      slug: "gift-hampers",
      categoryId: hampers.id,
      price: 999,
      description: "Curated gift hampers with a selection of handmade items. Perfect for birthdays, festivals, and special occasions.",
      materials: "Assorted handmade items, Premium gift box",
      stock: 10,
      images: JSON.stringify(["https://images.unsplash.com/photo-1549465220-1a8b9238f519?w=500"]),
      isFeatured: true,
      isBestseller: true,
    },
  ];

  for (const product of productData) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Products created");

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_SEED_PASSWORD || "ShaishaArts@2024",
    10
  );
  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_SEED_EMAIL || "owner@shaishaarts.com",
      passwordHash: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Admin user created");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
