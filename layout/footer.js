const Footer = () => {

    const render = () => {
        const html = `
            <p>Color Cult</p>
            <p>Copyright Jimmy ©2024</p>
        `
        node.innerHTML = html
    }

    const get = () => {
        render()
        return node
    }

    const node = document.createElement('footer')
    node.classList.add('footer')

    return {
        get
    }
}

export const footer = Footer()