<template>
    <div
        class="carousel"
        @mouseenter="stop"
        @mouseleave="start"
        @touchstart="_dragStart($event.touches[0].clientX)"
        @touchmove="_dragMove($event.changedTouches[0].clientX)"
        @touchend="_dragEnd($event.changedTouches[0].clientX)"
        @mousedown="_dragStart($event.clientX)"
        @mousemove="_dragMove($event.clientX)"
        @mouseup="_dragEnd($event.clientX)"
    >
        <div class="carousel-wrapper">
            <div
                v-if="arrows && slidesCount !== slidesPerPage && (innerSettings.infinite || currentSlide !== 0)"
                class="arrow prev"
                :class="arrowsPosition"
                @click="prev"
            >
                <slot name="prev">
                    <img
                        src="@/assets/arrow.svg"
                        alt="prev"
                        class="default-arrow"
                    >
                </slot>
            </div>

            <div class="slider-wrapper">
                <div
                    ref="slider"
                    class="slider"
                    :class="{draggable: draggable}"
                    :style="`gap: ${gap}; transform: translateX(${translateX}px)`"
                >
                    <div
                        v-for="(slide, index) in slides"
                        :key="index"
                        :data-index="index"
                        class="slide"
                        :style="`order: ${index}; flex-basis: ${slideWidth};`"
                    >
                        <slide :content="slide" />
                    </div>
                </div>
            </div>

            <div
                v-if="arrows && slidesCount !== slidesPerPage && (innerSettings.infinite || currentSlide !== slidesCount - 1)"
                class="arrow next"
                :class="arrowsPosition"
                @click="next"
            >
                <slot name="next">
                    <img
                        src="@/assets/arrow.svg"
                        alt="next"
                        class="default-arrow default-next"
                    >
                </slot>
            </div>
        </div>

        <div
            v-if="dots && slidesCount !== innerSettings.slidesPerPage"
            class="dots"
            :class="dotsPosition"
        >
            <div
                v-for="i in slidesCount"
                :key="i"
                @click="goTo(i - 1)"
            >
                <slot
                    name="dots"
                    :current-slide="i - 1"
                    :is-active="i - 1 === currentSlide"
                >
                    <div
                        class="default-dot"
                        :class="{'active': i - 1 === currentSlide}"
                    />
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent, PropType, VNode, Fragment, Comment, Text} from 'vue';
    import {ResponsiveSettings, Settings} from '../../types';

    type Breakpoint = {max: number, settings: ResponsiveSettings};

    function getElementVNodes(slot: VNode, childSlots: VNode[] = []): VNode[] {
        if (slot.type === Fragment && Array.isArray(slot.children)) {
            slot.children
                .filter((child) => child && typeof child === 'object')
                .forEach((child) => getElementVNodes(child as VNode, childSlots));
        } else {
            childSlots.push(slot);
        }

        return childSlots;
    }

    export default defineComponent({
        name: 'VueimpleCarousel',
        components: {
            slide: defineComponent({
                props: {
                    content: {
                        type: Object as PropType<VNode>,
                        required: true,
                    },
                },
                render(): VNode | void | null {
                    return this.content;
                },
            }),
        },
        props: {
            settings: {
                type: Object as PropType<Partial<Settings>>,
                required: false,
            },
        },
        emits: ['change'],
        data() {
            return {
                autoplayId: 0,
                breakpoints: [] as Breakpoint[],
                currentResponsiveSettings: {} as ResponsiveSettings,
                currentSlide: 0,
                innerSettings: {
                    animation: 'linear',
                    arrows: true,
                    arrowsOutside: false,
                    autoplay: 2000,
                    dots: true,
                    dotsOutside: true,
                    draggable: true,
                    duration: 500,
                    gap: '10px',
                    infinite: true,
                    responsive: {},
                    slidesPerPage: 1,
                } as Settings,
                isMoving: false,
                moveDirection: 'none',
                moveSlide: 0,
                sliderWidth: 0,
                startX: 0,
                translateX: 0,
            };
        },
        computed: {
            arrows(): boolean {
                if (this.currentResponsiveSettings.arrows === undefined) {
                    return this.innerSettings.arrows;
                } else {
                    return this.currentResponsiveSettings.arrows;
                }
            },
            arrowsPosition(): 'inside' | 'outside' {
                if (this.currentResponsiveSettings.arrowsOutside === undefined) {
                    return this.innerSettings.arrowsOutside ? 'outside' : 'inside';
                } else {
                    return this.currentResponsiveSettings.arrowsOutside ? 'outside' : 'inside';
                }
            },
            autoplay(): number {
                return this.currentResponsiveSettings.autoplay === undefined ? this.innerSettings.autoplay : this.currentResponsiveSettings.autoplay;
            },
            dots(): boolean {
                if (this.currentResponsiveSettings.dots === undefined) {
                    return this.innerSettings.dots;
                } else {
                    return this.currentResponsiveSettings.dots;
                }
            },
            dotsPosition(): 'inside' | 'outside' {
                if (this.currentResponsiveSettings.dotsOutside === undefined) {
                    return this.innerSettings.dotsOutside ? 'outside' : 'inside';
                } else {
                    return this.currentResponsiveSettings.dotsOutside ? 'outside' : 'inside';
                }
            },
            draggable(): boolean {
                if (this.slidesCount <= this.slidesPerPage) {
                    return false;
                }

                if (this.currentResponsiveSettings.draggable === undefined) {
                    return this.innerSettings.draggable;
                } else {
                    return this.currentResponsiveSettings.draggable;
                }
            },
            gap(): string {
                return this.currentResponsiveSettings.gap || this.innerSettings.gap;
            },
            gapPx(): number {
                if (this.gap.endsWith('%')) {
                    return this.sliderWidth * parseInt(this.gap.substring(0, this.gap.length - 1)) * 0.01;
                } else {
                    return parseInt(this.gap.substring(0, this.gap.length - 2));
                }
            },
            slides(): VNode[] {
                if (this.$slots.default) {
                    return this.$slots.default()
                        .reduce((elementSlots, slot) => [...elementSlots, ...getElementVNodes(slot)], [] as VNode[])
                        .filter((slot) => slot.type !== Comment && slot.type !== Text);
                }

                return [];
            },
            slidesCount(): number {
                return this.slides.length;
            },
            slidesPerPage(): number {
                return this.currentResponsiveSettings.slidesPerPage || this.innerSettings.slidesPerPage;
            },
            slideWidth(): string {
                return `calc((100% - ${this.slidesPerPage - 1} * ${this.gap}) / ${this.slidesPerPage})`;
            },
            slideWidthPx(): number {
                return (this.sliderWidth - (this.slidesPerPage - 1) * this.gapPx) / this.slidesPerPage;
            },
            slideWidthWithGapPx(): number {
                return this.gapPx + this.slideWidthPx;
            },
        },
        methods: {
            _animate(from: number, to: number, duration?: number) {
                const slider = this.$refs.slider as HTMLElement;

                return slider.animate([
                    {
                        transform: `translateX(${from}px)`,
                    },
                    {
                        transform: `translateX(${to}px)`,
                    }], {
                    duration: duration === undefined ? this.innerSettings.duration : duration,
                    easing: this.innerSettings.animation,
                    iterations: 1,
                });
            },
            _dragStart(startX: number) {
                if (this.draggable) {
                    this.startX = startX;
                    this.isMoving = true;
                }
            },
            _dragMove(point: number) {
                if (this.isMoving) {
                    const moveX = point - this.startX;

                    if (moveX > 0) { // prev
                        if (this.moveSlide && this.moveDirection === 'next') {
                            this.moveSlide--;

                            this._reorder(1);
                        }

                        this.moveDirection = 'prev';

                        if (moveX > this.slideWidthWithGapPx * this.moveSlide) {
                            this.moveSlide++;

                            this._reorder(1);
                        }

                        if (this.slideWidthWithGapPx * this.moveSlide - moveX > this.slideWidthWithGapPx) {
                            this.moveSlide--;

                            this._reorder(-1);
                        }

                        this.translateX = moveX - this.moveSlide * this.slideWidthWithGapPx;
                    } else if (moveX < 0) { // next
                        if (this.moveSlide && this.moveDirection === 'prev') {
                            this.moveSlide--;

                            this._reorder(-1);
                        }

                        this.moveDirection = 'next';

                        const availableWidth = this.slideWidthWithGapPx * (this.moveSlide + this.slidesCount - this.slidesPerPage);

                        if (-moveX > availableWidth) {
                            this.moveSlide++;

                            this._reorder(-1);
                        }

                        if (this.moveSlide && availableWidth + moveX > this.slideWidthWithGapPx) {
                            this.moveSlide--;

                            this._reorder(1);
                        }

                        this.translateX = moveX + this.moveSlide * this.slideWidthWithGapPx;
                    }
                }
            },
            _dragEnd(endX: number) {
                if (this.isMoving) {
                    if (this.startX - endX > 30) { // next
                        const slideDiff = Math.ceil(-this.translateX / this.slideWidthWithGapPx);
                        let nextSlide = this.currentSlide + slideDiff;

                        if (nextSlide >= this.slidesCount) {
                            nextSlide = nextSlide - this.slidesCount;
                        }

                        this.$emit('change', this.currentSlide, nextSlide);

                        this._animate(this.translateX, -slideDiff * this.slideWidthWithGapPx).addEventListener('finish', () => {
                            this._reorder(-(slideDiff - this.moveSlide));
                        });

                        this.currentSlide = nextSlide;
                    }

                    if (this.startX - endX < -30) { // prev
                        let nextSlide = this.currentSlide - this.moveSlide;

                        if (nextSlide < 0) {
                            nextSlide = this.slidesCount + nextSlide;
                        }

                        this.$emit('change', this.currentSlide, nextSlide);

                        this._animate(this.translateX, 0);

                        this.currentSlide = nextSlide;
                    }

                    if (this.startX - endX < 0 && this.startX - endX > -30) { // reset prev
                        this._reorder(-1);
                    }

                    this.moveSlide = 0;
                    this.startX = 0;
                    this.translateX = 0;
                    this.isMoving = false;
                }
            },
            _reorder(multiplier: number) {
                const slider = this.$refs.slider as HTMLElement;
                const childrenCount = slider.children.length;

                for (let i = 0; i < childrenCount; i++) {
                    const child = (slider.children[i] as HTMLElement);
                    const style = child.style;
                    const order = Number.parseInt(style.order);

                    let newOrder = order + multiplier;

                    if (newOrder >= childrenCount) {
                        newOrder = newOrder - childrenCount;
                    }

                    if (newOrder < 0) {
                        newOrder = childrenCount + newOrder;
                    }

                    style.order = newOrder.toString();
                }
            },
            _resize() {
                this.sliderWidth = (this.$refs.slider as HTMLElement).getBoundingClientRect().width;

                for (let i = 0; i < this.breakpoints.length; i++) {
                    if (i === this.breakpoints.length - 1 && this.breakpoints[i].max < window.innerWidth) {
                        this.currentResponsiveSettings = {};
                        break;
                    }

                    if (window.innerWidth < this.breakpoints[i].max) {
                        this.currentResponsiveSettings = this.breakpoints[i].settings;
                        break;
                    }
                }

                this.stop();
                this.start();
            },
            prev() {
                const nextSlide = this.currentSlide === 0 ? this.slidesCount - 1 : this.currentSlide - 1;

                this.$emit('change', this.currentSlide, nextSlide);

                this._reorder(1);

                this._animate(-this.slideWidthWithGapPx, 0);

                this.currentSlide = nextSlide;
            },
            next() {
                const nextSlide = this.currentSlide === this.slidesCount - 1 ? 0 : this.currentSlide + 1;

                this.$emit('change', this.currentSlide, nextSlide);

                this._animate(0, -this.slideWidthWithGapPx).addEventListener('finish', () => {
                    this._reorder(-1);

                    this.currentSlide = nextSlide;
                });
            },
            goTo(index: number) {
                if (index < 0 || index > this.slidesCount) {
                    throw new Error('Index out of range');
                }

                if (index === this.currentSlide) {
                    return;
                }

                this.$emit('change', this.currentSlide, index);

                let multiplier = index - this.currentSlide;

                const duration = Math.abs(this.innerSettings.duration / multiplier);

                if (multiplier > 0) {
                    const next = () => {
                        this._animate(0, -this.slideWidthWithGapPx, duration).addEventListener('finish', () => {
                            this._reorder(-1);

                            multiplier--;

                            this.currentSlide++;

                            if (multiplier > 0) {
                                next();
                            }
                        });
                    };

                    next();
                } else {
                    const prev = () => {
                        this._reorder(1);

                        this._animate(-this.slideWidthWithGapPx, 0, duration).addEventListener('finish', () => {
                            multiplier++;

                            this.currentSlide--;

                            if (multiplier < 0) {
                                prev();
                            }
                        });
                    };

                    prev();
                }
            },
            start() {
                if (!this.autoplayId && this.innerSettings.infinite && this.slidesPerPage !== this.slidesCount && this.autoplay) {
                    this.autoplayId = window.setInterval(() => {
                        this.next();
                    }, this.autoplay);
                }
            },
            stop() {
                this.autoplayId && clearInterval(this.autoplayId);
                this.autoplayId = 0;
            },
        },
        created() {
            Object.assign(this.innerSettings, this.settings);

            // breakpoints
            if (Object.keys(this.innerSettings.responsive).length) {
                for (const [key, value] of Object.entries(this.innerSettings.responsive)) {
                    this.breakpoints.push({
                        max: Number.parseInt(key),
                        settings: value,
                    });
                }

                this.breakpoints.sort((a: Breakpoint, b: Breakpoint) => {
                    if (a.max < b.max) {
                        return -1;
                    }

                    if (a.max > b.max) {
                        return 1;
                    }

                    return 0;
                });
            }

            window.addEventListener('resize', this._resize);
        },
        mounted() {
            this._resize();
        },
        updated() {
            Object.assign(this.innerSettings, this.settings);
        },
        unmounted() {
            this.stop();

            window.removeEventListener('resize', this._resize);
        },
    });
</script>

<style lang="less" scoped>
  .carousel {
    position: relative;
  }

  .carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
  }

  .slider-wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .slider {
    display: flex;
    height: 100%;

    &.draggable {
      cursor: ew-resize;
    }
  }

  .slide {
    flex-basis: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
  }

  // arrows
  .arrow {
    z-index: 1;
    cursor: pointer;

    &.inside {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);

      &.prev {
        left: 40px;
      }

      &.next {
        right: 40px;
      }
    }

    &.outside {
      &.prev {
        margin-right: 40px;
      }

      &.next {
        margin-left: 40px;
      }
    }
  }

  .default-arrow {
      width: 12px;
  }

  .default-next {
    transform: rotate(180deg);
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: 10px;

    &.outside {
      margin-top: 10px;
    }

    &.inside {
      position: absolute;
      bottom: 10px;
      right: 0;
      left: 0;
    }
  }

  .default-dot {
    width: 10px;
    height: 10px;
    border: 1px solid #a0a0a0;
    border-radius: 100%;
    cursor: pointer;

    &.active {
      background-color: #d50007;
      border-color: #d50007;
    }
  }
</style>
