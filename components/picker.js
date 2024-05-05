import { SCHEME_MODES, PREFS } from '../utils/constants'
import { generator } from '../data/generator'
import { swatch } from './swatch'
import { randomHexVal } from '../utils/utils'

const Picker = () => {

    let defaultSeed = ''

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
          const execute = {
            get: () => {
              handleGetSchemeClick()
            },
            back: () => {
              swatch.colorSchemes.back()
            },
            forward: () => {
              swatch.colorSchemes.forward()
            }
          }
          const { type } = e.target.dataset
          if (type && execute[type]) execute[type]()
        })
    }
    
    const handleGetSchemeClick = async () => {
      const options = {
        seed: node.querySelector('#seed').value.replace('#', ''),
        mode: node.querySelector('#mode').value,
        count: PREFS.count
      }

      // Get the primary scheme
      const newScheme = await generator.getSchemeFromSeed(options)
      const altSchemes = await generator.getAlternativeSchemes(newScheme)
      
      // Showtime
      swatch.setScheme(newScheme, altSchemes)
    }

    const setPickerValue = hex => {
      node.querySelector('#seed').value = hex
    }

    const setModeValue = () => {

    }

    const render = () => {
        const html = `
          <div>
            <button class="btn-back" data-type="back">
              <i class='bx bx-chevron-left bx-md'></i>
            </button>
            <button class="btn-forward" data-type="forward">
              <i class='bx bx-chevron-right bx-md'></i>
            </button>
          </div>
          <div>
            <label for="color">Color</label>
            <input type="color" id="seed" name="seed">
          </div>
          <div>
            <label for="mode">Mode</label>
            <select class="select-mode" id="mode" name="mode">
                ${SCHEME_MODES
                    .map(mode => `<option value="${mode}">${mode}</option>`)
                    .join('')}
            </select>
          </div>
          <div>
            <button class="btn-get-scheme" data-type="get">Get scheme</button>
          </div>
        `

        return html
    }

    const refresh = () => {
        node.innerHTML = render()
        registerEventListeners()
    }

    const get = () => {
        refresh()
        initialize()
        return node
    }

    const initialize = async () => {
      const options = {
          'seed': randomHexVal(),
          'mode': SCHEME_MODES[Math.floor(Math.random() * SCHEME_MODES.length)],
          'count': PREFS.count
      }

      node.querySelector('#seed').value = '#' + options.seed
      node.querySelector('#mode').value = options.mode
      const initScheme = await generator.getSchemeFromSeed(options)
      const altSchemes = await generator.getAlternativeSchemes(initScheme)
      swatch.setScheme(initScheme, altSchemes)
    }

    const node = document.createElement('div')
    node.classList.add('picker-wrapper')
    return {
        get
    }
}

export const picker = Picker()