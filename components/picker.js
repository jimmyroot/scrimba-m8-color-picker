import { SCHEME_MODES } from '../utils/constants'

const Picker = () => {

    const render = () => {
        const html = `
            
                <label for="color">Color</label>
                <input type="color" id="label" name="label">
                <label for="mode">Mode</label>
                <select id="mode" name="mode">
                    ${SCHEME_MODES.map(mode => `<option value="${mode}">${mode}</option>`).join('')}
                </select>
                <button type="submit">Get scheme</button>

        `

        return html
    }

    const refresh = () => {
        node.innerHTML = render()
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