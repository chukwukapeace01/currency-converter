import { motion } from "framer-motion"

const symbols = ["$", "€", "¥", "£", "₦", "₹"]

export default function FloatingSymbols() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((symbol, i) => (
        <motion.span
          key={i}
          className="absolute text-white/10 text-4xl"
          initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
          animate={{ y: "-10vh" }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {symbol}
        </motion.span>
      ))}
    </div>
  )
}