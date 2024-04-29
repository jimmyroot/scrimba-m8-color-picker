import { picker } from '../components/picker'

const Header = () => {

    const render = () => {
        node.appendChild(picker.get())
    }

    const get = () => {
        render()
        return node
    }

    const node = document.createElement('header')

    return {
        get
    }
}

export const header = Header()