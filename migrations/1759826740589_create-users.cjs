exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: { type: "varchar(50)", primaryKey: true },
    username: { type: "varchar(100)", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    fullname: { type: "varchar(255)", notNull: true },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
