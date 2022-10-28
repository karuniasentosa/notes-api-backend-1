/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    note_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /* Menambahkan constraint UNIQUE, kombinasi dari kolom note_id
     dan user_id. Guna menghindari duplikasi data antara kedua nilainya.
   */
  pgm.addConstraint('collaborations',
    'unique_note_id_and_user_id', {
      unique: ['note_id', 'user_id'],
    });

  pgm.addConstraint('collaborations',
    'fk_collaborations.note_id_notes.id', {
      foreignKeys: {
        columns: ['note_id'],
        references: 'notes(id)',
        onDelete: 'cascade',
      },
    });

  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', {
    foreignKeys: {
      columns: ['user_id'],
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
