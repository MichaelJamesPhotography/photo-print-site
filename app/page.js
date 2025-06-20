"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import photos from "../data/photos";
import Link from "next/link";

export default function PhotoPrintStore() {
  const [hasMounted, setHasMounted] = useState(false);
  const [cart, setCart] = useState({});
  const [sortOption, setSortOption] = useState("price-asc");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const categories = Array.from(new Set(photos.map((photo) => photo.category)));

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, hasMounted]);

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addToCart = (photo) => {
    setCart((prevCart) => {
      const existing = prevCart[photo.id];
      return {
        ...prevCart,
        [photo.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { ...photo, quantity: 1 },
      };
    });
  };

  const getSortedPhotos = () => {
    return photos
      .filter((photo) =>
        filterCategory === "all" ? true : photo.category === filterCategory
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!hasMounted) return null;

  const sortedPhotos = getSortedPhotos();

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="w-full px-6 py-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-2xl font-bold">MichaelJames Photography</h1>
        <Link href="/about">
          <Button variant="outline" className="rounded-full px-4 py-1">
            About Me
          </Button>
        </Link>
      </nav>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              className="border px-2 py-1 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="title-asc">Title (A–Z)</option>
              <option value="title-desc">Title (Z–A)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="font-medium">
              Filter by:
            </label>
            <select
              id="filter"
              className="border px-2 py-1 rounded"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedPhotos.map((photo, index) => (
            <Card
              key={photo.id}
              className="rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl hover:ring-2 hover:ring-gray-300"
            >
              <CardContent
                onClick={() => setSelectedPhotoIndex(index)}
                className="p-0 rounded-2xl border overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02] bg-white cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-64 object-cover hover:opacity-90 transition duration-300"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold">{photo.title}</h2>
                  <p className="text-md">${photo.price.toFixed(2)}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(photo);
                    }}
                    className="w-full mt-2"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AnimatePresence>
          {selectedPhotoIndex !== null && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhotoIndex(null)}
            >
              <motion.div
                className="bg-white text-black p-4 sm:p-6 rounded-xl max-w-3xl w-[90%] shadow-lg relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={sortedPhotos[selectedPhotoIndex].src}
                  alt={sortedPhotos[selectedPhotoIndex].title}
                  className="w-full h-auto rounded-md mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{sortedPhotos[selectedPhotoIndex].title}</h2>
                <p className="text-lg mb-4">${sortedPhotos[selectedPhotoIndex].price.toFixed(2)}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setSelectedPhotoIndex(null)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      addToCart(sortedPhotos[selectedPhotoIndex]);
                      setSelectedPhotoIndex(null);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Cart</h2>
          {Object.values(cart).length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-2">
                <AnimatePresence>
                  {Object.values(cart).map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      layout
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div>
                        <p>{item.title}</p>
                        <p className="text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setCart((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...item,
                                quantity: Math.max(item.quantity - 1, 0),
                              },
                            }))
                          }
                        >
                          –
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setCart((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...item,
                                quantity: item.quantity + 1,
                              },
                            }))
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => {
                            const newCart = { ...cart };
                            delete newCart[item.id];
                            setCart(newCart);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <motion.div
                key={total}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 text-right font-semibold text-lg"
              >
                Total: ${total.toFixed(2)}
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
