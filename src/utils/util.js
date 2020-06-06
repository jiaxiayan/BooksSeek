function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const t1 = [year, month, day].map(formatNumber).join('/')

  return `${t1}`
}

export default {
  formatNumber,
  formatTime
}
