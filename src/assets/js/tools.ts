export const exportFile = (filename: string, content: string) => {
  const element = document.createElement('a')
  Object.assign(element, {
    href: `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`,
    download: filename,
    display: 'none',
  })
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
