import { motion } from "framer-motion";

function ServiceCard({ title, description, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-shadow cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
        <Icon className="text-2xl text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default ServiceCard;