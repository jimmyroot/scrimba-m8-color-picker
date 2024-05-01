import { picker } from '../components/picker'
import { swatch } from '../components/swatch'

const Home = () => {

    const render = () => {
        node.appendChild(picker.get())
        node.appendChild(swatch.get())
        swatch.registerEventListeners()
    }

    const get = () => {
        render()
        return node
    }

    const node = document.createElement('main')

    return {
        get
    }
}

export const home = Home()