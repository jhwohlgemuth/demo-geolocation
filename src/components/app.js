/**
 * Application Core
 * @version 0.0.0
 */
import {Model, history} from 'backbone';
import * as Cesium from 'cesium';
import {Application, View} from 'backbone.marionette';
import AppRouter from 'marionette.approuter';
import {html} from 'lit-html';
import {getPosition, watchPosition} from '../utils';
import * as logging from '../plugins/mn.radio.logging';
import state from '../plugins/mn.redux.state';
import '../shims/mn.renderer.shim';
import body from './body';
import 'cesium/Widgets/widgets.css';

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxN2I2N2RkNi1iZjIyLTRjMTItOWU3NS01YTFhYzkxZmE2ZjgiLCJpZCI6MTUxMTYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjcxMjgyMzV9.nEwUTSZ5eViYDZpFGv0r_4y_feyu_rECyNS0uEtsSz4'; // eslint-disable-line max-len

const Router = AppRouter.extend({
    appRoutes: {
        hello: 'sayHello'
    }
});
const App = Application.extend({
    region: {
        el: 'body',
        replaceElement: true
    },
    onBeforeStart(app, options) {
        const {name} = options;
        const controller = {
            sayHello: function() {
                app.info('hello');
            }
        };
        app.info(`${name} is starting...`);
        app.router = new Router({controller});
        history.start();
    },
    onStart(app, options) {
        const {name} = options;
        const MainView = View.extend({
            tagName: 'body',
            template: html`${body}`,
            model: new Model(),
            async onAttach() {
                const viewer = new Cesium.Viewer('cesium-container', {
                    sceneMode: Cesium.SceneMode.SCENE2D,
                    sceneModePicker: false,
                    animation: false,
                    fullscreenButton: false,
                    infoBox: false,
                    navigationHelpButton: false,
                    selectionIndicator: false,
                    timeline: false
                });
                const {latitude, longitude} = await getPosition();
                const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
                const point = {
                    pixelSize: 30,
                    color: Cesium.Color.DEEPPINK
                };
                const entity = viewer.entities.add({position, point});
                viewer.zoomTo(entity);
                const {handler} = await watchPosition(({latitude, longitude}) => {
                    console.log('position updated:', latitude, longitude); // eslint-disable-line no-console
                    entity.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
                });
                this.clearWatch = () => navigator.geolocation.clearWatch(handler);
            }
        });
        app.getRegion().show(new MainView());
        app.info(`${name} is started!`);
    }
});

export default Object.assign(new App(), logging, state);