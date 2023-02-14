import {resolve} from 'path';
import vue from '@vitejs/plugin-vue';

export default {
    plugins: [vue()],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js',
            '@': resolve(__dirname, './src')
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/carousel/carousel.vue'),
            name: 'Carousel',
            fileName: 'carousel',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    test: {
        environment: 'jsdom',
    }
};
