const random = (min = 0, max = 1) => Math.random() * (max - min) + min;
const randomLatitude = () => Number(random(-90, 90).toFixed(2)); //eslint-disable-line no-magic-numbers
const randomLongitude = () => Number(random(-180, 180).toFixed(2)); //eslint-disable-line no-magic-numbers
class GeolocationMock {
    getCurrentPosition(success) {
        const coords = {
            latitude: randomLatitude(),
            longitude: randomLongitude()
        };
        if (typeof success === 'function') {
            success({coords});
        } else {
            throw new Error('getCurrentPosition expects a "success" function');
        }
        return coords;
    }
    watchPosition(success) {
        const coords = {
            latitude: randomLatitude(),
            longitude: randomLongitude()
        };
        const handler = Math.floor(random(1000, 9999));
        if (typeof success === 'function') {
            success({coords, handler});
        } else {
            throw new Error('watchPosition expects a "success" function');
        }
        return handler;
    }
}
expect.extend({
    toBeLatitudeValue(received) {
        const options = {
            isNot: this.isNot
        };
        const pass = typeof received === 'number' && Math.abs(received) <= 90;
        const message = () => {
            return `${this.utils.matcherHint('toBeLatitudeValue', undefined, undefined, options)}\n\n` +
                `\tExpected: ${this.utils.printExpected('Number between -90 and 90')}\n` +
                `\tReceived: ${this.utils.printReceived(received)}`;
        };
        return {pass, message};
    },
    toBeLongitudeValue(received) {
        const options = {
            isNot: this.isNot
        };
        const pass = typeof received === 'number' && Math.abs(received) <= 180;
        const message = () => {
            return `${this.utils.matcherHint('toBeLongitudeValue', undefined, undefined, options)}\n\n` +
                `\tExpected: ${this.utils.printExpected('Number between -180 and 180')}\n` +
                `\tReceived: ${this.utils.printReceived(received)}`;
        };
        return {pass, message};
    }
});
global.navigator.geolocation = new GeolocationMock();