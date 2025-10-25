import { Button } from "@/components/ui/button"

export default function HeroBanner() {
  return (
    <div className="relative border rounded-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 flex flex-col justify-center">
          <div className="space-y-4 max-w-md">
            <div>
              <p className="text-xl font-bold uppercase">UP TO</p>
              <h1 className="text-6xl font-bold">40% OFF</h1>
              <p className="text-xl mt-2">Select Furniture, Kitchenware & Home Decor</p>
            </div>
            <Button className="bg-[#F96302] hover:bg-[#E05A02] text-white rounded-md px-6 py-2 mt-4 w-fit">
              Shop Now
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] lg:h-auto">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://dam.thdstatic.com/contentful/heroflattenimage/Group-31368.png')" }}
          ></div>
        </div>
      </div>
    
    </div>
  )
}
