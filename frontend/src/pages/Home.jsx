import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturedSection from "../components/Products/FeaturedSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrival from "../components/Products/NewArrival";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";

const placeholderProducts = [
    {
        _id: 4,
        name: "Product 4",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=6"}],
    },
    {
        _id: 5,
        name: "Product 5",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=7"}],
    },
    {
        _id: 6,
        name: "Product 6",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=8"}],
    },
    {
        _id: 7,
        name: "Product 7",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=9"}],
    },
    {
        _id: 4,
        name: "Product 4",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=6"}],
    },
    {
        _id: 5,
        name: "Product 5",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=7"}],
    },
    {
        _id: 6,
        name: "Product 6",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=8"}],
    },
    {
        _id: 7,
        name: "Product 7",
        price: 100,
        images: [{url: "https://picsum.photos/500/500?random=9"}],
    },
]
const Home = () => {
  return (
    <div>
        <Hero />
        <GenderCollectionSection />
        <NewArrival />

        {/* best seller */}
        <h2 className="text-3xl text-center font-bold mb-4"> Best Seller </h2>
        <ProductDetails />

        <div className="container mx-auto">
          <h2 className="text-3xl text-center font-bold mb-4">
            Top Wears for Women
          </h2>
          <ProductGrid products={placeholderProducts}/>
        </div>
        <FeaturedCollection />
        <FeaturedSection />
    </div>
  )
}

export default Home