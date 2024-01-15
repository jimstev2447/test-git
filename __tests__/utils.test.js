const formatSnacks = require("../db/utils");

describe("formatSnacks()", () => {
  test("is a function", () => {
    expect(typeof formatSnacks).toBe("function");
  });
  test("returns an array", () => {
    const formattedSnacks = formatSnacks(
      [{ category_name: "biscuit", category_id: 1 }],
      [{ snack_name: "hobnob", category: "biscuit" }]
    );
    expect(Array.isArray(formattedSnacks)).toBe(true);
  });
  test("should return a new array given a single snack with a nested array with the snack_name , description and price_in_pence as the first items in that nested array", () => {
    const snacks = [
      {
        snack_name: "hobnob",
        category: "biscuit",
        description: "delicious biscuit",
        price_in_pence: 50,
      },
    ];
    const categories = [{ category_name: "biscuit", category_id: 1 }];

    const formattedSnacks = formatSnacks(categories, snacks);
    // [["hobnob", "delicios biscuit", 50]]
    expect(formattedSnacks[0][0]).toBe(snacks[0].snack_name);
    expect(formattedSnacks[0][1]).toBe(snacks[0].description);
    expect(formattedSnacks[0][2]).toBe(snacks[0].price_in_pence);
  });
  test("should do as above for multiple snacks", () => {
    const snacks = [
      {
        snack_name: "hobnob",
        category: "biscuit",
        description: "delicious biscuit",
        price_in_pence: 50,
      },
      {
        snack_name: "custard cream",
        category: "biscuit",
        description: "fancy biscuit",
        price_in_pence: 60,
      },
    ];
    const categories = [{ category_name: "biscuit", category_id: 1 }];

    const formattedSnacks = formatSnacks(categories, snacks);
    // [["hobnob", "delicios biscuit", 50]]
    expect(formattedSnacks.length).toBe(2);
    formattedSnacks.forEach((snack, i) => {
      expect(snack[0]).toBe(snacks[i].snack_name);
      expect(snack[1]).toBe(snacks[i].description);
      expect(snack[2]).toBe(snacks[i].price_in_pence);
    });
  });
  test("given a single snack should add the category id to the nested returned array", () => {
    const snacks = [
      {
        snack_name: "hobnob",
        category: "biscuit",
        description: "delicious biscuit",
        price_in_pence: 50,
      },
    ];
    const categories = [{ category_name: "biscuit", category_id: 1 }];

    const formattedSnacks = formatSnacks(categories, snacks);

    expect(formattedSnacks[0][3]).toBe(1);
  });
  test("should add the appropriate category_id given multiple categories", () => {
    const snacks = [
      {
        snack_name: "hobnob",
        category: "biscuit",
        description: "delicious biscuit",
        price_in_pence: 50,
      },
    ];
    const categories = [
      { category_name: "fruit", category_id: 2 },
      { category_name: "biscuit", category_id: 1 },
    ];

    const formattedSnacks = formatSnacks(categories, snacks);
    expect(formattedSnacks[0][3]).toBe(1);
  });
  test("should not mutate the input arrays", () => {
    const snacks = [
      {
        snack_name: "hobnob",
        category: "biscuit",
        description: "delicious biscuit",
        price_in_pence: 50,
      },
      {
        snack_name: "custard cream",
        category: "biscuit",
        description: "fancy biscuit",
        price_in_pence: 60,
      },
    ];
    const categories = [{ category_name: "biscuit", category_id: 1 }];

    formatSnacks(categories, snacks);

    expect(categories).toEqual([{ category_name: "biscuit", category_id: 1 }]);
    expect(snacks).toEqual([
      {
        snack_name: "hobnob",
        category: "biscuit",
        description: "delicious biscuit",
        price_in_pence: 50,
      },
      {
        snack_name: "custard cream",
        category: "biscuit",
        description: "fancy biscuit",
        price_in_pence: 60,
      },
    ]);
  });
});
