'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('planets', [
      {
        name: 'Hydra',
        speed: 0.05,
        updatePrice: 3,
        img: 'planet1.png',
        active: 1,
        rare: 'Обычная',
        forLaboratory: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hydra',
        speed: 0.05,
        updatePrice: 3,
        img: 'planet2.png',
        active: 1,
        rare: 'Обычная',
        forLaboratory: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hydra',
        speed: 0.05,
        updatePrice: 3,
        img: 'planet3.png',
        active: 1,
        rare: 'Обычная',
        forLaboratory: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
