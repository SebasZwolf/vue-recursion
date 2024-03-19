<script setup lang="ts">
type t_key = number | string | symbol;

type smart_item = Record<string, unknown> & { key? : t_key };
type raw_tree_branch<T extends unknown | smart_item = unknown> = [T, raw_tree_branch<T>[]?];
	
import { ComputedRef, computed, h, unref, } from 'vue';
import Recursion from './Recursion.vue';

type t_node<T> = raw_tree_branch<T>;
type t_slotprops<T = any> = {
	data : T,
	depth : number,
	index : number,
	children : Readonly<raw_tree_branch<T>[]>,
	chain : number[],
		
	component? : unknown,
	components : unknown[],
};

const s = defineSlots<{
	default(p : t_slotprops) : any
}>();

const p = withDefaults(defineProps<{
	data : raw_tree_branch,

	depth? : number,
	index? : number,
	chain? : number[] | ComputedRef<number[]>,
}>(), {
	index : 0,
	depth : 0,
	chain : () => [],
});

defineExpose({
	key : p.data[0] && typeof p.data[0] === 'object' && 'key' in p.data[0] ? p.data[0].key as t_key : p.index,
});


const kids = computed(() => p.data[1] ?? []); 
const chains = computed(() => {
	const c = unref(p.chain);
	return kids.value.map((_, i) => [...c, i]);
});

const component = () => kids.value.map((e, i) => {
	const key = e[0] && typeof e[0] === 'object' && 'key' in e[0] ? e[0].key as t_key : i;

	return h(Recursion, { 
		key : key,
		depth : p.depth + 1,
		data : e,
		index : i,
		chain : chains.value[i],
	}, {
		default : s.default
	})
});

const components = computed(() => kids.value.map((e, i) => {
	const key = e[0] && typeof e[0] === 'object' && 'key' in e[0] ? e[0].key as t_key : i;

	return h(Recursion, { 
		key : key,
		data : e,
		index : i,
		depth : p.depth + 1,
		chain : chains.value[i],
	}, s)
}));

export type {
	t_key,
	t_node,
	t_slotprops,
}

</script>

<template>
	<slot v-bind="{ data : p.data[0], children : unref(kids), depth, index : index, chain : unref(chain), component, components }"></slot>
</template>
