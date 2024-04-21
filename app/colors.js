const Colors = () => {

    const getSchemeFromSeed = async ( options = {

        seed: '390099',
        mode: 'complement',
        count: 5,
        format: 'json'

    }) => {

        const { seed, mode, count, format} = options
        const endpoint = `${basePath}scheme`
        const query = `?hex=${seed}&mode=${mode}&count=${count}&format=${format}`

        try {
            const options = { method: 'GET' }
            const response = await fetch(`${endpoint}${query}`, options)
            const scheme = await response.json()
            console.log(scheme)
        }
        catch (error) {
            console.error('Error', error)
        }

    }

    const getColorById = async ( id = '390099' ) => {

        const endpoint = `${basePath}id`

        try {
            const query = `?hex=${id}&format=json`
            const path = `${endpoint}${query}`
            const options = {method: 'GET'}
            const response = await fetch(path, options)
            const color = await response.json()
            console.log(color)
        }
        catch (error) {
            console.error('Error: ', error)
        }

    }

    const getSchemePicker = () => {
        const html = `
            <form>
                <label for="color">Color</label>
                <input type="color" id="label" name="label">
                <label for="mode">Mode</label>
                <select id="mode" name="mode">
                    ${modes.map(mode => `<option value="${mode}">${mode}</option>`).join('')}
                </select>
                <button>Get scheme</button>
            </form>
        `
        return html
    }

    const basePath = `https://www.thecolorapi.com/`

    const modes = [
        'monochrome',
        'monochrome-dark',
        'monochrome-light',
        'analogic',
        'complement',
        'analogic-complement',
        'triad',
        'quad'
    ]

    return {
        getSchemeFromSeed,
        getColorById,
        getSchemePicker
    }
}

export const colors = Colors()