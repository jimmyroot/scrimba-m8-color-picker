# Project Write-Up: Color Scheme Generator

## About the project

This project is the first solo project from Module 8 of the Scrimba FrontEnd Dev Career path. In this module we are introduced to APIs, and therefore the object of this project is to utilise The Color API ([www.thecolorapi.com](http://www.thecolorapi.com)) to build a simple, functional Color Scheme Generator app. 

Of course, I had a few extra ideas as I started to pull this one together which needed some extra research…so here is a sort of ‘play by play’ commentary of the project as I worked my way through it. 

This document is a bit of a jumble although I tried to keep some sense of order to it. I mainly talk about the design/thought process and how I solved a few issues that I came across as I developed the project…hopefully it’s helpful in some way, to someone!

First, here’s the ‘finished’ project in desktop and mobile guise.

![color-cult-desktop.png](/images/).png)

![color-cult-mobile.png](/images/color-cult-mobile.png)

### Planning

So I like to give my projects a name a the start, it’s like a little ritual that helps me feel ‘locked in’ to the project—don’t ask...anyway after a few minutes of ChatGPT-augmented brainstorming I decided on ‘Color Cult’. Time to get some visuals down, as I straight away wanted to change a few things about the provided Figma design.

I started a new document and put the following together (shamelessly drawing inspiration from another popular online color generator). It grew beyond this in the end, but this is what I started with.

![Figma design](/images/figma-design.png)

Figma design

If you’re anything like me, designing in Figma often stimulates my thinking about the way an app should work from a UX and code perspective; thus whilst working on the above, the following ideas started to form.

- The app would be designed in the modular style that I’ve gotten used to
- It would show more information about the colors (name, etc)
- It would have a button on each color to copy the value to the clipboard and another to ‘like’ a color
- I wanted to implement the swatch as a standalone module that auto reloads whenever the color scheme is updated
- There should be some kind of ‘history’ function so you can go back to another scheme you liked (or move back and forth between schemes)
- A button to generate a random seed and get the scheme (same function to be used when loading the app)
- When playing with The Color API, I noticed it had a cool feature where it also returns all the alternative schemes for a given seed. Wouldn’t it be cool to have a little ‘mini swatch’ underneath the main one, where you could preview and then click on and load the alternative schemes? That might be too much work but let’s see...(spoiler, it wasn’t too bad)

## Implementation (the non boring bits)

### Overview

I knew I wanted a few modules for different functions, after some initial tweaking these turned out to be…

- generator.js - would house all api functions for interacting with The Color API
- picker.js - would house the components for selecting a color and mode and then interact with generator.js
- swatch.js - would house all code for storing the schemes, navigating the scheme history, and rendering the main scheme swatch and the ‘mini swatches’ for alternate schemes
- the rest are typical of what I’ve been using in other projects…header.js, footer.js, utils.js and pages, in this case only one - home.js

### Basics and header, picker

Having put my basic modular framework in place (I’ve started using Object style modules as described [here](https://dev.to/bytebodger/replacing-javascript-classes-with-the-module-design-pattern-48bl)), I first fleshed out the .js file that contains all the functionality to grab the colors/schemes from the API. I called it generator.js

This was pretty straight forward thanks to the excellent tuition so far in Module 8. Although I did end up switching all the fetch…then statements for the ‘const x = await.fetch()’ style syntax, as I remember using this for some of the 2023 Javascriptmas challenges and it felt more natural.

From the looks of it there is more coming up on async/await in the next half of Module 8.

For the color picker, I initially built all the elements into the header component, but quickly moved them out into their own ‘picker’ component (keeps header simpler with header just containing logo and nav mockup). The color picker, selection dropdown for mode, and ‘Get Scheme’ buttons all live in the picker module/component. 

I built the picker first as a form, but wondered whether these input elements along with their labels actually needed to be in a form. A quick google said that they did not, and would still be valid HTML5, so I got rid of that and grouped them with divs instead to keep it simpler. A form didn’t make much sense to me as I’m not really collecting data, as such.

### Adding a scheme, and swatch view refresh

This was probably the part of the project that took the longest. I knew I was overcomplicating it a bit but I wanted to come up with a robust scheme update/re-render ‘flow’ so that the behaviour would be easy to modify in future, as I’ll probably come back to this and build it out further in future.

~~So, the current scheme is pulled from The Color API after the ‘Get Scheme’ button is clicked (simple stuff grabbing the values, combining into the path for the API request, etc).~~ 

~~I then pull the relevant bits from the response and store them as properties on an object called `schemes`.~~ 

~~At this point I thought it would be cool if there was a way to somehow watch this object (like an event listener) and auto re-render the color swatch every time the scheme object was updated. It seems like a lot of work to set up, but it would eventually save me having refresh() calls all over the place (most of my modules have a refresh function that re-renders the module)~~

~~I googled for ‘is there a way to watch a javascript object for changes’. At the top of the list was this post…~~

- [~~https://medium.com/@suvechhyabanerjee92/watch-an-object-for-changes-in-vanilla-javascript-a5f1322a4ca5#:~:text=Method 2%3A Object.prototype.,watched property of the object](https://medium.com/@suvechhyabanerjee92/watch-an-object-for-changes-in-vanilla-javascript-a5f1322a4ca5#:~:text=Method%202%3A%20Object.prototype.,watched%20property%20of%20the%20object).~~

~~…which, after having read, triggered some curiosity about the Proxy object. I googled for that and read all or part of these articles, after which I decided to try and use it to achieve the above end.~~

- [~~https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy~~](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [~~https://www.freecodecamp.org/news/javascript-proxy-object/~~](https://www.freecodecamp.org/news/javascript-proxy-object/)
- [~~https://javascript.info/proxy~~](https://javascript.info/proxy)
- [~~https://medium.com/sessionstack-blog/how-javascript-works-proxy-and-reflect-11748452c695](https://medium.com/sessionstack-blog/how-javascript-works-proxy-and-reflect-11748452c695) — this is a very long one that I mostly skimmed over to the relevant bits~~
- ~~and finally [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)~~

~~Essentially, the proxy object, at least as I understand it, allows you to intercept the default internal functions of a Javascript object and perform some additional logic in between. I created a proxy with trap handlers for the ‘set’ and ‘get’ functions of my scheme object, which looks like this…,~~

```jsx
// Default scheme when we load
    let scheme = {}

    // Proxy trap handlers
    const handleScheme = {
      set: (target, prop, val) => {
        Reflect.set(target, prop, val)
        if (prop === 'colors') swatch.refresh()
        return true
      },
      get: (target, prop) => {
        return Reflect.get(target, prop)
      }
    }

    // Set up a proxy to 'watch' the scheme object, so we can auto re-render
    // every time a new scheme is generated. I know there's easier ways 
    // (like manually calling refresh) but wanted to explore this as thought 
    // it was cool
    const schemeProxy = new Proxy(scheme, handleScheme)

```

~~I know it’s not immediately clear from the above, but the gist is that ‘swatch.refresh()’ will be called every time the colors property of the scheme object is set.~~

~~Initially I put all this code into the picker module, but then realised it would probably make more sense to have it all in the swatch module instead, so I moved it all over and tweaked it to work in it’s new home.~~

Ok, ended up scrapping that plan completely as 

- I couldn’t make it work when unshifting to an array that was a prop of the object
- It seemed unnecessarily hard to read, and really just unnecessary overall

Instead, I created a function on the object that sort of mimics the proxy behaviour. Again this is a bit overkill as I could of just created normal functions in the module to do all of this…but it seemed cleaner to wrap all the functionality up into an object, which also allowed use of the ‘this’ keyword to keep things easier to read.

To add a new scheme I’m sending the scheme and it’s alternatives to the `new()`  function on the colorSchemes object, which then unshifts it to the `schemes` array and then calls `refresh()` to update the view.

Rather than accessing the new() function directly, I use a separate function `setScheme().` 

Why a separate function? 

I wanted to manipulate the scheme object by adding an extra prop for ‘likes’ to each color in the scheme object returned by the color api (so we can ‘like’ colors later). So any manipulation can happen in setScheme() and then we pass the complete scheme to `colorSchemes.new()`.

This turned out to be quite useful, as I was able to add back and forward functions here, to navigate through the array of schemes and render them back to the screen. History feature…check.

The `colorSchemes` object lives in the swatch.js module. Code, plus things to note, below:

- Use of function() instead of arrow functions, by using function() we are able to use the ‘this’ keyword which isn’t available with arrow functions
- By using unshift we know that schemes[0] is always the most recent scheme, which seems a bit neater than pushing it to the end of the array and means we can always just set currentIndex = 0 when adding a new scheme. Otherwise it would be the more awkward currentIndex = schemes.length-1

```jsx
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
```

### Alternative schemes

Pretty straight forward, grab the links for the alternate schemes, use map to loop through the alt links array and call `getSchemeFromPath()` passing in the link/url/path whatever you wanna call it. 

I couldn’t get this to work for a while, then read somewhere I would need to use `await Promise.all()` to make sure that all api calls inside map (in `getSchemeFromPaths()`) were finished before continuing. Not sure if this is correct usage, but it does what I wanted it to do…so it’s a win in my book.

```jsx
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
```

### Get scheme button, swatch coloring, and contrast

At some point I decided I wanted the Get Scheme button to stay in sync with the currently selected color in the picker. This turned out to be quite easy, just taking the value of the picker on the ‘input’ event and setting the background of the button to the same. 

But, new problem…when the color got too light, the text on the button wasn’t readable. Same issue on the swatch colors, when a light color is generated.

I tried a couple of things…first I read [this](https://css-tricks.com/methods-contrasting-text-backgrounds/) and attempted to implement it.

This method used a combination of clipping and filtering to render text inverted against it’s background both on the Get Scheme button and the swatches. It worked and the text remained readable, but the result wasn’t pleasing to my eye…the inverted colors just looked off/garish.

Attempt two involved a quick and dirty calculation with some simple logic and tuning to determine whether or not to show white or black text based on the contrast levels of the text and the background. 

I think it’s a very crude solution but it does give the desired effect, which you can see by selecting a few different light and dark colors from the color picker while observing the Get Scheme button. 

- Convert the hex value to a HSL value (loads of useful [color space conversion functions here](https://css-tricks.com/converting-color-spaces-in-javascript/))
- Calculate the relative ratio of the L (luminance) to a luminance value of our choice (1 - 100) following [the info here](https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o) - I since discovered other libraries with functions for doing this but I’d already written my own and spent enough time on this project already. In future will use [something like color.js](https://colorjs.io)
- Do some other quick and dirty checks (e.g.  cyan, green and yellow are difficult to see text against so they need slightly different treatment
- If the contrast ratio is too low, change the text to it’s dark variant (use a CSS class for simplicity)

```jsx
const isLowContrast = ( hex, baseLum ) => {
    const [ hue, sat, lum ] = hexToHSL(hex)
    const contrastRatio = (lum + 0.05) / (baseLum + 0.05)
    if (contrastRatio < 0.73) {
        if (hue >= 45 && hue <= 185) {
            if (sat < 38) { 
                return false
            } else if (lum < 49) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    } else {
        return true
    }
}
```

Not pretty but it did the trick.

### Hamburger menu

Found a cool little CSS library of animated hamburger menus, [check it out here](https://jonsuh.com/hamburgers/). Super easy to use, just import the CSS file and follow the instructions on the page. It’s also available via all the popular package managers although I didn’t try it that way.

### CSS notes

Nothing really to mention here. Used a semi modular approach with the CSS, separating the files out and using @import statements to bring everything together. I didn’t use full blown CSS modules as they don’t seem to work in scrims yet. Maybe I should test this in the Scrimba 2.0 beta scrim editor? New things I tried with CSS in this project were the blend modes, to make the text in each color ‘bar’ look a bit nicer (I think, anyway…just slightly blends the color in with the background)

In summary:

- Semi modular CSS
- Heavy use of CSS nesting
- Everything pretty much standard with media queries, except it was more of a ‘desktop first’ design, working back toward mobile

# Refactor, final bugs/tweaks

Had a few little issues to sort out at the end, including but not limited to…

- Safari iPhone scroll (think this some odd Safari behaviour on iPhone)
- Pulling messy code out of anonymous event listener callbacks and into standalone functions
- Delete unwanted code, extra comments, etc, the usual stuff
