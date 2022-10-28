/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Membuat user baru
  pgm.sql('INSERT INTO '
    + 'users(id, username, password, "fullname") '
    + 'VALUES (\'old_notes\', \'old_notes\', \'old_notes\', \'old notes\')');

  // Mengubah nilai owner pada note yang owner-nya bernilai NULL
  pgm.sql('UPDATE notes SET owner = \'old_notes\' WHERE owner is NULL');

  // Memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('notes',
    'fk_notes.owner_users_id',
    {
      foreignKeys: {
        columns: ['owner'],
        references: 'users(id)',
        onDelete: 'cascade',
      },
    });
};

exports.down = (pgm) => {
// menghapus constraint fk_notes.owner_users.id pada tabel notes
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  // mengubah nilai owner old_notes pada note menjadi NULL
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

  // menghapus user baru.
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
