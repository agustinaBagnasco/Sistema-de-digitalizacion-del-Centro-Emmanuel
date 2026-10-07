export function sortActiveLast(items) {
  return [...items].sort(
    (a, b) => Number(a.activo === false) - Number(b.activo === false)
  );
}
