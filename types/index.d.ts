export {};

type ResponsiveSettings = {
    arrows?: boolean
    arrowsOutside?: boolean
    autoplay?: number
    dots?: boolean
    dotsOutside?: boolean
    draggable?: boolean
    gap?: string
    slidesPerPage?: number
}

type Settings = {
    animation: string
    arrows: boolean
    arrowsOutside: boolean
    autoplay: number
    dots: boolean
    dotsOutside: boolean
    draggable: boolean
    duration: number
    gap: string
    infinite: boolean,
    responsive: Record<string, ResponsiveSettings>
    slidesPerPage: number
}

export type {ResponsiveSettings, Settings};

declare module '@vueimple/carousel' {
    import type {ComponentPublicInstance} from 'vue';

    export interface Carousel extends ComponentPublicInstance {
        prev: () => void
        next: () => void
        goTo: (index: number) => void
    }
}
