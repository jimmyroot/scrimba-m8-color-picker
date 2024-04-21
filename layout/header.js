import { colors } from '../app/colors'

const Header = () => {

    const render = () => {
        const html = `
            ${colors.getSchemePicker()}
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

    const node = document.createElement('header')

    return {
        get
    }
}

export const header = Header()