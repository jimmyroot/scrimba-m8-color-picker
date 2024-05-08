import { generator } from "../data/generator"
import { addBrightnessProps } from "../utils/utils"
import { PREFS } from "../utils/constants"
import { isLowContrast } from "../utils/utils"
import { picker } from "./picker"

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
            picker.enableButton('btnForward', false)
            refresh()
        },
        back: function() {
            if (this.currentIndex < this.schemes.length-1) {
                this.currentIndex++
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
                const colorHexValue = color.hex.value
                const classSwatchTxt = isLowContrast(colorHexValue) ? 'txt-dark' : ``
                const swatchDescrValue = colorHexValue.replace(`#`, ``)
                const swatchDescrName = color.name.value
                return `
                    <div class="swatch-bar ${classSwatchTxt}" style="background-color: ${colorHexValue}">
                        <p>
                            <button class="btn"><i class='bx bx-heart bx-sm'></i></button>
                        </p>
                        <p>
                        <button class="btn"><i class='bx bx-copy bx-sm'></i></button>
                        </p>
                        <p class="value $">
                            ${swatchDescrValue}
                        </p>
                        <p class="name">
                            ${swatchDescrName}
                        </p>
                    </div>
                `
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
                    const hex = color.hex.value
                    return `<div style="background-color: ${hex}"></div>`
                })
                .join('')
                const mode = scheme.mode
                const hex = (scheme.seed.hex.value).replace('#', '')
                return `
                    <div class="mini-swatch-container" data-type="select" data-scheme-data="${mode},${hex}">
                        <div class="mini-swatch">
                            ${divs}
                        </div>
                        <p>${mode}</p>
                    </div>
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
        const index = colorSchemes.currentIndex
        const length = colorSchemes.schemes.length
        console.log(index, length)
        if (index === 0 && length === 1) {
            picker.enableButton('btnForward', false)
            picker.enableButton('btnBack', false)
        } else if (index === 0 && length > 1) {
            picker.enableButton('btnForward', false)
            picker.enableButton('btnBack', true)
        } else if (index > 0 && index < length-1) {
            picker.enableButton('btnForward', true)
            picker.enableButton('btnBack', true)
        } else {
            picker.enableButton('btnForward', true)
            picker.enableButton('btnBack', false)
        }
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