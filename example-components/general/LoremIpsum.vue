<template>
    <p v-bind:class="classes" ref="paragraph" v-if="ref === 'paragraph'"></p>
    <span v-bind:class="classes" ref="words" v-else-if="ref === 'words'"></span>
</template>

<script>
    import Lorem from './lorem';
    var lorem;
    export default {
        name: "lorem",
        methods: {
            createAndPutLoremText : function(){
                lorem = new Lorem;
                lorem.type = Lorem.TEXT;
                lorem.query = this.add;
                lorem.createLorem(this.$refs[this.ref]);
            },
            selectCorrectRef: function () {
                this.ref = (this.add.indexOf('p') > -1) ? 'paragraph' : 'words';
            }
        },
        data : function(){
            return {
                ref : 'paragraph',
                classes: 'vue-lorem',
            };
        },
        props:  {
            add: {
                type: String,
                default: ''
            },
            extraClass: {
                type: String,
                default: ''
            }
        },
        mounted: function () {
            this.createAndPutLoremText();
        },
        beforeMount : function () {
            if(this.add) {
                this.selectCorrectRef();
            }
             if(this.extraClass) this.classes += ' ' + this.extraClass;
        }
    };
</script>