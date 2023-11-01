// store.js

import { writable } from 'svelte/store';
import type { Item } from './appTypes';
// Create the writable store
export const myArrayStore = writable<Item[]>([]);
export const creds = writable<string[]>([]);
// Define the add method
export function addCreds(userName: string, token: string) {

  creds.update((arr) => [userName, token]);

  console.log(creds);
}
export function addItem(item: Item) {

  myArrayStore.update((arr) => [...arr, item]);

  console.log(myArrayStore);
}
export function deleteArr() {
  myArrayStore.update((arr) => []);
}
