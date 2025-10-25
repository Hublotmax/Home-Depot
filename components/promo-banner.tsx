import { Button } from "@/components/ui/button"

export default function PromoBanner() {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="p-6 bg-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-[#F96302] flex items-center justify-center">
              <span className="text-white text-xs">HOME SERVICES</span>
            </div>
            <div>
              <p className="font-bold">Let us do it for you.</p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold">0% APR FOR 60 MONTHS ON SELECT HVAC INSTALLATIONS</h2>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="border-black rounded-none">
              Learn More
            </Button>
          </div>
        </div>
        <div
          className="h-[200px] bg-cover bg-center"
          style={{ backgroundImage: "url('/placeholder.svg?height=200&width=400')" }}
        ></div>
      </div>
    </div>
  )
}
