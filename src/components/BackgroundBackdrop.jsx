import { motion } from "framer-motion";
import { buildBackgroundLayers } from "../utils/backgroundLayers.js";

export default function BackgroundBackdrop({ backgroundImages, activeKey }) {
  const layers = buildBackgroundLayers(backgroundImages, activeKey);

  return (
    <div className="fixed inset-0 bg-cover bg-center" aria-hidden="true">
      {layers.map((layer) => (
        <motion.div
          key={layer.key}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${layer.src})` }}
          initial={false}
          animate={{ opacity: layer.active ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}
