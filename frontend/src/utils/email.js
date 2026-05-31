const EMAIL_KEY = 'nerdio-wcp-email'

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function getLocalPart(email) {
  return email.split('@')[0]
}

export function loadEmail() {
  const stored = localStorage.getItem(EMAIL_KEY)
  return stored ? normalizeEmail(stored) : null
}

export function saveEmail(email) {
  const normalized = normalizeEmail(email)
  localStorage.setItem(EMAIL_KEY, normalized)
  return normalized
}

export function clearEmail() {
  localStorage.removeItem(EMAIL_KEY)
}
