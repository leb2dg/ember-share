import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
    atFirstPage: computed.equal('page', 1),

    atLastPage: computed('page', 'clampedPages', function() {
        return this.get('page') === this.get('clampedPages');
    }),

    pageLinks: computed('page', 'clampedPages', function() {
        const radius = 2;
        const page = this.get('page');
        const max = this.get('clampedPages');
        const pages = [1];
        if (page > radius + 2) {
            pages.push(null);
        }
        for (let i = Math.max(page - radius, 2); i <= Math.min(page + radius, max); i++) {
            pages.push(i);
        }
        if (page + radius + 1 < max) {
            pages.push(null);
        }
        if (page + radius < max) {
            pages.push(max);
        }
        return pages;
    }),

    actions: {
        loadPage(page) {
            this.get('loadPage')(page);
        },

        prevPage() {
            this.get('loadPage')(this.get('page') - 1);
        },

        nextPage() {
            this.get('loadPage')(this.get('page') + 1);
        },
    },
});
