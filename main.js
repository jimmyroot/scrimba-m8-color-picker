import { header } from './layout/header'
import { home } from './pages/home'

(() => {
  document.querySelector('#app').appendChild(header.get())
  document.querySelector('#app').appendChild(home.get())
})()