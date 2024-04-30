import { SCHEME_MODES } from '../utils/constants'
import { palette } from '../data/palette'
import { swatch } from './swatch'


const Picker = () => {

    // Default scheme when we load
    let defaultSeed = ''
    let scheme = {}
    let schemeHistory = []

    // Proxy trap handlers
    const handleScheme = {
      set: (target, prop, val) => {
        Reflect.set(target, prop, val)
        if (prop === 'colors') swatch.refresh()
        return true
      },
      get: (target, prop) => {
        return Reflect.get(target, prop)
      }
    }

    // Set up a proxy to 'watch' the scheme object, so we can auto re-render
    // every time a new scheme is generated. I know there's easier ways 
    // (like manually calling refresh) but wanted to explore this as thought 
    // it was cool
    const schemeProxy = new Proxy(scheme, handleScheme)

    const registerEventListeners = () => {
        node.querySelector('button').addEventListener('click', () => {
          handleGetSchemeClick()
        })
    }
    
    const handleGetSchemeClick = async () => {
      const options = {
        seed: node.querySelector('#seed').value.replace('#', ''),
        mode: node.querySelector('#mode').value,
        count: 5
      }

      const newScheme = await palette.getSchemeFromSeed(options)

      const { colors, count, mode, seed, _links } = newScheme

      // The order is important: colors must be last, as this triggers a 
      // re-render of the swatch component
      schemeProxy.count = count
      schemeProxy.mode = mode
      schemeProxy.seed = seed
      schemeProxy.alternative = _links.schemes
      schemeProxy.colors = colors

      // console.log(scheme)
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

    const getScheme = () => {
      return scheme
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('div')

    return {
        get,
        getScheme
    }
}

export const picker = Picker()