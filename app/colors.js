const Colors = () => {

    const getSchemeFromSeed = async ( options = {

        seed: '390099',
        mode: 'complement',
        count: 5,
        format: 'json'

    }) => {

        const { seed, mode, count, format } = options
        const endpoint = `${basePath}scheme`
        const query = `?hex=${seed}&mode=${mode}&count=${count}&format=${format}`
        const headers = { method: 'GET' }

        try {
            const response = await fetch(`${endpoint}${query}`, headers)
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

    const basePath = `https://www.thecolorapi.com/`

    return {
        getSchemeFromSeed,
        getColorById,
    }
}

export const colors = Colors()