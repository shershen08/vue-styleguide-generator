<template>
    <div v-bind:class="classes">
        <div class="vue-csp-indicator" :style="fullStyle"></div>
    </div>
</template>

<script>
    var scrollContainer;
    const minSize = 1;
    export default {
        name: "content-scroll-progress",
        props:  {
            spy: {
                type: String,
                default: null
            },
            color: {
                type: String,
                default: ''
            },
            extraClass: {
                type: String,
                default: ''
            }
        },
        methods: {
            getChildrenHeight : function ( childrenList ) {
                //first run
                if(childrenList.length && this.childrenArrayLength === 0){
                    this.childrenHeight = this.iterateChildren(childrenList);
                    this.childrenArrayLength = childrenList.length;
                }
                //assume that child elements size wasn't changed
                if(childrenList.length === this.childrenArrayLength){
                    return this.childrenHeight;
                }
            },
            iterateChildren: function ( childrenList ) {
                let summ = 0;
                for ( var i = 0; i < childrenList.length; i++ ) {
                    var childElHeight = childrenList[ i ].getBoundingClientRect().height;
                    if ( childElHeight >= 0 ) summ += childElHeight;
                }
                return summ;
            },
            calculateScrollRatio : function(){
                let viewed = scrollContainer.scrollTop + scrollContainer.getBoundingClientRect().height;
                let total = this.childrenHeight || this.getChildrenHeight( scrollContainer.children );
                let ratio = ( viewed / total ) * 100 ;
                return (parseInt(ratio) >= 100 ? 100 : parseInt(ratio));
            },
            handleScroll: function () {
                const result = this.calculateScrollRatio();
                this.fullStyle = `width:${(result || minSize)}%;
                                  background-color:${this.colorStyle};`;
            },
            handleInitialProps : function(){
                //following props colud have some validation
                if(this.color) this.colorStyle = this.color; 
                if(this.extraClass) this.classes += ' ' + this.extraClass;
            }
        },
        data() {
            return {
                fullStyle: 0,
                colorStyle:'',
                classes: 'vue-csp-wrapper',
                childrenArrayLength:0,
                childrenHeight:0
            };
        },
        mounted: function () {
            if ( !this.spy ) throw new Error('No scroll container provided');

            scrollContainer = document.querySelectorAll( this.spy )[ 0 ];
            scrollContainer.addEventListener('scroll', this.handleScroll, false);
            this.handleInitialProps();
        },
         beforeDestroy () {
           scrollContainer.removeEventListener('scroll', this.handleScroll);
        }
    };
</script>

<style lang="sass">
    .vue-csp-wrapper {
        position: fixed;
        top: 100px;
        height: 4px;
        background:transparent;
        width: 100%;
        z-index: 10000;
    }
    .vue-csp-indicator {
        width: 0%;
        background: #fc0;
        height: 4px;
        -webkit-transition: width .3;
        -moz-transition: width .3;
        transition: width .3;
    }
</style>