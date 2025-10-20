/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
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
  });
  pgm.addConstraint("playlist_songs", "unique_playlist_song_pair", {
    unique: ["playlist_id", "song_id"],
  });
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
