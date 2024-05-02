import { generator } from "../data/generator"
import { addBrightnessProps } from "../utils/utils"
import { PREFS } from "../utils/constants"

const Swatch = () => {

    // Default scheme when we load
    const colorSchemes = {
        schemes: [],
        currentIndex: 0,
        new: function(newScheme, altSchemes) {
            if (newScheme && altSchemes) this.schemes.unshift({
                'scheme': newScheme, 
                'altSchemes': altSchemes
            })
            this.currentIndex = 0
            console.log(`index: ${this.currentIndex}`)
            refresh()
        },
        back: function() {
            if (this.currentIndex < this.schemes.length-1) {
                this.currentIndex++
                console.log(`index: ${this.currentIndex}`)
            }
            refresh()
        },
        forward: function() {
            if (this.currentIndex > 0) {
                this.currentIndex--
                console.log(`index: ${this.currentIndex}`)
            }
            refresh()
        }
    }

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
                const newScheme = await generator.getSchemeFromSeed(options)
                const altSchemes = await generator.getAlternativeSchemes(newScheme)
                setScheme(newScheme, altSchemes)
            }
        }
        const { type } = e.target.dataset
        if (type && execute[type]) execute[type]()
    }

    const setScheme = (newScheme, altSchemes) => {
        addBrightnessProps(newScheme)
        colorSchemes.new(newScheme, altSchemes)
    }

    const render = () => {
        if (colorSchemes.schemes[0]) {
            try {
                const index = colorSchemes.currentIndex
                const { scheme, altSchemes } = colorSchemes.schemes[index]

                let html = `
                    ${renderMainSwatch(scheme.colors)}
                    ${renderAlternativeSwatches(altSchemes, scheme.mode)}
                `
                return html
            } catch (error) {
                console.error('Error: ', error)
            } finally {

            }
        }
    }

    const renderMainSwatch = colors => {
        try {
            let html = `<section class="section-main-swatch">`
            html += colors.map(color => {
                const txtColorClass = color.brightness >= 320 ? 'txt-overlay-dark' : 'txt-overlay-light'
                return `<div style="background-color: ${color.hex.value}">
                            <p class="${txtColorClass}">${color.hex.value}</p>
                            <p class="${txtColorClass}">${color.name.value}</p>
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
        registerEventListeners,
        colorSchemes
    }
}

export const swatch = Swatch()