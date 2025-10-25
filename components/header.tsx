"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, User, Grid, Wrench, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navItems = [
    { icon: <Grid className="h-6 w-6 mb-1" />, label: "Shop All", href: "#" },
    { icon: <Wrench className="h-6 w-6 mb-1" />, label: "Services", href: "#" },
    {
      icon: (
        <div className="h-6 w-6 mb-1 flex items-center justify-center">
          <span className="font-bold">DIY</span>
        </div>
      ),
      label: "DIY",
      href: "#",
    },
    { icon: <User className="h-6 w-6 mb-1" />, label: "Log In", href: "#" },
    { icon: <ShoppingCart className="h-6 w-6 mb-1" />, label: "Cart", href: "#" },
  ]

  const mobileCategories = [
    "All Departments",
    "Appliances",
    "Bath & Faucets",
    "Blinds & Window Treatments",
    "Building Materials",
    "Doors & Windows",
    "Electrical",
    "Flooring & Area Rugs",
    "Hardware",
    "Heating & Cooling",
    "Kitchen & Kitchenware",
    "Lighting & Ceiling Fans",
    "Outdoor Living & Patio",
    "Paint",
    "Plumbing",
    "Smart Home",
    "Storage & Organization",
    "Tools",
  ]

  return (
    <header className="border-b relative z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-end py-2">
          <button className="text-sm flex items-center gap-1">
            <span>Credit Services</span>
          </button>
        </div>

        <div className="flex items-center gap-4 py-3">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="mr-2 md:mr-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F96302] flex items-center justify-center">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ84ZYSykofXw4pXJ64Vmgn0rWdw2IV5N0EEeUwBWE67-56KEjxX7uNp-ZlNsdqCEToKU&usqp=CAU"
                alt="Home Depot Logo"
                width={60}
                height={60}
                className="object-contain p-1 md:p-0"
              />
            </div>
          </div>

          {/* Location - Hidden on smallest screens */}
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <span>Ashburn</span>
            <span className="text-[#F96302] font-medium">9PM</span>
          </div>

          <div className="hidden sm:block border-l h-6 mx-2"></div>

          {/* Zip code - Hidden on smallest screens */}
          <div className="hidden sm:block text-sm">20147</div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="What can we help you find today?"
                className="w-full border rounded-md pr-10"
              />
              <Button
                className="absolute right-0 top-0 h-full bg-[#F96302] hover:bg-[#E05A02] rounded-l-none"
                size="icon"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} className="flex flex-col items-center text-xs">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Cart Icon - Shown only on mobile */}
          <Link href="#" className="md:hidden flex flex-col items-center text-xs">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobileMenu}></div>}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div className="w-12 h-12 bg-[#F96302] flex items-center justify-center">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ84ZYSykofXw4pXJ64Vmgn0rWdw2IV5N0EEeUwBWE67-56KEjxX7uNp-ZlNsdqCEToKU&usqp=CAU"
              alt="Home Depot Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <button onClick={toggleMobileMenu} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-sm mb-4">
            <span>Ashburn</span>
            <span className="text-[#F96302] font-medium">9PM</span>
            <span className="text-gray-500">20147</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="flex items-center gap-1 text-sm font-medium">
              <User className="h-4 w-4" />
              <span>Sign In / Register</span>
            </Link>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="font-bold mb-2">Shop by Department</h3>
            <ul className="space-y-3">
              {mobileCategories.map((category, index) => (
                <li key={index} className="flex justify-between items-center py-1 border-b">
                  <Link href="#" className="text-sm">
                    {category}
                  </Link>
                  <ChevronDown className="h-4 w-4" />
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Link href="#" className="flex items-center gap-2 font-medium">
              <Wrench className="h-5 w-5" />
              <span>Services</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 font-medium">
              <div className="h-5 w-5 flex items-center justify-center">
                <span className="font-bold text-xs">DIY</span>
              </div>
              <span>DIY Projects & Ideas</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 font-medium text-[#F96302]">
              <span>Specials & Offers</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 font-medium text-[#F96302]">
              <span>Local Ad & Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
