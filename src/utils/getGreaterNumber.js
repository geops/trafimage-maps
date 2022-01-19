// Get the first number that is higher or equal than the given number.
function getGreaterNumber(number, numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  return (
    sorted.find((nb) => {
      return number <= nb;
    }) || sorted.pop()
  );
}

export default getGreaterNumber;
