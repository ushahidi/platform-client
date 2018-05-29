const localStorageMock = () => {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
};

localStorageMock();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock
});

Object.defineProperty(window, "ushahidi", {
    writable: true,
    value: { backendUrl: "http://backend" }
});
