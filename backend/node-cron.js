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

cron.schedule('* * * * *', async () => {
    const automaticUpdate = await UserPlanets.findAll();
    let arr = [];

    automaticUpdate.map(async (item) => {
        const wallet = await Wallet.findOne({where: {userId: item.dataValues.userId}});
        const planet = await Planet.findOne({ where: { id: item.dataValues.planetId }, include: [Element] });
        
        const element = planet?.dataValues?.elements[0]?.dataValues;

        const balance = wallet?.dataValues?.value;
        let currEl = balance?.find(val => val?.element === element?.id);
        
        let coeff = item?.level === 1 ? 0.05 : 0.5;
        if(!currEl?.element) {
            currEl = {
                element: element.id,
                value: coeff,
                name: element.name,
                img: element.img,
                symbol: element.symbol,
                rare: element.rare,
            }
        } else {
            currEl.value = currEl?.value + coeff;
        }
        const balToUpd = balance?.filter(val => val?.element !== currEl?.element)
        const toUpd = [
            ...balToUpd,
            {...currEl}
        ]

        arr.push(toUpd)
        
        //await Wallet.update({value: toUpd}, {where: {userId: item.dataValues.userId}})
    })
    console.log(arr)
})

module.exports = cron;