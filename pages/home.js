import { picker } from '../components/picker'
import { swatch } from '../components/swatch'

const Home = () => {

    const render = async () => {
        node.appendChild(await picker.get())
        node.appendChild(swatch.get())
        swatch.registerEventListeners()
    }

    const get = () => {
        render()
        return node
    }

    const toggleEventDisable = () => {
        node.classList.toggle('no-click')
    }

    const node = document.createElement('main')
    node.classList.add('main')

    return {
        get,
        toggleEventDisable
    }
}

export const home = Home()