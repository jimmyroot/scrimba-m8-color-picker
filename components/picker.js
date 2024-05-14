import { SCHEME_MODES, PREFS } from '../utils/constants'
import { generator } from '../data/generator'
import { swatch } from './swatch'
import { randomHexVal, isLowContrast, toggleSpinner } from '../utils/utils'

const Picker = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
          handleClick(e)
        })
        node.querySelector('#seed').addEventListener('input', e => {
          setButtonColor(e.target.value)
        })
    }
  
    const handleClick = e => {
      const execute = {
        get: () => {
          handleGetSchemeClick(e.target)
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
    }
    
    const handleGetSchemeClick = async getSchemeBtn => {
      getSchemeBtn.disabled = true
      toggleSpinner()

      const options = {
        seed: node.querySelector('#seed').value.replace('#', ''),
        mode: node.querySelector('#mode').value,
        count: PREFS.count
      }

      // Get the primary & alt schemes
      const newScheme = await generator.getSchemeFromSeed(options)
      const altSchemes = await generator.getAlternativeSchemes(newScheme)
      
      // Showtime
      swatch.setScheme(newScheme, altSchemes)
      getSchemeBtn.disabled = false
    }

    const initialize = async () => {
      toggleSpinner()

      const options = {
          'seed': randomHexVal(),
          'mode': SCHEME_MODES[Math.floor(Math.random() * SCHEME_MODES.length)],
          'count': PREFS.count
      }

      setPickerValue(`#${options.seed}`)
      setButtonColor(`#${options.seed}`)

      const initScheme = await generator.getSchemeFromSeed(options)
      const altSchemes = await generator.getAlternativeSchemes(initScheme)

      swatch.setScheme(initScheme, altSchemes)
    }

    const setPickerValue = hex => {
      node.querySelector('#seed').value = hex
    }

    const setModeValue = mode => {
      node.querySelector('#mode').value = mode
    }

    const enableButton = ( button, enable ) => {
      const execute = {
        btnBack: () => {
          node.querySelector('#btn-back').disabled = !enable
        },
        btnForward: () => {
          node.querySelector('#btn-forward').disabled = !enable
        }
      }

      if (button && execute[button]) execute[button]()
    }

    const setButtonColor = color => {
      const btnGetScheme = node.querySelector('button.btn-get-scheme')

      isLowContrast(color, 100) ?
        btnGetScheme.classList.add(`dark`) : 
        btnGetScheme.classList.remove('dark')

      btnGetScheme.style.backgroundColor = color
    }

    const render = () => {
        const html = `
          <div class="div-scheme-nav-btns">
            <button class="btn" id="btn-back" data-type="back">
              <i class='bx bx-chevron-left bx-md'></i>
            </button>
            <button class="btn" id="btn-forward" data-type="forward">
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
            <button class="btn-get-scheme" data-type="get"><span>Get scheme</span></button>
          </div>
        `

        return html
    }

    const refresh = () => {
        node.innerHTML = render()
        registerEventListeners()
    }

    const get = async () => {
        refresh()
        await initialize()
        return node
    }

    const node = document.createElement('div')
    node.classList.add('picker-wrapper')
    return {
        get,
        enableButton,
        setModeValue
    }
}

export const picker = Picker()