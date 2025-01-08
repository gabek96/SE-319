function averagePerProduct(productName, products) {
  let total = 0;
  let count = 0;

  // Loop through the products to find matching product names
  for (const product of products) {
    const [, name] = product;  // Extract the product name from the array at index 1
    const price = product[6];  // Extract the price from index 6

    if (name === productName) {  // Check if product name matches
      total += price;  // Add the price to the total
      count++;
    }
  }

  // Return the average price or 0 if no matching products
  return count > 0 ? total / count : 0;
}
