import styleTailwind from './styles'
import QRCode from 'qrcode'
import { qr } from './types'

const searchPage: string = `
  <main class="${styleTailwind.searchPage.main}">
    <img src="/logo-qr-generator.svg" alt="Logo QR Code" class="${styleTailwind.searchPage.img}">
    <form class="${styleTailwind.searchPage.form}">
      <input type="text" name="linkqr" id="link-qr" placeholder="Enter a url" class="${styleTailwind.searchPage.input}">
      <button type="submit" class="${styleTailwind.searchPage.submit}">QR code</button>
    </form>
  </main>
`

const qrCodePage: string = `
  <img src="logo-qr-generator.svg" alt="QR Code Logo" class="${styleTailwind.qrCodePage.logo}">
  <main class="${styleTailwind.qrCodePage.main}">
    <div id="code" class="${styleTailwind.qrCodePage.circle}">
      <img id="qr-img" class="${styleTailwind.qrCodePage.qr}" />
    </div>
    <div class="${styleTailwind.qrCodePage.buttonGroup}">
      <button id="download" class="${styleTailwind.qrCodePage.button}">
        Download
        <img src="download.svg" alt="download icon" class="${styleTailwind.qrCodePage.icon}" />
      </button>
      <button id="share" class="${styleTailwind.qrCodePage.button}">
        Share
        <img src="link.svg" alt="link icon" class="${styleTailwind.qrCodePage.icon}" />
      </button>
    </div>
  </main>
`

const $app = document.getElementById('app') as HTMLElement
$app.classList.add(...styleTailwind.searchPage.app.split(' '))
$app.innerHTML = searchPage
const $form = document.querySelector<HTMLFormElement>('form')

$form?.addEventListener('submit', (event) => {
  event.preventDefault()

  $app.classList.remove(...styleTailwind.searchPage.app.split(' '))
  $app.classList.add(...styleTailwind.qrCodePage.app.split(' '))
  $app.innerHTML = qrCodePage

  const target = event.target as HTMLElement & qr
  const link = target.linkqr.value ?? 'No'

  const $image = document.getElementById('qr-img') as HTMLImageElement | null
  const options: QRCode.QRCodeToDataURLOptions = {
    type: 'image/jpeg',
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 220
  }

  if ($image != null) {
    QRCode.toDataURL(link, options, (err, url) => {
      if (err !== null) {
        console.error(err)
      }

      document.getElementById('qr-img')?.setAttribute('src', url)
      const $a = document.createElement('a')

      document.getElementById('download')?.addEventListener('click', () => {
        fetch(url)
          .then(async res => await res.blob())
          .then(blob => {
            const link = URL.createObjectURL(blob)
            download($a, link)
          })
          .catch(err => console.error(err))
      })

      document.getElementById('share')?.addEventListener('click', () => {
        fetch(url)
          .then(async res => {
            const types = await navigator.clipboard.read()
            const isImage = types[0].types.findIndex(e => e === 'image/jpeg')

            if (isImage !== -1) {
              const data = await res.blob()
              await share(data)
            } else {
              const data = await res.text()
              await share(data)
            }
          })
          .catch(err => console.error(err))
      })
    })
  }
})

const download = (a: HTMLAnchorElement, blob: string): void => {
  a.style.display = 'none'
  a.href = blob
  a.download = 'qr.jpeg'
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(blob)
}

const share = async (content: Blob | string): Promise<void> => {
  try {
    if (typeof content === 'string') {
      await navigator.clipboard.writeText(content)
    } else {
      await navigator.clipboard.write([
        new ClipboardItem({
          [content.type]: content
        })
      ])
    }
  } catch (error) {
    console.error(error)
  }
}
