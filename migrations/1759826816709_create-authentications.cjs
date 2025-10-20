exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("authentications", {
    token: { type: "text", primaryKey: true },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("authentications");
};
