import { colors } from '../app/colors'
import { picker } from '../components/picker'

const Home = () => {

    const render = () => {
        node.appendChild(picker.get())
    }

    const get = () => {
        render()
        return node
    }

    const node = document.createElement('main')

    // colors.getColourById()
    // colors.getSchemeFromSeed()

    return {
        get
    }
}

export const home = Home()