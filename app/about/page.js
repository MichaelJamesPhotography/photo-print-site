"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Backyard Birds NZ</h1>
      <p className="mb-6 text-gray-700 leading-relaxed">
        I'm a passionate bird photographer based in New Zealand, capturing the vibrant life of our unique native birds right from our own backyards. Through Backyard Birds NZ, I offer fine art prints that celebrate the charm and character of local wildlife.
      </p>

      <Link href="/" passHref>
        <Button variant="outline">← Back to Photo Prints</Button>
      </Link>
    </div>
  );
}

