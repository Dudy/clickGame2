// the real underlying data structure
const internal_data = {
    meat: 35,
    meatGain: 0,

    drone: 0,
    droneMeatGain: 1.0,
    droneBonus: 1.0,
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

function tick() {
    data.larvae += data.larvaeGain;
    data.meat += data.meatGain;
}
setInterval(tick, 1000);

// event emitter class that can be used to register listeners and emit events
class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(data));
        }
    }
}

const emitter = new EventEmitter();
const data = new Proxy(internal_data, {
    set(target, property, value) {
        // Setze den Wert
        target[property] = value;

        // Feuere das Event
        emitter.emit('change', { property, value });

        // Rückgabe von true zeigt an, dass die Zuweisung erfolgreich war
        return true;
    }
});

function registerChangeListener(callback) {
    emitter.on('change', callback);
}

// default handler for DOM elements with data-property="property" attribute
registerChangeListener((change) => {
    const elementsWithDataProperty = document.querySelectorAll('[data-property]');
    elementsWithDataProperty.forEach(element => {
        if (element.dataset.property === change.property) {
            element.innerHTML = change.value;
        }
    });
})

// default init
function init(local_data, prefix = '') {
    for (const property in local_data) {
        if (local_data.hasOwnProperty(property)) {
            if (typeof local_data[property] === 'object') {
                init(local_data[property], prefix + property + ".");
            } else {
                data[prefix + property] = local_data[property];
            }
        }
    }
}
init(internal_data);

function registerActionButtonsHandler() {
    const buttons = document.querySelectorAll('button[data-action]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            data[button.dataset.action]();
        });
    });
}
registerActionButtonsHandler();

// export registerChangeListener function
export { data, emitter, registerChangeListener };
