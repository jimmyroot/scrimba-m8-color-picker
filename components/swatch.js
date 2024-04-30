import { picker } from "./picker"

const Swatch = () => {

    const render = () => {

    }

    const refresh = () => {
        console.log('getting scheme and refreshing swatch')
        console.log(picker.getScheme())
    }

    const get = () => {
        return node
    }

    const node = document.createElement('section')

    return {
        get,
        refresh
    }
}

export const swatch = Swatch()