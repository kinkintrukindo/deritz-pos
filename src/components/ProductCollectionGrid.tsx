"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

type SortOption = "featured" | "name" | "price-low" | "price-high";

interface ProductCollectionGridProps {
  products: Product[];
}

export function ProductCollectionGrid({ products }: ProductCollectionGridProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "featured":
        result.sort((a, b) => {
          const aFeatured = a.isNew || a.isPromo ? 1 : 0;
          const bFeatured = b.isNew || b.isPromo ? 1 : 0;
          return bFeatured - aFeatured;
        });
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        result.sort((a, b) => a.basePriceIdr - b.basePriceIdr);
        break;
      case "price-high":
        result.sort((a, b) => b.basePriceIdr - a.basePriceIdr);
        break;
    }

    return result;
  }, [products, search, sortBy]);

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-mist px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="text-xs tracking-wide-label uppercase text-graphite flex items-center">
            Sort by:
          </label>
          {(["featured", "name", "price-low", "price-high"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`text-xs tracking-wide-label uppercase px-3 py-1.5 border rounded transition-colors ${
                sortBy === option
                  ? "bg-ink text-white border-ink"
                  : "bg-paper border-mist text-graphite hover:border-ink hover:text-ink"
              }`}
            >
              {option === "featured"
                ? "Featured"
                : option === "name"
                  ? "Name (A-Z)"
                  : option === "price-low"
                    ? "Cheapest"
                    : "Most Expensive"}
            </button>
          ))}
        </div>

        {search && (
          <p className="text-xs text-graphite">
            Found {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-graphite text-center py-12">
          {search ? "No pieces match your search." : "No pieces found in this collection yet."}
        </p>
      )}
    </div>
  );
}
