/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('transfers', (t) => {
        t.increments('id').primary();
        t.string('description').notNullable();
        t.date('date').notNullable(),
        t.decimal('amount', 15, 2).notNullable();
        t.integer('acc_ori_id')
            .references('id')
                .inTable('accounts').notNullable();
        t.integer('acc_dest_id')
            .references('id')
                .inTable('accounts').notNullable();
        t.integer('user_id')
            .references('id')
                .inTable('users').notNullable();
    }).then(() => {
        return knex.schema.table('transactions', (t) => {
            t.integer('transfer_id')
                .references('id')
                    .inTable('transfers');
        });
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.table('transactions', (t) => {
        t.dropColumn('transfer_id');
    }).then(() => {
        return knex.schema.dropTable('transfers');
    });
}
