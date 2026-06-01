"use client"

import { useState, useCallback } from "react"
import { cleanUrl } from "@/lib/cleaner"
import type { CleanerResult } from "@/lib/cleaner"

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export default function UrlCleanerApp() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<CleanerResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleClean = useCallback(() => {
    setError("")
    if (!input.trim()) return
    if (!isValidUrl(input.trim())) {
      setError("Enter a valid URL (include https:// or http://).")
      return
    }
    const res = cleanUrl(input)
    setResult(res)
    setCopied(false)
  }, [input])

  const handleCopy = useCallback(async () => {
    if (!result?.cleaned) return
    try {
      await navigator.clipboard.writeText(result.cleaned)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = result.cleaned
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [result])

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 sm:p-8">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2 text-center">
          URL Cleaner
        </h1>
        <p className="text-blue-500 text-center mb-8 text-sm sm:text-base">
          Strip tracking parameters from any URL
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a URL here..."
          rows={3}
          className="w-full resize-none rounded-xl border border-blue-200 bg-white p-4 text-sm text-gray-800 shadow-sm placeholder:text-blue-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />

        <button
          onClick={handleClean}
          disabled={!input.trim()}
          className="mt-3 w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clean URL
        </button>

        {error ? (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        ) : null}

        {result && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
            {result.valid ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold text-gray-700">Cleaned URL</h2>
                  <button
                    onClick={handleCopy}
                    className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="break-all rounded-lg bg-blue-50 p-3 text-sm text-gray-800">
                  {result.cleaned}
                </p>
                {result.removedParams.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    Removed: {result.removedParams.join(", ")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-red-500">
                Invalid URL. Please enter a valid http or https URL.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
