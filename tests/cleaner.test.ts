import { describe, it, expect } from "vitest"
import { stripTrackingParams, isValidUrl, cleanUrl } from "@/lib/cleaner"

describe("isValidUrl", () => {
  it("accepts http URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true)
  })

  it("accepts https URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true)
  })

  it("rejects ftp URLs", () => {
    expect(isValidUrl("ftp://example.com")).toBe(false)
  })

  it("rejects garbage text", () => {
    expect(isValidUrl("not a url")).toBe(false)
  })

  it("rejects empty string", () => {
    expect(isValidUrl("")).toBe(false)
  })
})

describe("stripTrackingParams", () => {
  it("removes utm_source", () => {
    const result = stripTrackingParams("https://example.com?utm_source=twitter")
    expect(result.href).toBe("https://example.com/")
    expect(result.removedParams).toEqual(["utm_source"])
  })

  it("removes all common tracking params", () => {
    const url =
      "https://example.com?utm_source=twitter&utm_medium=social&utm_campaign=spring&fbclid=abc&gclid=xyz"
    const result = stripTrackingParams(url)
    expect(result.href).toBe("https://example.com/")
    expect(result.removedParams.sort()).toEqual([
      "fbclid",
      "gclid",
      "utm_campaign",
      "utm_medium",
      "utm_source",
    ])
  })

  it("preserves non-tracking params", () => {
    const result = stripTrackingParams("https://example.com?page=1&utm_source=twitter")
    expect(result.href).toBe("https://example.com/?page=1")
    expect(result.removedParams).toEqual(["utm_source"])
  })

  it("handles URLs with no params", () => {
    const result = stripTrackingParams("https://example.com/page")
    expect(result.href).toBe("https://example.com/page")
    expect(result.removedParams).toEqual([])
  })

  it("handles invalid URLs gracefully", () => {
    const result = stripTrackingParams("not a url")
    expect(result.href).toBe("not a url")
    expect(result.removedParams).toEqual([])
  })
})

describe("cleanUrl", () => {
  it("returns valid result for a cleanable URL", () => {
    const result = cleanUrl("https://example.com?utm_source=twitter")
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe("https://example.com/")
    expect(result.removedParams).toEqual(["utm_source"])
  })

  it("returns invalid result for bad URL", () => {
    const result = cleanUrl("not a url")
    expect(result.valid).toBe(false)
    expect(result.cleaned).toBe("not a url")
    expect(result.removedParams).toEqual([])
  })

  it("handles mc_cid and mc_eid", () => {
    const result = cleanUrl("https://example.com?mc_cid=123&mc_eid=456")
    expect(result.valid).toBe(true)
    expect(result.removedParams.sort()).toEqual(["mc_cid", "mc_eid"])
  })

  it("handles ref and source", () => {
    const result = cleanUrl("https://example.com?ref=home&source=newsletter")
    expect(result.removedParams.sort()).toEqual(["ref", "source"])
  })
})
