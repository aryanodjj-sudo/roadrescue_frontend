import { motion } from "framer-motion";

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-full px-6 py-3 transition-colors duration-200";

  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    accent: "bg-accent-500 text-white hover:bg-accent-600",
    outline: "border-2 border-slate-200 text-slate-800 hover:border-primary-600 hover:text-primary-600",
    ghost: "text-slate-700 hover:text-primary-600",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;