const sequelize = require('../config/database');
const Department = require('./Department');
const Job = require('./Job');

// Un departamento tiene muchas vacantes
Department.hasMany(Job, { foreignKey: 'department_id' });
Job.belongsTo(Department, { foreignKey: 'department_id' });

module.exports = {
  sequelize,
  Department,
  Job,
};
