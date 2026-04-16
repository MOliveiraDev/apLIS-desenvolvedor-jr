export async function requestJson(url, options, fallbackMessage) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw await parseApiError(response, fallbackMessage)
  }

  return response.json()
}

async function parseApiError(response, fallbackMessage) {
  try {
    const payload = await response.json()

    if (payload && payload.message) {
      return new Error(payload.message)
    }
  } catch {
    return new Error(fallbackMessage)
  }

  return new Error(fallbackMessage)
}
