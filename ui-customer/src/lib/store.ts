// store.js

import { writable } from 'svelte/store';
import type { Item } from './appTypes';
// Create the writable store
export const myArrayStore = writable<Item[]>([]);

// Define the add method
export function addItem(item: Item) {

  myArrayStore.update((arr) => [...arr, item]);

  console.log(myArrayStore);
}
export function deleteArr() {
  myArrayStore.update((arr) => []);
}
