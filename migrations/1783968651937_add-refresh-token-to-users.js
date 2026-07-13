export const up = (pgm) => {
  pgm.addColumn("users", {
    refresh_token: {
      type: "text",
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn("users", "refresh_token");
};