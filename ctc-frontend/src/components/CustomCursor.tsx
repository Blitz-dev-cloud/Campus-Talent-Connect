import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
    []
  );

  useEffect(() => {
    // Check if device supports touch
    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-ignore
          navigator.msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();

    let trailId = 0;
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add trail effect
      setTrail((prev) => [
        ...prev.slice(-8), // Keep last 8 trail points
        { x: e.clientX, y: e.clientY, id: trailId++ },
      ]);
    };

    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.onclick !== null ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.closest("input") !== null ||
        target.closest("textarea") !== null ||
        window.getComputedStyle(target).cursor === "pointer";
      setIsPointer(isClickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", updateCursorType);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", updateCursorType);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Don't render on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Trail effect */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "fixed",
            left: point.x - 4,
            top: point.y - 4,
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, rgba(99, 102, 241, ${
              0.3 - index * 0.03
            }), rgba(168, 85, 247, ${0.3 - index * 0.03}))`,
            pointerEvents: "none",
            zIndex: 9997,
          }}
        />
      ))}

      {/* Main cursor dot with glow */}
      <motion.div
        className="custom-cursor-dot"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isPointer ? 0.5 : isClicking ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 30,
        }}
        style={{
          position: "fixed",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
          boxShadow:
            "0 0 20px rgba(99, 102, 241, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      {/* Outer cursor ring with gradient border */}
      <motion.div
        className="custom-cursor-ring"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isPointer ? 1.8 : isClicking ? 0.8 : 1,
          rotate: isPointer ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          rotate: { duration: 0.6 },
        }}
        style={{
          position: "fixed",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "2px solid transparent",
          background:
            "linear-gradient(white, white) padding-box, linear-gradient(135deg, #6366f1, #a855f7, #ec4899) border-box",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Glow ring effect */}
      <motion.div
        className="custom-cursor-glow"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
          scale: isPointer ? 2 : 1,
          opacity: isPointer ? 0.3 : 0.15,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 25,
        }}
        style={{
          position: "fixed",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 9997,
          filter: "blur(8px)",
        }}
      />
    </>
  );
};

export default CustomCursor;
