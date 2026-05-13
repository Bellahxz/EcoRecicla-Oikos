import { motion } from "framer-motion";

import earthImage from "../../assets/images/earth.png";

function Planet() {
  return (

    <motion.div
      className="planet-container"

      animate={{
        y: [0, -15, 0],
      }}

      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}

      whileHover={{
        scale: 1.05,
      }}

      whileTap={{
        scale: 0.98,
      }}
    >

      <motion.img src={earthImage} alt="Planeta Terra" className="planet-image"

        whileHover={{
          rotate: 10,
        }}

        transition={{
          type: "spring",
          stiffness: 120,
        }}
      />

    </motion.div>
  );
}

export default Planet;