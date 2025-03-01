<script setup lang="ts">
import Recursion from '../src/Recursion.vue';
const nested_list_data = ({
	title : "title 1",
	href : "title-1",
	sections : [{
		title : "title 1.1",
		href : "title-1-1",
	},
	{
		title : "title 1.2",
		href : "title-1-2",
		sections : [{
			title : "title 1.2.1",
			href : "title-1-2-1",
		},{
			title : "title 1.2.2",
			href : "title-1-2-2",
		}]
	},
	{
		title : "title 1.3",
		href : "title-1-3",
	}]
});

</script>

<template>
	<ul class="list">
		<Recursion :node="nested_list_data" v-slot="{ data, slot, depth, index }">
			<li>
				<a :href="data.href">{{ data.title }}</a>

				<ul class="list" v-if="data.sections?.length">
					<component v-for="child, i of data.sections" :is="slot" :node="child" :index="i" :key="child.href"/>
				</ul>
			</li>
		</Recursion>
	</ul>
</template>