# @vueimple/carousel

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

Simple single carousel component

### Features
* Autoplay
* Multiple slides
* Breakpoints
* Drag and touch slide change (please set draggable=false for your images to avoid not-allowed cursor)

### Options
| Option        | Type                               | Default  | Description                                                                                                                                               |
|---------------|------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| animation     | string                             | 'linear' | animation easing name. "linear", "ease", "ease-in", "ease-out", and "ease-in-out", or a custom "cubic-bezier" value like "cubic-bezier(0.42, 0, 0.58, 1)" |
| arrows        | boolean                            | true     | is show arrows                                                                                                                                            |
| arrowsOutside | boolean                            | false    | is arrows outside of carousel                                                                                                                             |
| autoplay      | number                             | 2000     | animation intervals in milliseconds                                                                                                                       |
| dots          | boolean                            | true     | is show dots                                                                                                                                              |
| dotsOutside   | boolean                            | true     | is dots outside of carousel                                                                                                                               |
| draggable     | boolean                            | true     | allow change slides by drag or touch                                                                                                                      |
| duration      | number                             | 500      | animation duration in milliseconds                                                                                                                        |
| gap           | string                             | '10px'   | gap between slides when more than one slide per page                                                                                                      |
| infinite      | boolean                            | true     | enable infinite slides change. If infinite disabled, left arrow wouldn't show on the first slide and right arrow wouldn't show on the last slide          |
| responsive    | Record<string, ResponsiveSettings> | {}       | responsive settings where property is valid media query min-width value. See below                                                                        |
| slidesPerPage | number                             | 1        | number of slides per page to show                                                                                                                         |

#### Responsive options
All properties are optional

| Option        | Type    | Description                                          |
|---------------|---------|------------------------------------------------------|
| arrows        | boolean | is show arrows                                       |
| arrowsOutside | boolean | is arrows outside of carousel                        |
| autoplay      | boolean | animation intervals in milliseconds                  |
| dots          | boolean | is show dots                                         |
| dotsOutside   | boolean | is dots outside of carousel                          |
| draggable     | boolean | allow change slides by drag or touch                 |
| gap           | string  | gap between slides when more than one slide per page |
| slidesPerPage | number  | number of slides per page to show                    |

### Example
```js
{
    autoplay: 0,
    arrowsOutside: true,
    dotsOutside: false,
    slidesPerPage: 3,
    gap: '20px',
    responsive: {
      800: {
        autoplay: 0,
        slidesPerPage: 1,
        gap: '10px'
      }
    }
  }
}
```

### Methods
* next - go to next slide
* prev - go to previous slide
* goTo(index: number) - go to {index} slide
* start - start animation
* stop = stop animation

### Events
* change - fires before slide change

### Slots
| Name | Description    | Parameters               |
|------|----------------|--------------------------|
| prev | previous arrow |                          |
| next | next arrow     |                          |
| dots | navigation     | current-slide, is-active |
