import { header } from './layout/header'
import { home } from './pages/home'
import { footer } from './layout/footer'

(() => {
  document.querySelector('#app').appendChild(header.get())
  document.querySelector('#app').appendChild(home.get())
  document.querySelector('#app').appendChild(footer.get())
})()