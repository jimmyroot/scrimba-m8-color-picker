const randomHexVal = () => {
    let hex = ''
    for (let i = 0; i <= 2; i++) {
        let val = Math.floor(Math.random() * 255).toString(16)
        if (val.length < 2) val = '0' + val
        hex += val
    }
    return hex
}

const addBrightnessProps = scheme => {
    const { colors } = scheme
    colors.forEach(color => {
        const swatchColor = color.hex.value
        let [ red, green, blue ] = swatchColor.replace('#', '').match(/[\s\S]{1,2}/g)
        red = +('0x' + red)
        green = +('0x' + green)
        blue = +('0x' + blue)
        const brightness = (red + green + blue)
        color.brightness = brightness
    })
}

export { randomHexVal, addBrightnessProps }