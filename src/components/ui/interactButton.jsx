import { motion } from "framer-motion";

export const ButtonInteract = ({ children, className, disabled, ...props }) => {
  return (
    <motion.button
      className={`${className} px-6 py-3 text-sm text-[16px] bg-[#FF9C00] rounded-md border-[2px] hover:bg-amber-600 text-white cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
      disabled={disabled}
      whileTap={{ scale: 0.85 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
