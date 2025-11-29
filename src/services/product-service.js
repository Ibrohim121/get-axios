import instance from "@/lib/axios";

const productService = {
  // 1. Barcha mahsulotlarni olish (Pagination bilan)
  // params misoli: { limit: 10, offset: 0 } yoki { title: "Laptop" }
  getAllProducts: async (params) => {
    return await instance.get("/products", { params });
  },

  // 2. Bitta mahsulotni ID orqali olish
  getProductById: async (id) => {
    return await instance.get(`/products/${id}`);
  },

  // 3. Yangi mahsulot yaratish
  /* productData shakli:
    {
      "title": "New Product",
      "price": 100,
      "description": "A description",
      "categoryId": 1,
      "images": ["https://placeimg.com/640/480/any"]
    }
  */
  createProduct: async (productData) => {
    return await instance.post("/products/", productData);
  },

  // 4. Mahsulotni o'zgartirish (Update)
  updateProduct: async (id, productData) => {
    return await instance.put(`/products/${id}`, productData);
  },

  // 5. Mahsulotni o'chirish (Delete)
  deleteProduct: async (id) => {
    return await instance.delete(`/products/${id}`);
  },

  // 6. Kategoriya bo'yicha mahsulotlarni olish (Qo'shimcha)
  getProductsByCategory: async (categoryId) => {
    return await instance.get(`/categories/${categoryId}/products`);
  }
};

export default productService;
