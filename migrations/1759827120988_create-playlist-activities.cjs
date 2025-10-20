/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_activities", {
    id: { type: "varchar(50)", primaryKey: true },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
      references: "playlists",
      onDelete: "CASCADE",
    },
    song_id: {
      type: "varchar(50)",
      notNull: true,
      references: "songs",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: "users",
      onDelete: "SET NULL",
    },
    action: { type: "varchar(10)", notNull: true }, // 'add' or 'delete'
    time: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_activities");
};
