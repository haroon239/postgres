'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos', 'priority', {
      type: Sequelize.ENUM('Low', 'Medium', 'High'),
      allowNull: false,
      defaultValue: 'Medium',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Todos', 'priority');;
  },
};
