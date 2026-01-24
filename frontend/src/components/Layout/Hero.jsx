import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import rabbitHero from "../../assets/rabbit-hero.webp";
import featured from "../../assets/featured.webp";
import login from "../../assets/login.webp";
import mensCollection from "../../assets/mens-collection.webp";
import womensCollection from "../../assets/womens-collection.webp";


const images = [
    {
        src: rabbitHero,
        title: "Vacation Ready",
        desc: "Explore our vacation ready outfits with fast worldwide shipping.",
        cta: "Shop Now"
    },
    {
        src: featured,
        title: "Featured Collection",
        desc: "Discover our best sellers and new arrivals.",
        cta: "View Collection"
    },
    {
        src: login,
        title: "Sign In & Save",
        desc: "Login for exclusive offers and faster checkout.",
        cta: "Sign In"
    },
    {
        src: mensCollection,
        title: "Men's Collection",
        desc: "Shop the latest styles for men.",
        cta: "Shop Men"
    },
    {
        src: womensCollection,
        title: "Women's Collection",
        desc: "Find your perfect look for every occasion.",
        cta: "Shop Women"
    },
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const length = images.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % length);
        }, 4000); // Change image every 4 seconds
        return () => clearInterval(timer);
    }, [length]);

    const goToPrev = () => {
        setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
    };
    const goToNext = () => {
        setCurrent((prev) => (prev + 1) % length);
    };

        return (
            <section className="relative overflow-hidden">
                <div className="w-full h-[350px] md:h-[450px] lg:h-[650px] flex items-center justify-center">
                    <div className="w-full h-full relative">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out ${idx === current ? "z-10" : "z-0"}`}
                                style={{
                                    transform: `translateX(${(idx - current) * 100}%)`,
                                    opacity: idx === current ? 1 : 0.5,
                                }}
                            >
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <img
                                src={img.src}
                                alt={img.title}
                                className="w-full h-full object-cover"
                                style={{objectFit: "cover", width: "100%", height: "100%", minHeight: "450px", minWidth: "100%"}}
                                onError={e => {e.target.style.display='none';}}
                            />
                                                </div>
                                {/* Overlay content */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <div className="text-center text-white p-6">
                                        <h1 className="text-3xl md:text-6xl font-bold tracking-tighter uppercase mb-4 drop-shadow-lg">
                                            {img.title}
                                        </h1>
                                        <p className="text-sm tracking-tighter md:text-lg mb-6 drop-shadow-lg">
                                            {img.desc}
                                        </p>
                                        <Link to="#" className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg font-semibold shadow-lg" >
                                            {img.cta}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Navigation Buttons */}
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2 text-black hover:bg-opacity-90 z-20 shadow-lg"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2 text-black hover:bg-opacity-90 z-20 shadow-lg"
                        >
                            &#8594;
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-gray-400"}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
};

export default Hero;