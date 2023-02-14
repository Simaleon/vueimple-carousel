import {afterAll, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import {nextTick} from 'vue';
import carousel from '@/carousel/carousel.vue';

describe('carousel', () => {
    const wrapper = mount(carousel, {
        slots: {
            default: [
                '<div class="test-slide" id="1">1</div>',
                '<div class="test-slide" id="2">2</div>',
                '<div class="test-slide" id="3">3</div>',
                '<div class="test-slide" id="4">4</div>'
            ]
        }
    });

    const slider = wrapper.vm.$refs.slider as HTMLElement;

    slider.getBoundingClientRect = () => {
        return {
            width: 1024,
            height: 0,
            top: 0,
            left: 0
        } as DOMRect
    };

    // call resize bc init resize not use mock
    wrapper.vm._resize();

    slider.animate = () => {
        return {
            addEventListener(_name: string, callback: () => void) {
                callback();
            }
        } as unknown as Animation
    };

    it('contains all slides and current slide', () => {
        const slides = wrapper.findAll('.test-slide');

        expect(slides.length).equal(4);
        expect(wrapper.vm.slidesCount).equal(4);
        expect(wrapper.vm.currentSlide).equal(0);
    });

    describe('computed', () => {
        describe('arrows', () => {
            it('default', () => {
                expect(wrapper.vm.arrows).equal(true);
            });

            it('false', async () => {
                await wrapper.setProps({ settings: { arrows: false } });

                expect(wrapper.vm.arrows).equal(false);
            });
        });

        describe('arrowsPosition', () => {
            it('default', () => {
                expect(wrapper.vm.arrowsPosition).equal('inside');
            });

            it('arrowsOutside', async () => {
                await wrapper.setProps({ settings: { arrowsOutside: true } });

                expect(wrapper.vm.arrowsPosition).equal('outside');
            });
        });

        describe('autoplay', () => {
            it('default', () => {
                expect(wrapper.vm.autoplay).equal(2000);
            });

            it('off', async () => {
                await wrapper.setProps({ settings: { autoplay: 0 } });

                expect(wrapper.vm.autoplay).equal(0);
            });

            it('not default value', async () => {
                await wrapper.setProps({ settings: { autoplay: 5000 } });

                expect(wrapper.vm.autoplay).equal(5000);
            });
        });

        describe('dots', () => {
            it('default', () => {
                expect(wrapper.vm.dots).equal(true);
            });

            it('false', async () => {
                await wrapper.setProps({ settings: { dots: false } });

                expect(wrapper.vm.dots).equal(false);
            });
        });

        describe('dotsPosition', () => {
            it('default', () => {
                expect(wrapper.vm.dotsPosition).equal('outside');
            });

            it('dots inside', async () => {
                await wrapper.setProps({ settings: { dotsOutside: false } });

                expect(wrapper.vm.dotsPosition).equal('inside');
            });
        });

        describe('draggable', () => {
            it('default', () => {
                expect(wrapper.vm.draggable).equal(true);
            });

            it('false', async () => {
                await wrapper.setProps({ settings: { draggable: false } });

                expect(wrapper.vm.draggable).equal(false);
            });

            it('slidesPerPage = slidesCount', async () => {
                await wrapper.setProps({ settings: { slidesPerPage: 4 } });

                expect(wrapper.vm.draggable).equal(false);
            });

            it('slidesPerPage > slidesCount', async () => {
                await wrapper.setProps({ settings: { slidesPerPage: 5 } });

                expect(wrapper.vm.draggable).equal(false);
            });

            afterAll(async () => {
                await wrapper.setProps({ settings: { slidesPerPage: 1 } });
            });
        });

        describe('gap', () => {
            it('default', () => {
                expect(wrapper.vm.gap).equal('10px');
            });

            it('not default value', async () => {
                await wrapper.setProps({ settings: { gap: '5%' } });

                expect(wrapper.vm.gap).equal('5%');
            });

            afterAll(async () => {
                await wrapper.setProps({ settings: { gap: '10px' } });
            });
        });

        describe('gapPx', () => {
            it('default', () => {
                expect(wrapper.vm.gapPx).equal(10);
            });

            it('not default px', async () => {
                await wrapper.setProps({ settings: { gap: '20px' } });

                expect(wrapper.vm.gapPx).equal(20);
            });

            it('not default %', async () => {
                await wrapper.setProps({ settings: { gap: '5%' } });

                expect(wrapper.vm.gapPx).equal(51.2);
            });

            afterAll(async () => {
                await wrapper.setProps({ settings: { gap: '10px' } });
            });
        });

        describe('slidesPerPage', () => {
            it('default', () => {
                expect(wrapper.vm.slidesPerPage).equal(1);
            });

            it('not default', async () => {
                await wrapper.setProps({ settings: { slidesPerPage: 4 } });

                expect(wrapper.vm.slidesPerPage).equal(4);
            });

            afterAll(async () => {
                await wrapper.setProps({ settings: { slidesPerPage: 1 } });
            });
        });

        describe('slideWidth', () => {
            it('default', () => {
                const slideWidth = `calc((100% - ${wrapper.vm.slidesPerPage - 1} * ${wrapper.vm.gap}) / ${wrapper.vm.slidesPerPage})`;

                expect(wrapper.vm.slideWidth).equal(slideWidth);
            });
        });

        describe('slideWidthPx', () => {
            it('default', async () => {
                expect(wrapper.vm.slideWidthPx).equal(1024);
            });
        });

        describe('slideWidthWithGapPx', () => {
            it('default', () => {
                expect(wrapper.vm.slideWidthWithGapPx).equal(1034);
            });
        });
    });

    describe('methods', () => {
        describe('_reorder', () => {
            it('next', async () => {
                wrapper.vm._reorder(1);

                await nextTick();

                const slides = slider.children,
                    order = [];

                for(let i = 0; i < slides.length; i++) {
                    order.push((slides[i] as HTMLElement).style.order);
                }

                expect(order).toEqual(['1', '2', '3', '0']);
            });

            it('prev', async () => {
                wrapper.vm._reorder(-1);

                await nextTick();

                const slides = slider.children,
                    order = [];

                for(let i = 0; i < slides.length; i++) {
                    order.push((slides[i] as HTMLElement).style.order);
                }

                expect(order).toEqual(['0', '1', '2', '3']);
            });
        });

        describe('prev and next', () => {
            it('default', async () => {
                wrapper.vm.prev();

                expect(wrapper.vm.currentSlide).toEqual(3);

                wrapper.vm.next();

                expect(wrapper.vm.currentSlide).toEqual(0);
            });
        });

        describe('goTo', () => {
            it('to last', async () => {
                wrapper.vm.goTo(3);

                expect(wrapper.vm.currentSlide).toEqual(3);
            });

            it('to second', async () => {
                wrapper.vm.goTo(1);

                expect(wrapper.vm.currentSlide).toEqual(1);
            });
        });

        describe('start stop', () => {
            let animationId = wrapper.vm.autoplayId;

            it('stop', async () => {
                wrapper.vm.stop();

                expect(wrapper.vm.autoplayId).toEqual(0);
            });

            it('start', async () => {
                wrapper.vm.start();

                expect(wrapper.vm.autoplayId).not.toEqual(0);

                animationId = wrapper.vm.autoplayId;
            });

            it('start again', async () => {
                wrapper.vm.start();

                expect(wrapper.vm.autoplayId).toEqual(animationId);
            });
        });
    });
});
