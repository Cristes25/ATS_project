const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Posibles estados de una vacante
const JOB_STATUSES = ['draft', 'published', 'paused', 'closed'];

const Job = sequelize.define('Job', {
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  salary_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  salary_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(...JOB_STATUSES),
    allowNull: false,
    defaultValue: 'draft',
  },
  closes_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Job;
