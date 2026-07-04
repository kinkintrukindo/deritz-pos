"use client";

import Image from "next/image";
import { useState } from "react";
import { updateFeaturedProductsAction } from "@/app/admin/actions";
import type { Product } from "@/lib/types";

interface FeaturedLooksProps {
  products: Product[];
  initialFeaturedIds: string[];
}

export default function FeaturedLooksClient({ products, initialFeaturedIds }: FeaturedLooksProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialFeaturedIds);
  const [orderedProducts, setOrderedProducts] = useState<Product[]>(
    initialFeaturedIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[]
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const unselectedProducts = products.filter(p => !selectedIds.includes(p.id));

  const handleToggleProduct = (productId: string) => {
    if (selectedIds.includes(productId)) {
      // Remove from selection
      const newIds = selectedIds.filter(id => id !== productId);
      setSelectedIds(newIds);
      setOrderedProducts(orderedProducts.filter(p => p.id !== productId));
    } else if (selectedIds.length < 10) {
      // Add to selection
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedIds([...selectedIds, productId]);
        setOrderedProducts([...orderedProducts, product]);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, productId: string) => {
    setDraggedId(productId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetProductId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetProductId) return;

    const draggedIndex = orderedProducts.findIndex(p => p.id === draggedId);
    const targetIndex = orderedProducts.findIndex(p => p.id === targetProductId);

    const newOrdered = [...orderedProducts];
    const [dragged] = newOrdered.splice(draggedIndex, 1);
    newOrdered.splice(targetIndex, 0, dragged);

    setOrderedProducts(newOrdered);
    setSelectedIds(newOrdered.map(p => p.id));
    setDraggedId(null);
  };

  return (
    <form
      action={async (formData) => {
        const newFormData = new FormData();
        orderedProducts.forEach((p, idx) => {
          newFormData.append(`featuredProductIds`, p.id);
        });
        await updateFeaturedProductsAction(newFormData);
      }}
      className="space-y-6 border border-mist p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selected products - with drag reorder */}
        <div>
          <h3 className="text-lg font-medium text-ink mb-4">Selected ({selectedIds.length}/10)</h3>
          <div className="space-y-2 border border-mist p-4 bg-surface rounded min-h-96">
            {orderedProducts.length === 0 ? (
              <p className="text-sm text-graphite italic py-4">No products selected. Select from the right panel.</p>
            ) : (
              orderedProducts.map((product) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, product.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, product.id)}
                  className={`flex items-center gap-3 p-3 border rounded cursor-move transition-all ${
                    draggedId === product.id ? "opacity-50 bg-paper" : "hover:bg-paper"
                  } ${draggedId === product.id ? "border-gold" : "border-mist"}`}
                >
                  <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-ink truncate">{product.name}</div>
                    <div className="text-xs text-graphite">Rp {product.basePriceIdr.toLocaleString()}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleProduct(product.id)}
                    className="text-xs text-red-600 hover:text-red-700 underline flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
          <p className="text-xs text-graphite mt-2">💡 Drag to reorder the featured looks</p>
        </div>

        {/* Available products - select */}
        <div>
          <h3 className="text-lg font-medium text-ink mb-4">Available Products</h3>
          <div className="space-y-2 border border-mist p-4 bg-surface rounded max-h-96 overflow-y-auto">
            {unselectedProducts.length === 0 ? (
              <p className="text-sm text-graphite italic py-4">All published products selected or no products available.</p>
            ) : (
              unselectedProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleToggleProduct(product.id)}
                  className="w-full flex items-center gap-3 p-3 border border-mist rounded hover:bg-paper transition-colors text-left"
                >
                  <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-ink truncate">{product.name}</div>
                    <div className="text-xs text-graphite">Rp {product.basePriceIdr.toLocaleString()}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
      >
        Save Featured Looks
      </button>
    </form>
  );
}
