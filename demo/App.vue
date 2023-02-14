<template>
    <carousel
        class="my-carousel"
        :settings="settings"
    >
        <img
            src="./slides/slide_1.jpg"
            class="image"
            alt="slide_1"
            draggable="false"
        >
        <img
            src="./slides/slide_2.jpg"
            class="image"
            alt="slide_2"
            draggable="false"
        >
        <img
            src="./slides/slide_3.jpg"
            class="image"
            alt="slide_3"
            draggable="false"
        >
        <img
            src="./slides/slide_4.jpg"
            class="image"
            alt="slide_4"
            draggable="false"
        >
    </carousel>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import carousel from '@/carousel/carousel.vue';

    export default defineComponent({
        name: 'App',
        components: {
            'carousel': carousel,
        },
        data() {
            return {
                settings: {
                    autoplay: 0,
                    arrowsOutside: true,
                    dotsOutside: false,
                    slidesPerPage: 3,
                    gap: '20px',
                    responsive: {
                        800: {
                            autoplay: 0,
                            slidesPerPage: 1,
                            gap: '10px',
                        },
                    },
                },
            };
        },
    });
</script>

<style lang="less" scoped>
  .my-carousel {
    width: 1000px;
    height: 250px;

    @media(max-width: 800px) {
      width: 500px;
    }
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .slide {
    background-color: #a0a0a0;
  }
</style>
