
import {once, unary} from 'ramda';

const log = unary(console.log); // eslint-disable-line no-console

export const getPosition = async () => {
    const getCurrentPosition = new Promise((resolve, reject) => {
        const success = ({coords}) => {
            const {latitude, longitude} = coords;
            resolve({latitude, longitude});
        };
        const error = ({message}) => {
            console.log(message); // eslint-disable-line no-console
            reject(message);
        };
        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    });
    const position = await getCurrentPosition.catch(log);
    return position;
};
export const watchPosition = async (callback = () => {}) => {
    const startGeolocation = new Promise((resolve, reject) => {
        const id = navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
        function success({coords}) {
            const {latitude, longitude} = coords;
            const data = {latitude, longitude, handler: id};
            typeof callback === 'function' && callback(data);
            once(() => resolve(data))();
        }
        function error(data) {
            console.log(data.message); // eslint-disable-line no-console
            if (data.code === 1) { // see https://developer.mozilla.org/en-US/docs/Web/API/PositionError
                reject();
            }
        }
    });
    const data = await startGeolocation.catch(log);
    return data;
};