import { Button } from "@/components/ui/button";
import productService from "@/services/product-service";
import { useState } from "react";
import { useEffect } from "react";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts({ limit: 10, offset: 0 });
      setProducts(response);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {JSON.stringify(products)}
      <Button>Click</Button>
    </div>
  );
}
