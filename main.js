import { header } from './layout/header'
import { home } from './pages/home'

(() => {
  document.querySelector('#app').appendChild(header.get())
  document.querySelector('#app').appendChild(home.get())
})()

// Header (picker)
// Body (returned color scheme)
// Footer (C 2024 blah blah blah. link to color api website?) 