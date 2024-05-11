const Generator = () => {

    const getSchemeFromSeed = async ( options = {

        seed: '390099',
        mode: 'complement',
        count: 5

    }) => {

        const { seed, mode, count } = options
        const endpoint = `${basePath}scheme`
        const query = `?hex=${seed}&mode=${mode}&count=${count}`
        const headers = { method: 'GET' }

        try {
            const response = await fetch(`${endpoint}${query}&format=json`, headers)
            const scheme = await response.json()
            return scheme
        } catch (error) { 
            console.error('Error: ', error)
        }
    }

    const getSchemeFromPath = async path => {

        const endpoint = basePath
        const query = path.replace('/', '')
        const headers = { method: 'GET' }

        try {
            const response = await fetch(`${endpoint}${query}&format=json`, headers)
            const scheme = await response.json()
            return scheme
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    // Get's a single color by it's ID
    // Wrote this but didn't use it in the end, keeping it around
    // as it might be useful in future...

    // const getColorById = async ( id = '390099' ) => {

    //     const endpoint = `${basePath}id`

    //     try {
    //         const query = `?hex=${id}&format=json`
    //         const path = `${endpoint}${query}`
    //         const options = {method: 'GET'}
    //         const response = await fetch(path, options)
    //         const color = await response.json()
    //         return color
    //     } catch (error) {
    //         console.error('Error: ', error)
    //     }
    // }

    const getAlternativeSchemes = async scheme => {
        try {
            const paths = scheme._links.schemes
            const schemes = await Promise.all(
                Object.keys(paths)
                    .map(async key => {
                        return await getSchemeFromPath(paths[key])
            }))
            return schemes
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    const basePath = `https://www.thecolorapi.com/`

    return {
        getSchemeFromSeed,
        getSchemeFromPath,
        getAlternativeSchemes
    }
}

export const generator = Generator()