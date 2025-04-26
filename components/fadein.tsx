// components/FadeIn.tsx
"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 3 },
  },
};

export default function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeVariants}
    >
      {children}
    </motion.div>
  );
}
