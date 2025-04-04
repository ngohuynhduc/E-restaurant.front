import { motion } from "framer-motion";

export const ButtonInteract = ({ children, className, ...props }) => {
  return (
    <motion.button
      className={`px-6 py-3 text-sm text-[16px] bg-[#FF9C00] rounded-md border-[2px] hover:bg-amber-600 text-white cursor-pointer ${className}`}
      whileTap={{ scale: 0.85 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
