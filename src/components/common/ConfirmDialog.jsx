import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import Button from "./Button";

/**
 * Reusable confirmation dialog.
 *
 * Props:
 *  isOpen
 *  onClose
 *  onConfirm
 *  title
 *  message
 *  confirmLabel
 *  cancelLabel
 *  variant: "danger" (default) | "primary"
 *  isLoading
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Yes, continue",
  cancelLabel = "No, go back",
  variant = "danger",
  isLoading = false,
}) {
  const isDanger = variant === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] isolate flex items-center justify-center px-4"
          style={{ zIndex: 9999 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
            style={{ zIndex: 9999 }}
          />

          {/* Confirmation Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="relative z-[10000] bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            style={{ zIndex: 10000 }}
          >
            {/* Warning Icon */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDanger
                  ? "bg-red-50 text-red-500"
                  : "bg-primary-50 text-primary-600"
              }`}
            >
              <FaExclamationTriangle className="text-2xl" />
            </div>

            {/* Title */}
            <h3
              id="confirm-dialog-title"
              className="text-lg font-bold text-slate-900 mb-2"
            >
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 justify-center"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  isDanger
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {isLoading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;