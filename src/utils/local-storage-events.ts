export const throwLocalStorageEvent = (eventKey: string, data?: unknown): void => {
    window.localStorage.setItem(`events.${eventKey}`, JSON.stringify({ time: `${new Date().getTime()}`, data }));
};

export const onLocalStorageEvent = (
    eventKey: string,
    callback: (data: unknown) => void,
    options?: { once?: boolean },
): (
) => void => {
    const listener = (event) => {
        if (event.storageArea === localStorage && event.key === `events.${eventKey}`) {
            callback((JSON.parse(event.newValue) || {}).data);
        }
    };

    window.addEventListener('storage', listener, options);

    const stopListen = () => {
        window.removeEventListener('storage', listener);
    };

    return stopListen;
};
