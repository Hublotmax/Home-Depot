import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function SpecialBuy() {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-6 relative">
        <div className="absolute top-4 right-4">
          <div className="bg-[#EE3124] text-white font-bold p-2 rounded">SPECIAL BUY</div>
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Up to 35% off Select Ceiling Fans, Residential & Commercial Lighting
        </h2>
        <p className="text-gray-600 mb-4">Today Only! Free Delivery</p>

        <div className="flex items-center text-[#EE3124] mb-4">
          <Clock className="w-5 h-5 mr-2" />
          <span>Ends in 16 hrs 11 mins 04 secs</span>
        </div>

        <Button className="bg-[#F96302] hover:bg-[#E05A02] text-white w-full mb-4">SHOP NOW</Button>

        <div className="h-32 relative">
          <Image
            src="/placeholder.svg?height=150&width=300"
            alt="Ceiling fans on sale"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
