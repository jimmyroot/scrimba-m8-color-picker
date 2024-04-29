import { colors } from '../app/colors'

const Home = () => {

    const render = () => {
        const html = `
           <p>body</p>
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

    const node = document.createElement('main')

    // colors.getColourById()
    // colors.getSchemeFromSeed()

    return {
        get
    }
}

export const home = Home()