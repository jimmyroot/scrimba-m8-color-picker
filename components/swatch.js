import { generator } from "../data/generator"
import { PREFS } from "../utils/constants"
import { toggleSpinner, scrollToTop } from "../utils/utils"
import { picker } from "./picker"

const Swatch = () => {

    // This is the main object that contains the schemes & alt schemes,
    // and houses the functions to add new schemes and navigate back/forward
    const colorSchemes = {
        schemes: [],
        currentIndex: 0,
        new: function(newScheme, altSchemes) {
            if (newScheme && altSchemes) this.schemes.unshift({
                'scheme': newScheme, 
                'altSchemes': altSchemes
            })
            this.currentIndex = 0
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
            // Selecting a color from mini swatch previews
            select: async () => {
                handleAltSchemeClick(e.target.dataset)
            },
            // Like a color
            like: () => {
                like(e.target)
            },
            // Copy a color
            copy: () => {
                copy(e.target)
            }
        }
        const { type } = e.target.dataset
        if (type && execute[type]) execute[type]()
    }

    const handleAltSchemeClick = async dataset => {
        const { schemeData } = dataset
        const [ mode, seed ] = schemeData.split(',')

        const options = {
            'seed': seed,
            'mode': mode,
            'count': PREFS.count
        }

        toggleSpinner() // Must happen before we start async fetch

        const newScheme = await generator.getSchemeFromSeed(options)
        const altSchemes = await generator.getAlternativeSchemes(newScheme)
        setScheme(newScheme, altSchemes)
    }

    // Here we can manipulate the object in some way before passing it to the colorSchemes.new() function
    // to be added to the schemes array
    const setScheme = (newScheme, altSchemes) => {
        if (newScheme && altSchemes) {
            // Add a prop to keep track of likes, default it to false
            newScheme.colors.forEach(color => {
                color.liked = false
            })
            colorSchemes.new(newScheme, altSchemes)
        }
    }

    const copy = async target => {
        const { hexId } = target.closest('div').dataset
        try {
            await navigator.clipboard.writeText(hexId);
            target.innerHTML = `<i class='bx bxs-check-square bx-sm'></i>`
            setTimeout(() => {
                target.innerHTML = `<i class='bx bx-copy bx-sm'></i>`
            }, 1000)
        } catch (error) {
            console.error(`Error: `, error)
        }
    }

    const like = target => {
        const { hexId } = target.closest('div').dataset
        const colorToLike = colorSchemes.schemes[0].scheme.colors
            .find(color => color.hex.value === hexId)
        colorToLike.liked = !colorToLike.liked
        refresh()
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
            }
        }
    }

    const renderMainSwatch = colors => {
        try {
            let html = `<section class="section-main-swatch">`
            html += colors.map(color => {
                const colorHexValue = color.hex.value
                const contrast = color.contrast.value
                const classSwatchTxt = contrast === '#000000' ? 'txt-dark' : ``
                const swatchDescrValue = colorHexValue.replace(`#`, ``)
                const swatchDescrName = color.name.value
                const iconHeart = color.liked ? `<i class='bx bxs-heart bx-sm'></i>` : `<i class='bx bx-heart bx-sm'></i>`
                return `
                    <div class="swatch-bar ${classSwatchTxt}" data-hex-id="${colorHexValue}" style="background-color: ${colorHexValue}">
                        <p>
                            <button class="btn" data-type="like">${iconHeart}</button>
                        </p>
                        <p>
                        <button class="btn" data-type="copy"><i class='bx bx-copy bx-sm'></i></button>
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
        const mode = colorSchemes.schemes[index].scheme.mode
        const appEl = document.querySelector('#app')

        // Turn off spinner if it's active
        if (appEl.classList.contains('spinner')) {
            toggleSpinner()
        }

        // Set mode
        picker.setModeValue(mode)

        // Decide what buttons should be enabled (fwd/bk)
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

        scrollToTop()

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