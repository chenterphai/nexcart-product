function generateProductSku() {
  const min = 1000;
  const max = 999999;
  const generatedNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return `NX-${generatedNumber}`;
}

export default generateProductSku