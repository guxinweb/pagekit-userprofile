module.exports = Vue.extend({

    data: function () {
        return _.merge({}, window.$data);
    },

    ready: function () {
        this.Fields = this.$resource('api/userprofile/field/:id');
        this.tab = UIkit.tab(this.$$.tab, {connect: this.$$.content});
    },

    computed: {

        hasOptions: function () {

            var type = this.$get('type.id'), field = this.$options.components[type];

            if (field && (type && type.match(field.options.field.type))) {
                return field.options.field.hasOptions;
            }

            return false;
        }


    },

    methods: {

        save: function (e) {

            e.preventDefault();

            var data = {field: this.field};

            this.$broadcast('save', data);

            this.Fields.save({id: this.field.id}, data, function (data) {

                if (!this.field.id) {
                    window.history.replaceState({}, '', this.$url('admin/userprofile/edit', {id: data.field.id}))
                }

                this.$set('field', data.field);

                UIkit.notify(this.$trans('%type% saved.', {type: this.type.label}));

            }, function (data) {
                UIkit.notify(data, 'danger');
            });
        }

    },

    components: {

        text: require('../fields/text.vue'),
        select: require('../fields/select.vue'),
        fieldbasic: require('../components/field-basic.vue'),
        fieldoptions: require('../components/field-options.vue'),
        appearance: require('../components/appearance.vue')

    }


});

$(function () {

    (new module.exports()).$mount('#field-edit');

});
