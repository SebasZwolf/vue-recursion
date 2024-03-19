# Vue-Recursion

This is a renderless component that handles the recursion logic and expects the render template as its children.
This Component expects the tree data as a `prop`, then uses it to render nodes recusibly.
At each node, the tree item data and other node information are obtained through the exposed `v-slot` prop of the component. This will be better explained in the examples.

## Installation

```cmd
npm install vue-recursion
```

## Use

To use the component (once it's already installed) you just need to import it.
```vue
<script lang="ts" setup>
import Recursion from 'vue-recursion';
import { reactive } from 'vue';
//...
const nested_list_data = reactive<t_node<number>>([0,[
  [1,[
  [5],
  [6]
  ]],
  [2],
  [3,[
  [7],
  [8]
  ]],
  [4],
]]);
</script>
```

You can also import the helper types this way
```vue
<script lang="ts" setup>
import { default as Recursion, type t_node } from 'vue-recursion';
import { reactive } from 'vue';
//...

//It's not required to make the data reactive if you want to render the data statically
const nested_list_data = reactive<t_node<number>>([0,[
  [1,[
  [5],
  [6]
  ]],
  [2],
  [3,[
  [7],
  [8]
  ]],
  [4],
]]);
</script>
```

### Simple nested list example

The most basic recursion example in web are nested list. This is a way of displaying them using the Recursion Component.

```vue
<template>
  <ul class="list">
    <Recursion :data="nested_list_data" v-slot="{ component, data }">
      <li>
        <p>{{ data }}</p>
        <ul class="list">
          <component :is="component"/>
        </ul>
      </li>
    </Recursion>
  </ul>
</template>
```

```html
<!--output-->
<ul>
	<li>0
    <ul>
			<li>1
        <ul>
					<li>5
            <ul></ul>
					</li>
					<li>6
            <ul></ul>
					</li>
				</ul>
			</li>
			<li>2
        <ul>
				</ul>
			</li>
			<li>3
        <ul>
					<li>7
            <ul></ul>
					</li>
					<li>8
            <ul></ul>
					</li>
				</ul>
			</li>
			<li>4
        <ul>
				</ul>
			</li>
		</ul>
	</li>
</ul>
```

As shown, the component receives the data as a `tree structure` and the rendering template as a child (`<li>...</li>`), then exposes the *children* recursive elements in the form of the `component` v-slot prop. This is very similar in the way that [vue-router](https://router.vuejs.org/guide/advanced/router-view-slot.html) handles the styling of child pages, allowing the user to wrap the rendered page in a custom layout.

### Custom recursion wrapper

In the previous example, the `<component>` renders the child elements of each iteration of the recursion as `fragments`.
However, in order to allow more customization in the way a component is rendered, the `<Recursion>` component also exposes the `components` as an iterable array. This allows the component to have a `root-node` element that can later be used to be animated using the [Transition Group](https://vuejs.org/guide/built-ins/transition-group.html) built-in component.

```vue
<template>
  <ul class="list">
    <Recursion :data="nested_list_data" v-slot="{ components, data }">
      <li>
        <p>{{ data }}</p>
        <TransitionGroup name="list" tag="ul" class="list">
          <li v-for="c in components" :key="c.key"> 
            <component :is="c"/>
          </li>
        </TransitionGroup>
      </li>
    </Recursion>
  </ul>
</template>
```

### Use with custom component

Of course, the `Recursion` component allows the use of custom components as children.

```vue
<script lang="ts" setup>
//Comp
const p = defineProps<{
  n : number;
  t : string;
}>();  

</script>

<template>
  <li>
    <p>value : {{ p.n }} - {{ p.t }}</p>
    <ul>
      <slot><li>no children</li></slot>
    </ul>
  </li>
</template>
```

```vue
<template>
  <ul>
    <Recursion :data="
      [{ 
        n : 0,
        t : 'zero'
        key : 0,
        },[
          [{
            n : 12,
            t : 'twelve',
            key : 1,
          }, [
            [{
              n : 4,
              t : 'four',
              key : 2,
            }],
            [{
              n : 5,
              t : 'five',
              key : 3,
            }],[{
              n : 8,
              t : 'eight',
              key : 4,
            }]
          ]],
          [{
            n : 3,
            t : 'tree',
            key : 5,
          }]
      ]]" v-slot="{ component, data }">

      <Comp :n="data.n" :t="data.t" :key="data.key">
        <component :is="component"/>
      </Comp>
    </Recursion>
  </ul>
</template>
```

Now, something **very** important here is the `key` property in the data objects when using non primitive values as items for the tree.

## Guide

This component handles most logic internally but has one required prop which is the `data`. The data type is defined as
```ts
//The data tree node type is defined as a tuple
type t_node<T = unknown> = [T, t_node[]?];
```
where, the first element of the tuple is the tree node's item and the second is the array of children nodes.

The Recursion `v-slot` exposes more than only the `data` and the `component` & `components` objects.

```ts
type t_slotprops<T = any> = {
	data : T,
	depth : number,
	index : number,
	children : Readonly<raw_tree_branch<T>[]>,
	chain : number[],
		
	component? : unknown,
	components : unknown[],
};
```

| Property | Type | description |
|---|---|---|
| data | any | Represents the item of the current node. This property is defined by the used when the tree is passed as a prop to the component. |
| depth | number | The depth of the recursion of the current node. The root node with get a value of 0. |
| index | number | The index of this current node inside its parent children array. |
| children | readonly t_node<any>[] | (CAUTIOUS USE) the raw readonly array list of children of the current node. |
| component |  | The fragment component that renders the child recursion nodes. |
| components | [] | An array of components. Each one renders a child recursion node. Each node also exposes its key. |  

In order to better use the exposed properties, this Component exposes a type `t_slotprops` that can be used to strongly type the `data` property. 

```vue
<template>
  <Recursion :data v-slot="{ data, component } : t_slotprops<number>">
    {{ data }} <!-- here data is now recognized as number -->
    <component :is="component"/>
  </Recursion>
</template>
```

When using non-primitive item types is optional but **strongly** recommended to add a `key` property to each node item, which **should** be a **primitive** **unique** value `number | string | symbol`.