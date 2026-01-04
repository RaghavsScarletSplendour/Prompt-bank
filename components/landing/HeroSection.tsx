"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export function HeroSection() {
  const router = useRouter();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
          Save, Organize, and Reuse Your Best Prompts
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your personal library for AI prompts. Search semantically, organize by
          category, and access anywhere.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => router.push("/sign-in")}>
            Get Started
          </Button>
          <Button variant="secondary" size="lg" onClick={scrollToFeatures}>
            Learn More
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
