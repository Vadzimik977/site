const cron = require('node-cron');
const { Planet, UserPlanets, Wallet, Element } = require("./models/models");
const Sequelize = require('sequelize');

cron.schedule('59 23 * * *', async () => {
    const ids = await Planet.findAll(
        {
            order: Sequelize.literal('rand()'),
            limit: 7,
            where: {forLaboratory: 0}, 
        }
    );
    //then update our planets
    await Planet.update(
        {forLaboratory: 0}, 
        {
            where: {
                forLaboratory: 1
            }
        }
    );

    ids.forEach( async (item) => await item.update({ forLaboratory: 1 }));
})

cron.schedule('0 * * * * *', async () => {
    const automaticUpdate = await UserPlanets.findAll();

    const updates = await Promise.all(
        automaticUpdate.map(async (item) => {
        const wallet = await Wallet.findOne({where: {userId: item.dataValues.userId}});
        const planet = await Planet.findOne({ where: { id: item.dataValues.planetId }, include: [Element] });
        
        const element = planet?.dataValues?.elements[0]?.dataValues;
        const balance = wallet?.dataValues?.value;

        const currElIndex = balance?.findIndex(val => val?.element === element?.id)
        
        let coeff = item?.dataValues.level == 1 ? 0.05 : 0.1;
        
        if(currElIndex === -1) {
            return {
                element: element.id,
                value: coeff,
                name: element.name,
                img: element.img,
                symbol: element.symbol,
                rare: element.rare,
                userId: item.dataValues.userId
            }
        } else {
            parseFloat((balance[currElIndex].value += coeff).toFixed(5));
            balance[currElIndex].userId = item.dataValues.userId
            return balance[currElIndex]
        }
    }))
    
    const groupedUpdates = updates.reduce((acc, update) => {
        const userId = update.userId;
        delete update.userId;
        if (!acc[userId]) {
            acc[userId] = [];
        }
        acc[userId].push(update);
        return acc;
    }, {});

    
    await Promise.all(Object.keys(groupedUpdates).map(async (userId) => {
        const wallet = await Wallet.findOne({ where: { userId } });
        const currentBalance = wallet?.dataValues?.value || [];
        
        const updatedBalance = groupedUpdates[userId].reduce((acc, update) => {
            const existingIndex = acc.findIndex(el => el.element === update.element);
            if (existingIndex === -1) {
                acc.push(update);
            } else {
                acc[existingIndex].value = update.value;
            }
            return acc;
        }, [...currentBalance]);
        
        await Wallet.update({ value: updatedBalance }, { where: { userId } });
    }));
})

module.exports = cron;