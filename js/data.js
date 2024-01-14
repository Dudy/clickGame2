import { createDataModel } from "./dataModel.js";

const internal_data = {
    meat: 35,
    meatGain: 0,

    drone: 0,
    droneMeatGain: 1.0,
    droneBonus: 1.0,
    droneUpgrade: 0,
    droneUpgradeCost: 66,
    droneCost: {
        meat: 10,
        larvae: 1
    },
    droneBuyAction: () => {
        if (data.meat >= data.droneCost.meat && data.larvae >= data.droneCost.larvae) {
            data.meat -= data.droneCost.meat;
            data.larvae -= data.droneCost.larvae;
            data.drone += 1;
            data.meatGain = data.drone * data.droneMeatGain * data.droneBonus;
        }
    },
    droneBuyUpgradeAction: () => {
        if (data.drone >= data.droneUpgradeCost) {
            data.drone -= data.droneUpgradeCost;
            data.droneUpgrade += 1;
            data.droneBonus *= 2;
            data.meatGain = data.drone * data.droneMeatGain * data.droneBonus;
            data.droneUpgradeCost *= 666;
        }
    },





    larvae: 0,
    larvaeGain: 1.0,

    hatchery: 0,
    hatcheryCost: 300,
    hatcheryBuyAction: () => {
        // if we have more than 300 meat, we can buy a hatchery
        if (data.meat >= data.hatcheryCost) {
            // reduce meat by the cost of the hatchery
            data.meat -= data.hatcheryCost;
            // increase hatchery count by 1
            data.hatchery += 1;
            // increase the cost of the next hatchery
            data.hatcheryCost *= 10;
            // increase the larvae gain
            data.larvaeGain += 1;
        }
    }
}

const data = createDataModel(internal_data);

function tick() {
    data.larvae += data.larvaeGain;
    data.meat += data.meatGain;
}
setInterval(tick, 1000);

export { data };
