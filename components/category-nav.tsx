import { ChevronRight, ChevronLeft, Star } from "lucide-react"
import Image from "next/image"

export default function CategoryNav() {
  const categories = [
    "All",
    "Garden Center",
    "Power Tools",
    "Outdoor Power Equipment",
    "Hand Tools",
    "Bathroom Vanities",
    "Tile",
    "Vinyl Flooring",
  ]

  const products = [
    {
      id: 1,
      name: "RYOBI ONE+ 18V Lithium-Ion Starter Kit with 2.0 Ah Battery, 4.0 Ah Battery, and Charger",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-middle-PTAE6xjDNsNSa5EaW5BNeXYfzKWfxL.png",
      rating: 4.5,
      reviews: 1089,
      price: 79,
      originalPrice: 203.94,
      savings: 124.94,
      savingsPercent: 61,
    },
    {
      id: 2,
      name: "Milwaukee M18 18-Volt Lithium-Ion Cordless Combo Kit 9-Tool with 2-Batteries",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-middle-PTAE6xjDNsNSa5EaW5BNeXYfzKWfxL.png",
      rating: 4.6,
      reviews: 3034,
      price: 599,
      originalPrice: 1099,
      savings: 500,
      savingsPercent: 45,
    },
    {
      id: 3,
      name: "Milwaukee SHOCKWAVE Impact Duty Alloy Steel Screw Driver Bit Set (45-Piece)",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-middle-PTAE6xjDNsNSa5EaW5BNeXYfzKWfxL.png",
      rating: 4.6,
      reviews: 6163,
      price: 19.97,
      originalPrice: 26.97,
      savings: 7,
      savingsPercent: 26,
    },
    {
      id: 4,
      name: "Frigidaire 24 in. Stainless Steel Front Control Smart Built-In Tall Tub Dishwasher",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-middle-PTAE6xjDNsNSa5EaW5BNeXYfzKWfxL.png",
      rating: 3.7,
      reviews: 1683,
      price: 328,
      originalPrice: 419,
      savings: 91,
      savingsPercent: 22,
    },
    {
      id: 5,
      name: "KOHLER Gleam 12 in. Rough In 2-Piece 1.28 GPF Single Flush Elongated Toilet in White",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-middle-PTAE6xjDNsNSa5EaW5BNeXYfzKWfxL.png",
      rating: 4.3,
      reviews: 1824,
      price: 249,
      originalPrice: 279,
      savings: 30,
      savingsPercent: 11,
    },
  ]

  return (
    <div className="border rounded-md">
      <div className="p-6 pb-2">
        <h2 className="text-2xl font-bold mb-4">Top Savings For You</h2>
        <div className="flex overflow-x-auto gap-6 pb-2 border-b">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`whitespace-nowrap pb-2 ${
                index === 0 ? "border-b-2 border-[#F96302] font-medium text-[#F96302]" : ""
              }`}
            >
              {category}
            </button>
          ))}
          <button className="ml-auto">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col">
            <div className="h-48 relative mb-2">
              <Image src={`/placeholder.svg?height=200&width=200`} alt={product.name} fill className="object-contain" />
            </div>
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "fill-[#F96302] text-[#F96302]" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-xs ml-1">
                ({product.rating} / {product.reviews})
              </span>
            </div>
            <h3 className="text-sm line-clamp-2 mb-1">{product.name}</h3>
            <div className="mt-auto">
              <div className="flex items-baseline">
                <span className="text-xl font-bold">${product.price}</span>
                <span className="text-xs ml-1">{product.id === 3 ? "97" : "00"}</span>
              </div>
              <div className="text-xs">
                <div>Was ${product.originalPrice}</div>
                <div className="text-[#F96302]">
                  Save ${product.savings} ({product.savingsPercent}%)
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center p-4 border-t">
        <button className="w-8 h-8 flex items-center justify-center border rounded-full bg-white">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm mx-4">1/3</div>
        <button className="w-8 h-8 flex items-center justify-center border rounded-full bg-white">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
