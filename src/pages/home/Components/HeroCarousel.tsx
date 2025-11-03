import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop",
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

export default function Slideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);
    const [autoPlay] = useState(true);

    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            paginate(1);
        }, 10000);

        return () => clearInterval(timer);
    }, [currentSlide, autoPlay]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentSlide((prev) => {
            const next = prev + newDirection;
            if (next < 0) return images.length - 1;
            if (next >= images.length) return 0;
            return next;
        });
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    };

    return (
        <div className="w-full max-w-4xl">
            <div className="relative h-[320px] rounded-b-2xl overflow-hidden shadow-2xl">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentSlide}
                        src={images[currentSlide]}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1);
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1);
                            }
                        }}
                        className="absolute w-full h-full object-cover cursor-grab active:cursor-grabbing"
                    />
                </AnimatePresence>

                {/* Dot Pagination */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className="relative group"
                        >
                            <motion.div
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? "w-7 bg-primary-orange"
                                        : "w-2 bg-primary-orange/50 hover:bg-primary-orange/70"
                                    }`}
                                animate={{
                                    scale: index === currentSlide ? 1 : 0.9,
                                }}
                                whileHover={{ scale: 1.1 }}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}