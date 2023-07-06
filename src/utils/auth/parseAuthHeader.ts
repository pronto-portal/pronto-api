export const parseAuthHeader = (header?: string) => {
  if (!header) return "";

  const parts = header.split(" ");

  if (parts.length === 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }

  return "";
};
