function formatSnacks(categories, snacks) {
  const formattedSnacks = snacks.map((snack) => {
    const correctCategory = categories.find((category) => {
      return category.category_name === snack.category;
    });

    return [
      snack.snack_name,
      snack.description,
      snack.price_in_pence,
      correctCategory.category_id,
    ];
  });
  return formattedSnacks;
}

module.exports = formatSnacks;
