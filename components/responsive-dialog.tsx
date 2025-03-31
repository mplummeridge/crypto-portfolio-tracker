"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { AnimatePresence, type PanInfo, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRef, useState } from "react";

interface ResponsiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  role?: string;
  "aria-modal"?: boolean;
  "aria-labelledby"?: string;
}

export default function ResponsiveDialog({
  isOpen,
  onClose,
  children,
  title,
  role,
  "aria-modal": ariaModal,
  "aria-labelledby": ariaLabelledby,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [isDragging, setIsDragging] = useState(false);
  const dragConstraintsRef = useRef(null);

  // Handle drag end for closing the panel
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    // If user drags down more than 100px, close the panel
    if (info.offset.y > 100) {
      onClose();
    }
    setIsDragging(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="sm:max-w-[450px] p-0 gap-0"
          role={role}
          aria-modal={ariaModal}
          aria-labelledby={ariaLabelledby}
        >
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
            <div className="px-6 py-4 flex items-center justify-between border-b">
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close dialog</span>
              </Button>
            </div>
          </div>
          <div className="px-6 py-4">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={dragConstraintsRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            role={role}
            aria-modal={ariaModal}
            aria-labelledby={ariaLabelledby}
          >
            <motion.div
              className="flex items-center justify-center h-10 cursor-grab active:cursor-grabbing"
              whileHover={{ opacity: 0.8 }}
              whileTap={{ scale: 0.97 }}
              role="separator"
              aria-orientation="horizontal"
              aria-label="Drag handle"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </motion.div>
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
              <div className="px-4 py-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-muted"
                  aria-label="Close dialog"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Close dialog</span>
                </Button>
              </div>
            </div>
            <div className="px-4 pb-8 pt-2 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
