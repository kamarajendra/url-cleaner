export interface CleanerResult {
  original: string
  cleaned: string
  removedParams: string[]
  valid: boolean
}

const trackingParams = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ref",
  "source",
  "mc_cid",
  "mc_eid",
])

export function stripTrackingParams(url: string): { href: string; removedParams: string[] } {
  try {
    const parsed = new URL(url)
    const removedParams: string[] = []

    for (const key of [...parsed.searchParams.keys()]) {
      if (trackingParams.has(key)) {
        parsed.searchParams.delete(key)
        removedParams.push(key)
      }
    }

    return { href: parsed.toString(), removedParams }
  } catch {
    return { href: url, removedParams: [] }
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function cleanUrl(url: string): CleanerResult {
  const valid = isValidUrl(url)
  if (!valid) {
    return { original: url, cleaned: url, removedParams: [], valid: false }
  }

  const { href, removedParams } = stripTrackingParams(url)
  return { original: url, cleaned: href, removedParams, valid: true }
}
