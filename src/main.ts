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
      <canvas id="canvas" class="${styleTailwind.qrCodePage.qr}"></canvas>
    </div>
    <div class="${styleTailwind.qrCodePage.buttonGroup}">
      <button class="${styleTailwind.qrCodePage.button}">
        Download
        <img src="download.svg" alt="download icon" class="${styleTailwind.qrCodePage.icon}" />
      </button>
      <button class="${styleTailwind.qrCodePage.button}">
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

  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null

  if (canvas != null) {
    QRCode.toCanvas(canvas, link, { width: 220 }, (err) => {
      if (err != null) {
        console.error(err)
        return
      }

      console.log('success')
    })
  } else {
    console.error('Canvas element is missing.')
  }
})
