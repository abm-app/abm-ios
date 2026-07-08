export const getRoomTypes = async (): Promise<string[]> => {
  // Simulating an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(['Standard', 'Deluxe', 'Suite']);
    }, 500);
  });
};
