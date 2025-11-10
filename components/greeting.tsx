import { motion } from "framer-motion";
import { BookOpenIcon } from "./icons";

export const Greeting = () => {
  return (
    <div
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col items-center justify-center gap-8 px-4 md:mt-16 md:px-8"
      key="overview"
    >
      <div className="text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-2xl md:text-3xl"
          exit={{ opacity: 0, y: 10 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.5 }}
        >
          Welcome to SuperSummary Lesson Planner!
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-base text-zinc-500 md:text-lg"
          exit={{ opacity: 0, y: 10 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.6 }}
        >
          Generate custom lesson plans from literary study guides
        </motion.div>
      </div>

      <motion.button
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-center gap-3 rounded-xl border-2 border-primary bg-primary px-8 py-4 font-semibold text-lg text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        onClick={() => {
          // Find and click the guide selector trigger button
          const lessonPlanButton = document.querySelector(
            '[data-guide-selector-trigger="true"]'
          ) as HTMLButtonElement;

          if (lessonPlanButton) {
            lessonPlanButton.click();
          }
        }}
        transition={{ delay: 0.7 }}
        type="button"
      >
        <BookOpenIcon />
        Generate Lesson Plan
      </motion.button>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground text-sm"
        exit={{ opacity: 0, y: 10 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.8 }}
      >
        Choose from guides by Kate Chopin, bell hooks, and Jonathan Franzen
      </motion.div>
    </div>
  );
};
