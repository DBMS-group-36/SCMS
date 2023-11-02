export function searchObjects(data, searchString) {
  searchString = searchString.toLowerCase();

  const matchingObjects = data?.filter(obj => {
    // Iterate through the keys of the object
    for (const key in obj) {
      if (obj[key]?.toString().toLowerCase().includes(searchString)) {
        return true; // If a match is found in any key, include the object
      }
    }
    return false; // If no match is found in any key, exclude the object
  });

  return matchingObjects;
}