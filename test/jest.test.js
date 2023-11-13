test("Devo conhecer as principais assertivas do jest", () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
});

test("Devo saber trabalhar com objetos", () => {
  const obj = { name: "john", mail: "test@example.com" };
  expect(obj).toHaveProperty("name");
  expect(obj.mail).toEqual("test@example.com");
});
