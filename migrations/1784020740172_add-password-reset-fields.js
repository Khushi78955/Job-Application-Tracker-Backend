export const shorthands = undefined;

export const up = (pgm) => {
  pgm.addColumns("users", {
    password_reset_token: {
      type: "varchar(255)",
    },

    password_reset_expires_at: {
      type: "timestamp",
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumns("users", [
    "password_reset_token",
    "password_reset_expires_at",
  ]);
};