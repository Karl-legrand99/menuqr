"use client"

import { useState, useEffect } from "react"

export function useDemoMode() {
  const [isDemo, setIsDemo] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Check both URL param and localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const urlDemo = urlParams.get("demo") === "true"
    const lsDemo = localStorage.getItem("demo-mode") === "true"
    const demo = urlDemo || lsDemo
    
    setIsDemo(demo)
    setChecked(true)
    
    // Sync URL demo to localStorage
    if (urlDemo) {
      localStorage.setItem("demo-mode", "true")
    }
  }, [])

  return { isDemo, checked }
}
