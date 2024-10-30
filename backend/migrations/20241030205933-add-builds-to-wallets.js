module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('wallets', 'builds', {
      type: Sequelize.JSON,
      allowNull: true, // или `false`, если колонка должна быть обязательной
      defaultValue: [], // значение по умолчанию, если `allowNull: false`
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('wallets', 'builds');
  },
};
