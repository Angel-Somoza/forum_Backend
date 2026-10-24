/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  //table roles
  await knex.schema.createTable('roles', (table) => {
    table.increments('role_id').primary(); //Estudiante, Catedratico, Universitario, Developver
    table.string('role_name').notNullable().unique();
  });
  //table users
  await knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.text('password_hash').notNullable();
    table.date('date_of_birth').notNullable();
    table.string('profile_picture_url');
    table
      .integer('role_id')
      .notNullable()
      .references('role_id')
      .inTable('roles')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE'); // esta columna se agregara como llave foranea a la tabla "roles"
    table.boolean('status').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('last_login');
  });
  //table para los espacios dentro del foro, donde se separaran espacios entre adultos(universidad) y niños(colegio)
  await knex.schema.createTable('forum_spaces', (table) => {
    table.increments('space_id').primary();
    table.string('space_name').notNullable().unique();
    table.boolean('status').notNullable().defaultTo(true);
  });
  //table que realiza la relacion entre los usuarios y los espacios del foro, ya que un usuario debe permancer a 1 o varios espacios del foro
  await knex.schema.createTable('user_spaces', (table) => {
    table
      .integer('user_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('space_id')
      .notNullable()
      .references('space_id')
      .inTable('forum_spaces')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.primary(['user_id', 'space_id']); //llave primaria compuesta por user_id y space_id
  });
  //tabla para los badges, medallas dentro del foro
  await knex.schema.createTable('badges', (table) => {
    table.increments('badge_id').primary();
    table.string('badge_name').notNullable().unique();
    table.string('description');
    table.text('icon_url').notNullable();
    table.boolean('status').notNullable().defaultTo(true);
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.string('criteria_type').notNullable();
    table.integer('criteria_value').notNullable();
  });
  //tabla para relacionar los badges con los usuarios, para saber que medallas tiene cada usuario
  await knex.schema.createTable('user_badges', (table) => {
    table
      .integer('user_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('badge_id')
      .notNullable()
      .references('badge_id')
      .inTable('badges')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.dateTime('earned_at').notNullable().defaultTo(knex.fn.now());
    //llave primaria compuesta por user_id y badge_id
    table.primary(['user_id', 'badge_id']);
  });
  //tabla para los post dentro del foro
  await knex.schema.createTable('posts', (table) => {
    table.increments('post_id').primary();
    table
      .integer('user_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('space_id')
      .notNullable()
      .references('space_id')
      .inTable('forum_spaces')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.text('content').nullable();
    table
      .integer('shared_post_id')
      .references('post_id')
      .inTable('posts')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    table.boolean('status').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    // hace que un post solo pueda tener un usuario y un espacio, no puede tener ambos al mismo tiempo en un mismo registro
    table
      .foreign(['user_id', 'space_id'])
      .references(['user_id', 'space_id'])
      .inTable('user_spaces');
  });
  //table para los post que contienen videos, imagenes o gifs
  await knex.schema.createTable('post_media', (table) => {
    table.increments('media_id').primary();
    table
      .integer('post_id')
      .notNullable()
      .references('post_id')
      .inTable('posts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.string('media_type').notNullable();
    table.text('media_url').notNullable();
    table.integer('sort_order').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    // Restricción para que el tipo de media solo pueda ser 'IMAGE' o 'VIDEO'
    table.check("media_type IN ('IMAGE', 'VIDEO','GIF')");
  });
  //table para los comentarios de los post
  await knex.schema.createTable('comments', (table) => {
    table.increments('comment_id').primary();
    table
      .integer('post_id')
      .notNullable()
      .references('post_id')
      .inTable('posts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('user_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('parent_comment_id')
      .references('comment_id')
      .inTable('comments')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.text('content').nullable();
    table.boolean('status').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    // hace que un comentario solo pueda tener un post y un comentario padre, no puede tener ambos al mismo tiempo en un mismo registro
    table.unique(['post_id', 'comment_id']);
    table
      .foreign(['post_id', 'parent_comment_id'])
      .references(['post_id', 'comment_id'])
      .inTable('comments');
  });
  //table para los comentarios que contienen videos, imagenes o gifs
  await knex.schema.createTable('comment_media', (table) => {
    table.increments('media_id').primary();
    table
      .integer('comment_id')
      .notNullable()
      .references('comment_id')
      .inTable('comments')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.string('media_type').notNullable();
    table.text('media_url').notNullable();
    table.integer('sort_order').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    // restrinccion para que el tipo de media solo pueda ser 'IMAGE', 'VIDEO' o 'GIF'
    table.check("media_type IN ('IMAGE', 'VIDEO','GIF')");
  });
  //table para la reacciones de los posts y los comentarios, pudiendo agregar varierdad de tipos de reacciones
  await knex.schema.createTable('reactions', (table) => {
    table.increments('reaction_id').primary();
    table
      .integer('user_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('post_id')
      .references('post_id')
      .inTable('posts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('comment_id')
      .references('comment_id')
      .inTable('comments')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.string('reaction_type').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    //hace que un usuario solo pueda reaccionar una vez a un post, no puede reaccionar varias veces al mismo post
    table.unique(['user_id', 'post_id']);
    //hace que un usuario solo pueda reaccionar una vez a un comentario
    table.unique(['user_id', 'comment_id']);
    // hace que un usuario solo pueda reaccionar a un post o a un comentario, no puede reaccionar a ambos al mismo tiempo en un mismo registro
    table.check(
      '(post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)'
    );
  });
  //tabla para las notificaciones
  await knex.schema.createTable('notifications', (table) => {
    table.increments('notification_id').primary();
    table
      .integer('actor_user_id')
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('receiver_user_id')
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('post_id')
      .references('post_id')
      .inTable('posts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('comment_id')
      .references('comment_id')
      .inTable('comments')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .integer('reaction_id')
      .references('reaction_id')
      .inTable('reactions')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    table
      .integer('badge_id')
      .nullable()
      .references('badge_id')
      .inTable('badges')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');

    table.string('notification_type').notNullable();
    table.boolean('is_read').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('notifications');
  await knex.schema.dropTable('reactions');
  await knex.schema.dropTable('comment_media');
  await knex.schema.dropTable('comments');
  await knex.schema.dropTable('post_media');
  await knex.schema.dropTable('posts');
  await knex.schema.dropTable('user_badges');
  await knex.schema.dropTable('badges');
  await knex.schema.dropTable('user_spaces');
  await knex.schema.dropTable('forum_spaces');
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('roles');
}
