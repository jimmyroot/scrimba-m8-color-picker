const Header = () => {

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
          handleClick(e)
        })
        // Make sure the hamburger menu closes if the user
        // clicks on the page behind it
        document.addEventListener('click', e => {  
            const menu = document.querySelector('.header-menu')     
            if (!e.target.closest('.header-menu') 
                && menu.classList.contains('open') 
                && e.target.id != 'hamburger')  { 
                    toggleHamburger(e.target) 
            }
        })
    }
  
    const handleClick = e => {
        const execute = {
            hamburger: () => {
                toggleHamburger(e.target)
            },
            refresh: () => {
                location.reload()
            }
        }
        const { type } = e.target.dataset
        if (type && execute[type]) execute[type]()
    }

    const toggleHamburger = target => {
        target.classList.toggle('is-active')
        node.querySelector('.header-menu').classList.toggle('open')
    }

    const render = () => {
        const html = `
            <div class="header-wrapper">
                <div>
                    <img class="header-logo-img" src="/logo.png" data-type="refresh" alt="Color Cult logo, a circle containing a color swatch">
                    <h1 class="header-logo" data-type="refresh">Color Cult</h1>
                </div>
                <ul class="header-menu" id="menu">
                    <li>
                        <a href="#">Tools</a>
                    </li>
                    <li>
                        <a href="#">Sign in</a>
                    </li>
                    <li>
                        <a class="sign-up" href="#">Sign up</a>
                    </li>
                </ul>
                <button class="hamburger hamburger--3dy" id="hamburger" type="button" data-type="hamburger">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            </div>
            
        `
        node.innerHTML = html
    }

    const get = () => {
        render()
        registerEventListeners()
        return node
    }

    const node = document.createElement('header')

    return {
        get
    }
}

export const header = Header()