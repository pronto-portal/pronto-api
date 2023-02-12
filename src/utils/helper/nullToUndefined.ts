export const nullToUndefined = (
  args: Record<string, any | null | undefined>
) => {
  const nonNullEntries = Object.entries(args).map(([key, val]) =>
    val === null ? [key, undefined] : [key, val]
  );

  const nonNullObject = Object.fromEntries(nonNullEntries);

  return nonNullObject;
};
