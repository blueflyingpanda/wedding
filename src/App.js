import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export default function WeddingInvitation() {
  const FRONT_BG = process.env.PUBLIC_URL + '/bg.png';
  const FRONT_CARD = process.env.PUBLIC_URL + '/card.png';
  const FRONT_LOVERS = process.env.PUBLIC_URL + '/lovers.png';
  const BACK_IMG = process.env.PUBLIC_URL + '/back.jpg';

  const [isFlipped, setIsFlipped] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef(null);

  // Parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Different rotation intensities for each layer
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  // Layer-specific transforms for depth
  const bgX = useTransform(x, [-300, 300], [-3, 3]);
  const bgY = useTransform(y, [-300, 300], [-3, 3]);

  const cardX = useTransform(x, [-300, 300], [-7, 7]);
  const cardY = useTransform(y, [-300, 300], [-7, 7]);

  const loversX = useTransform(x, [-300, 300], [-5, 5]);
  const loversY = useTransform(y, [-300, 300], [-5, 5]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const springBgX = useSpring(bgX, springConfig);
  const springBgY = useSpring(bgY, springConfig);

  const springCardX = useSpring(cardX, springConfig);
  const springCardY = useSpring(cardY, springConfig);

  const springLoversX = useSpring(loversX, springConfig);
  const springLoversY = useSpring(loversY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    setHasAnimated(true);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex items-center justify-center p-4 overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-rose-200/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating hearts */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-rose-300/40 text-4xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-100vh",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          ♥
        </motion.div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Card container */}
        <motion.div
          ref={cardRef}
          className="relative cursor-pointer"
          style={{
            perspective: 1000,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          {/* Parallax wrapper */}
          <motion.div
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
            }}
          >
            <motion.div
              className="relative w-[300px] h-[450px] md:w-[400px] md:h-[600px]"
              style={{
                transformStyle: "preserve-3d",
              }}
              animate={{
                rotateY: isFlipped ? 180 : 0,
              }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              onClick={handleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Front side with parallax layers */}
              <motion.div
                className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Background layer - moves slowest */}
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    x: springBgX,
                    y: springBgY,
                    scale: 1.05,
                  }}
                >
                  <img
                    src={FRONT_BG}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Lovers layer - moves medium */}
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    x: springLoversX,
                    y: springLoversY,
                    scale: 1.05,
                  }}
                >
                  <img
                    src={FRONT_LOVERS}
                    alt="Couple"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Card frame layer -  moves fastest (most depth)*/}
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    x: springCardX,
                    y: springCardY,
                    scale: 1.05,
                  }}
                >
                  <img
                    src={FRONT_CARD}
                    alt="Card Frame"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </motion.div>

              {/* Back side */}
              <motion.div
                className="absolute w-full h-full rounded-lg shadow-2xl overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <img
                  src={BACK_IMG}
                  alt="Wedding Invitation Back"
                  className="w-full h-full object-cover"
                />

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(251, 113, 133, 0.3), transparent 70%)",
              filter: "blur(20px)",
              zIndex: -1,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Confetti on first flip */}
      {hasAnimated && (
        <>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute w-3 h-3 rounded-full pointer-events-none"
              style={{
                backgroundColor: ['#fda4af', '#fb923c', '#fbbf24', '#f472b6'][i % 4],
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: (Math.random() - 0.5) * 800,
                y: Math.random() * -500 - 100,
                opacity: 0,
                scale: [1, 1.5, 0],
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}