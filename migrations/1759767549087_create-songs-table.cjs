exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      default: null,
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: '"albums"',
      onDelete: 'SET NULL',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
