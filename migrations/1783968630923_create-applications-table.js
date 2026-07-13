export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("applications", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },

    company: {
      type: "varchar(255)",
      notNull: true,
    },

    role: {
      type: "varchar(255)",
      notNull: true,
    },

    status: {
      type: "varchar(50)",
      notNull: true,
      default: "Applied",
    },

    applied_date: {
      type: "date",
      notNull: true,
    },

    follow_up_date: {
      type: "date",
    },

    notes: {
      type: "text",
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
  pgm.dropTable("applications");
};