import {getPosition, watchPosition} from '../src/utils';


describe('Geolocation utilities', () => {
    test('can get position', async () => {
        const {latitude, longitude} = await getPosition();
        expect(latitude).toBeLatitudeValue();
        expect(longitude).toBeLongitudeValue();
    });
    test('can watch position', async () => {
        const callback = jest.fn(({latitude, longitude}) => {
            expect(latitude).toBeLatitudeValue();
            expect(longitude).toBeLongitudeValue();
        });
        const {handler} = await watchPosition(callback);
        expect(callback).toHaveBeenCalled();
        setTimeout(()=>{
            expect(handler).toBe(expect.any(Number));
        }, 0);
    });
});