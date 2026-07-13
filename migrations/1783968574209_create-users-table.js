export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    name: {
      type: "varchar(100)",
      notNull: true,
    },

    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },

    password_hash: {
      type: "text",
    },

    google_id: {
      type: "text",
      unique: true,
    },

    is_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    two_factor_enabled: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("users");
};