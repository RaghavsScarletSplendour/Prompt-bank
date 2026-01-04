"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export function CTASection() {
  const router = useRouter();

  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Start Building Your Prompt Library Today
        </h2>
        <p className="text-gray-400 mb-8">
          Join Promptr and never lose a great prompt again.
        </p>
        <Button variant="primary" size="lg" onClick={() => router.push("/sign-in")}>
          Sign Up Free
        </Button>
        <p className="mt-6 text-gray-500 text-sm">
          <a
            href="https://x.com/raghavbajoria11"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Follow me on X @raghavbajoria11
          </a>
        </p>
      </motion.div>
    </section>
  );
}
