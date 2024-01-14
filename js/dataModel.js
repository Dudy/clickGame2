// event emitting is used to update the DOM
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

function createDataModel(internalData) {
    const dataModel = createDataProxyObject(internalData);
    init(dataModel, internalData);
    registerActionButtonsHandler(dataModel);
    return dataModel;
}

function init(globalData, localData, prefix = '') {
    for (const property in localData) {
        if (localData.hasOwnProperty(property)) {
            if (typeof localData[property] === 'object') {
                init(globalData, localData[property], prefix + property + ".");
            } else {
                globalData[prefix + property] = localData[property];
            }
        }
    }
}

function registerActionButtonsHandler(dataModel) {
    const buttons = document.querySelectorAll('button[data-action]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            dataModel[button.dataset.action]();
        });
    });
}

function createDataProxyObject(dataModel) {
    return new Proxy(dataModel, {
        set(target, property, value) {
            target[property] = value;
            emitter.emit('change', { property, value });
            return true;
        }
    });
}

export { createDataModel, registerChangeListener };
