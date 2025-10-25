import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Youtube, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const supportLinks = [
    { name: "Customer Service Center", href: "#" },
    { name: "Check Order Status", href: "#" },
    { name: "Pay Your Credit Card", href: "#" },
    { name: "Order Cancellation", href: "#" },
    { name: "Return Policy", href: "#" },
    { name: "Refund Policy", href: "#" },
    { name: "Shipping & Delivery", href: "#" },
    { name: "Product Recalls", href: "#" },
    { name: "My Preference Center", href: "#" },
    { name: "Privacy & Security Center", href: "#" },
  ]

  const resourceLinks = [
    { name: "Specials & Offers", href: "#" },
    { name: "Military Discount Benefit", href: "#" },
    { name: "DIY Projects & Ideas", href: "#" },
    { name: "Truck & Tool Rental", href: "#" },
    { name: "Installation & Services", href: "#" },
    { name: "Moving Supplies & Rentals", href: "#" },
    { name: "Protection Plans", href: "#" },
    { name: "Rebate Center", href: "#" },
    { name: "Gift Cards", href: "#" },
    { name: "Catalog", href: "#" },
    { name: "Subscriptions", href: "#" },
  ]

  const aboutLinks = [
    { name: "Careers", href: "#" },
    { name: "Corporate Information", href: "#" },
    { name: "Digital Newsroom", href: "#" },
    { name: "Home Depot Foundation", href: "#" },
    { name: "Investor Relations", href: "#" },
    { name: "Government Customers", href: "#" },
    { name: "Suppliers & Providers", href: "#" },
    { name: "Affiliate Program", href: "#" },
    { name: "Eco Actions", href: "#" },
    { name: "Corporate Responsibility", href: "#" },
    { name: "Home Depot Licensing Information", href: "#" },
  ]

  const brands = [
    { name: "Company Store", image: "/placeholder.svg?height=40&width=120" },
    { name: "Vissani", image: "/placeholder.svg?height=40&width=120" },
    { name: "Home Decorators", image: "/placeholder.svg?height=40&width=120" },
    { name: "Hampton Bay", image: "/placeholder.svg?height=40&width=120" },
    { name: "Husky", image: "/placeholder.svg?height=40&width=120" },
    { name: "Lifeproof", image: "/placeholder.svg?height=40&width=120" },
    { name: "Glacier Bay", image: "/placeholder.svg?height=40&width=120" },
    { name: "Everbilt", image: "/placeholder.svg?height=40&width=120" },
    { name: "StyleWell", image: "/placeholder.svg?height=40&width=120" },
    { name: "HDX", image: "/placeholder.svg?height=40&width=120" },
    { name: "Vigoro", image: "/placeholder.svg?height=40&width=120" },
    { name: "TrafficMaster", image: "/placeholder.svg?height=40&width=120" },
    { name: "Defiant", image: "/placeholder.svg?height=40&width=120" },
    { name: "Ecosmart", image: "/placeholder.svg?height=40&width=120" },
    { name: "Home Accents Holiday", image: "/placeholder.svg?height=40&width=120" },
    { name: "Commercial Electric", image: "/placeholder.svg?height=40&width=120" },
  ]

  return (
    <footer className="mt-8 border-t bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm font-medium">How doers get more done™</p>
          <Link href="#" className="text-sm hover:underline">
            Need Help? Visit our Customer Service Center
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Footer Links Section - Accordion on mobile, columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Support Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline text-gray-700">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline text-gray-700">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">About Us</h3>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline text-gray-700">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/placeholder.svg?height=24&width=24" alt="Credit Card" width={24} height={24} />
                <span className="text-sm font-medium">Special Financing Available everyday*</span>
              </div>
              <div className="space-y-2">
                <Link href="#" className="text-sm hover:underline block text-gray-700">
                  Pay & Manage Your Card
                </Link>
                <Link href="#" className="text-sm hover:underline block text-gray-700">
                  Credit Offers
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm mb-4">Get $5 off when you sign up for emails with savings and tips.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input placeholder="Enter Email Address" className="flex-1" />
                <Button className="bg-[#F96302] hover:bg-[#E05A02] text-white w-full sm:w-auto">GO</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Link href="#" className="text-gray-600 hover:text-[#F96302]" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#F96302]" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#F96302]" aria-label="Pinterest">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#F96302]" aria-label="Blog">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                  <path d="M8 7h6"></path>
                  <path d="M8 11h8"></path>
                  <path d="M8 15h5"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#F96302]" aria-label="YouTube">
                <Youtube className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#F96302]" aria-label="Mobile App">
                <Phone className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

       

        {/* Legal Footer */}
        <div className="mt-10 md:mt-12 pt-6 border-t text-xs text-gray-600">
          <p className="mb-3 text-center sm:text-left">
            © 2000-2025 Home Depot. All Rights Reserved. Use of this site is subject to certain Terms Of Use.
          </p>
          <p className="mb-4 text-center sm:text-left">
            Local store prices may vary from those displayed. Products shown as available are normally stocked but
            inventory levels cannot be guaranteed.
          </p>
          <p className="mb-4 text-center sm:text-left">
            For screen reader problems with this website, please call 1-800-430-3376 or text 38698 (standard carrier
            rates apply to texts).
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
            <Link href="#" className="hover:underline">
              Store Locator
            </Link>
            <Link href="#" className="hover:underline">
              Privacy & Security Statement
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              My Preference Center
            </Link>
            <Link href="#" className="hover:underline">
              California Privacy Rights & Report
            </Link>
            <Link href="#" className="hover:underline">
              Limit the Use of My Sensitive Personal Information
            </Link>
            <Link href="#" className="hover:underline">
              Do Not Sell or Share My Personal Information
            </Link>
            <Link href="#" className="hover:underline">
              California Supply Chain Act
            </Link>
            <Link href="#" className="hover:underline">
              Site Map
            </Link>
            <Link href="#" className="hover:underline">
              Store Directory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
