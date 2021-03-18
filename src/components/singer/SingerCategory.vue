<template>
    <div class="singer-category">
        <div>
            <ul class="SingerUl">
                <li v-for="item of areaList "
                    :key="item.key"
                    @click="checkArea(item.key)"
                    :class="{'active': item.key == area}"
                >
                    {{item.title}}
                </li>
            </ul>
        </div>
        <div>
            <ul class="SingerUl">
                <li v-for="item of typeList "
                    :key="item.key"
                    :class="{'active': item.key == type}"
                    @click="checkType(item.key)"
                >
                    {{item.title}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        areaList:{
            type: Array,
			required: true
        },
        typeList:{
            type: Array,
			required: true
        },
        area:{
            type:Number,
            required:true
        },
        type:{
            type:Number,
            required:true
        }
    },
    data() {
		return {
			activeIndex: {
				sex:0,
				genre: 0,
                area:0
			}
		}
	},
    methods: {
        checkType(key){
            this.$emit('changeType',key)
        },
        checkArea(key){
            this.$emit('changeArea',key)
        }
    }
}
</script>
<style scoped lang="stylus">
@import '../../common/stylus/variable.styl'
.singer-category
  padding:0 10px;
  color $color-text-d
  ul
    display flex
    flex-wrap wrap
    li
      padding 5px
      margin 5px;
      font-size $font-size-medium
      text-align center
    .active
      border-radius 10px
      background-color $color-text-l
      color $color-text-ll
</style>