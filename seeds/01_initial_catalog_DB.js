/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Una sola transacción para toda la carga inicial.
  await knex.transaction(async (trx) => {
    // Crear los roles.
    await trx('roles')
      .insert([
        { role_name: 'Estudiante' },
        { role_name: 'Catedratico' },
        { role_name: 'Universitario' },
        { role_name: 'Developer' },
      ])
      .onConflict('role_name')
      .ignore(); // Evita insertar duplicados si ya existen roles con el mismo nombre.

    const developerRole = await trx('roles')
      .where('role_name', 'Developer')
      .first('role_id');

    if (!developerRole) {
      throw new Error('No se pudo encontrar el rol "Developer"');
    }

    // Crear los usuarios Developer.
    await trx('users')
      .insert([
        {
          first_name: 'Axel',
          last_name: 'Avila',
          email: 'axel.avila@example.com',
          password_hash: '1',
          date_of_birth: '1997-07-10',
          profile_picture_url: '',
          role_id: developerRole.role_id, // Asignar el ID del rol correspondiente.
        },
        {
          first_name: 'Angel',
          last_name: 'Somoza',
          email: 'angel.somoza@example.com',
          password_hash: '1',
          date_of_birth: '2004-05-15',
          profile_picture_url: '',
          role_id: developerRole.role_id, // Asignar el ID del rol correspondiente.
        },
      ])
      .onConflict('email')
      .ignore(); // Evita insertar duplicados si ya existen usuarios con el mismo email.

    // Crear los espacios del foro.
    await trx('forum_spaces')
      .insert([
        {
          space_name: 'Universidad',
        },
        {
          space_name: 'Colegio',
        },
      ])
      .onConflict('space_name')
      .ignore(); // Evita insertar espacios con nombres duplicados.

    // Obtener los IDs reales de los usuarios y espacios.
    const axel = await trx('users')
      .where('email', 'axel.avila@example.com')
      .first('user_id');

    const angel = await trx('users')
      .where('email', 'angel.somoza@example.com')
      .first('user_id');

    const universidad = await trx('forum_spaces')
      .where('space_name', 'Universidad')
      .first('space_id');

    const colegio = await trx('forum_spaces')
      .where('space_name', 'Colegio')
      .first('space_id');

    // Relacionar los usuarios con sus espacios.
    await trx('user_spaces')
      .insert([
        {
          user_id: axel.user_id, // ID del usuario Axel.
          space_id: universidad.space_id, // ID del espacio Universidad.
        },
        {
          user_id: angel.user_id, // ID del usuario Angel.
          space_id: colegio.space_id, // ID del espacio Colegio.
        },
      ])
      .onConflict(['user_id', 'space_id'])
      .ignore(); // Evita insertar duplicados si ya existen relaciones entre usuarios y espacios.
  });
}