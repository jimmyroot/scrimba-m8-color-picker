const Header = () => {

    const render = () => {
        const html = `
            <div class="header-wrapper">
                <div>
                    <h1>Color Cult</h1>
                </div>
                <div>
                    <ul id="menu">
                        <li>
                            <a href="#">Tools</a>
                        </li>
                        <li>
                            <a href="#">Sign in</a>
                        </li>
                        <li>
                            <a href="#">Sign up</a>
                        </li>
                    </ul>
                </div>
            </div>
            
        `
        node.innerHTML = html
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