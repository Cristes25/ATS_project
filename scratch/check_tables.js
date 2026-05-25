const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('talent_db', 'postgres', 'adminpassword', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

async function main() {
    try {
        const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log("TABLES:", results.map(r => r.table_name));
    } catch (err) {
        console.error("ERROR:", err.message);
    } finally {
        await sequelize.close();
    }
}
main();
