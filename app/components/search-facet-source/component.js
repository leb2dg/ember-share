import { computed, observer } from '@ember/object';

import TypeaheadComponent from '../search-facet-typeahead/component';


export default TypeaheadComponent.extend({

    sourcesList: computed('aggregations', function() {
        const data = this.get('aggregations.sources.buckets');
        return data ? data.mapBy('key') : [];
    }),

    dataChanged: observer('aggregations', function() {
        const data = this.get('aggregations.sources.buckets');
        this.updateDonut(data);
    }),

    updateDonut(data) {
        const columns = data.map(({ key, doc_count }) => [key, doc_count]); // jscs:ignore
        const title = columns.length + (columns.length === 1 ? ' Source' : ' Sources');

        const donut = this.get('donut');
        if (!donut) {
            this.initDonut(title, columns);
        } else {
            donut.load({
                columns,
                unload: true,
            });
            this.$('.c3-chart-arcs-title').text(title);
        }
    },

    initDonut(title, columns) {
        const element = this.$('.donut').get(0);
        const donut = c3.generate({
            bindto: element,
            data: {
                columns,
                type: 'donut',
                onclick: (d) => {
                    const selected = this.get('selected');
                    if (!selected.contains(d.name)) {
                        this.send('changeFilter', [d.name, ...selected]);
                    }
                },
            },
            legend: { show: false },
            donut: {
                title,
                label: {
                    show: false,
                },
            },
            size: { height: 200 },
        });
        this.set('donut', donut);
    },
});
