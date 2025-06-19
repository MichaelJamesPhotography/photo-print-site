"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import photos from "../data/photos";

export default function PhotoPrintStore() {
  const [cart, setCart] = useState([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);


  const addToCart = (photo) => {
    setCart((prevCart) => [...prevCart, photo]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Michael's Photo Prints</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{photo.title}</h2>
              <p className="text-lg mb-4">${photo.price.toFixed(2)}</p>
              <Button onClick={() => addToCart(photo)}>Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
<div className="mt-12">
  <h2 className="text-2xl font-bold mb-4">Cart</h2>
  {cart.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <>
      <ul className="space-y-2">
        {cart.map((item, index) => (
          <li key={index} className="flex justify-between items-center border-b py-2">
            <div>
              <p>{item.title}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <Button
              variant="ghost"
              className="text-red-500"
              onClick={() =>
                setCart((prevCart) => prevCart.filter((_, i) => i !== index))
              }
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right font-semibold text-lg">
        Total: ${total.toFixed(2)}
      </div>
    </>
  )}
</div>
</div>
  );
}