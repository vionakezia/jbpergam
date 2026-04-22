import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div>
      <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
        ← Kembali
      </Link>
      <h1 className="font-display text-3xl font-bold mt-2 mb-6">Tambah Produk Baru</h1>
      <ProductForm />
    </div>
  );
}
