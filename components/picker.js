import { SCHEME_MODES, PREFS } from '../utils/constants'
import { palette } from '../data/palette'
import { swatch } from './swatch'

const Picker = () => {

    let defaultSeed = ''

    const registerEventListeners = () => {
        node.querySelector('button').addEventListener('click', () => {
          handleGetSchemeClick()
        })
    }
    
    const handleGetSchemeClick = async () => {
      const options = {
        seed: node.querySelector('#seed').value.replace('#', ''),
        mode: node.querySelector('#mode').value,
        count: PREFS.count
      }

      // Get the primary scheme
      const newScheme = await palette.getSchemeFromSeed(options)

      // Get the alternative schemes
      const altSchemePaths = newScheme._links.schemes
      const altSchemes = await Promise.all(Object.keys(altSchemePaths).map(async key => {
        const path = altSchemePaths[key]
        const scheme = await palette.getSchemeFromPath(path)
        return scheme
      }))
      
      swatch.setAltSchemes(altSchemes)
      swatch.setScheme(newScheme)
      
    }

    const render = () => {
        const html = `
            
                <label for="color">Color</label>
                <input type="color" id="seed" name="seed">
                <label for="mode">Mode</label>
                <select id="mode" name="mode">
                    ${SCHEME_MODES
                        .map(mode => `<option value="${mode}">${mode}</option>`)
                        .join('')}
                </select>
                <button>Get scheme</button>

        `

        return html
    }

    const refresh = () => {
        node.innerHTML = render()
        registerEventListeners()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('div')

    return {
        get
    }
}

export const picker = Picker()