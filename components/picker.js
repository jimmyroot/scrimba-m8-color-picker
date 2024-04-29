import { SCHEME_MODES } from '../utils/constants'

const Picker = () => {

    const registerEventListeners = () => {
        node.querySelector('button').addEventListener('click', e => {
          handleGetSchemeClick(e)
        })
    }
    
    const handleGetSchemeClick = e => {
      const opts = {
        seed: node.querySelector('#seed').value,
        mode: node.querySelector('#mode').value
      }

      console.log(opts)
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