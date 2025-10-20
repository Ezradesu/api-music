/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: { type: "varchar(50)", primaryKey: true },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
      references: "playlists",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("collaborations", "unique_playlist_user", {
    unique: ["playlist_id", "user_id"],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
