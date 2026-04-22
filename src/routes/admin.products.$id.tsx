import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  return (
    <div>
      <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
        ← Kembali
      </Link>
      <h1 className="font-display text-3xl font-bold mt-2 mb-6">Edit Produk</h1>
      <ProductForm productId={id} />
    </div>
  );
}
