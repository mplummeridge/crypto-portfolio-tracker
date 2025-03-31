"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface AddHoldingButtonProps {
  onClick: () => void;
}

export default function AddHoldingButton({ onClick }: AddHoldingButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full md:w-auto"
    >
      <Button
        onClick={onClick}
        className="w-full h-14 md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base"
        size="lg"
        aria-label="Add new cryptocurrency holding"
      >
        <span className="h-6 w-6 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
          ⚡
        </span>
        Add Holding
      </Button>
    </motion.div>
  );
}
