<template>
	<slot v-bind="state"/>
</template>

<script setup lang="ts" generic="G extends {}">
import { computed, h } from 'vue';

import RRR from './Recursion.vue';
 
type t_node<T> = T;

type t_slotprops<T> = {
	data : T,
	depth : number,
	index : number,
	// chain : number[],

	slot : unknown,
};

const p = withDefaults(defineProps<{
	node : t_node<G>;
	depth? : number;
	index? : number;
}>(), {
	depth : 0,
	index : 0,
});

// const ROOT = [] as any[];

const state = computed<t_slotprops<G>>(() => {
	return {
		// chain : ROOT,
		data :  p.node,
		depth : p.depth,
		index : p.index,

		slot : (arg : any) => h(RRR as any, { ...arg, depth : p.depth + 1 }, s.default),
	} satisfies t_slotprops<G>;
});

const s = defineSlots<{
  default(p: t_slotprops<G>): any
}>();

</script>