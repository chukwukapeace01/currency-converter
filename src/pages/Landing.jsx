import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { FaExchangeAlt } from "react-icons/fa"
import FloatingSymbols from "../components/FloatingSymbols"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex items-center justify-center animated-gradient px-6 overflow-hidden">
      <FloatingSymbols />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-6 text-white text-4xl"
        >
          <FaExchangeAlt />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Currency Converter
        </h1>

        <p className="mt-4 text-white/80 text-lg">
          Convert between 150+ currencies with live exchange rates
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">
            Real-time
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">
            150+ Currencies
          </span>
          <span className="bg-white/20 px-4 py-2 rounded-full text-white text-sm">
            Mobile Friendly
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/converter")}
          className="mt-8 bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg"
        >
          Start Converting
        </motion.button>
      </motion.div>
    </div>
  )
}