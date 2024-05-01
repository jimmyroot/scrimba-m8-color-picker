import { palette } from "../data/palette"
import { picker } from "./picker"
import { PREFS } from "../utils/constants"

const Swatch = () => {

    // Default scheme when we load
    let scheme = {}
    let altSchemes = []
    let schemeHistory = []

    const registerEventListeners = () => {
        node.addEventListener('click', e => {
            handleClick(e)
        })
    }

    const handleClick = e => {
        const execute = {
            select: async () => {
                const { schemeData } = e.target.dataset
                const [ mode, seed ] = schemeData.split(',')
                const options = {
                    'seed': seed,
                    'mode': mode,
                    'count': PREFS.count
                }
                const newScheme = await palette.getSchemeFromSeed(options)
                setScheme(newScheme)
                
            }
        }
        const { type } = e.target.dataset
        if (type && execute[type]) execute[type]()
    }


    // Proxy trap handlers
    const handleScheme = {
      set: (target, prop, val) => {
        Reflect.set(target, prop, val)
        if (prop === 'colors') refresh()
        return true
      },
      get: (target, prop) => {
        return Reflect.get(target, prop)
      }
    }

    // Set up a proxy to 'intercept' the scheme objects functions, so we can auto re-render
    // every time a new scheme is generated. I know there's easier ways 
    // (like manually calling refresh) but wanted to explore this as thought 
    // it was cool
    const schemeProxy = new Proxy(scheme, handleScheme)

    const setScheme = newScheme => {
        const { colors, count, mode, seed } = newScheme

        // The order is important: colors must be last, as this triggers a 
        // re-render of the swatch component
        schemeProxy.count = count
        schemeProxy.mode = mode
        schemeProxy.seed = seed
        schemeProxy.colors = colors
    }

    const setAltSchemes = schemes => {
        altSchemes = schemes
    }

    const render = () => {
        let html = `
            ${renderMainSwatch(scheme.colors)}
            ${renderAlternativeSwatches(altSchemes, scheme.mode)}
        `
        return html
    }

    const renderMainSwatch = colors => {
        try {
            let html = `<section class="section-main-swatch">`
            html += colors.map(color => {
                console.log(color)
                return `<div style="background-color: ${color.hex.value}">
                            <p>${color.hex.value}</p>
                            <p>${color.name.value}</p>
                        </div>`
            })
            .join('')
            .concat('</section>')
            return html
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    const renderAlternativeSwatches = ( altSchemes, excludeMode ) => {
        try {
            let html = `<section class="section-mini-swatches">`
            html += altSchemes.map(scheme => {
                if (scheme.mode === excludeMode) return
                const divs = scheme.colors.map(color => {
                    return `<div style="background-color: ${color.hex.value}"></div>`
                })
                .join('')
                const mode = scheme.mode
                const hex = (scheme.seed.hex.value).replace('#', '')
                return `
                    <div class="mini-swatch" data-type="select" data-scheme-data="${mode},${hex}">${divs}</div>
                `
            })
            .join('')
            .concat('</section>')
            return html
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    const refresh = () => {
        node.innerHTML = render()
    }

    const get = () => {
        refresh()
        return node
    }

    const node = document.createElement('section')
    node.classList.add('section-swatches')

    return {
        get,
        refresh,
        setScheme,
        setAltSchemes,
        registerEventListeners
    }
}

export const swatch = Swatch()