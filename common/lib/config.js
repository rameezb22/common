"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheiaCloudConfig = exports.KeycloakConfig = exports.TheiaCloudConfig = void 0;
var TheiaCloudConfig;
(function (TheiaCloudConfig) {
    function is(thing) {
        return (!!thing &&
            typeof thing === 'object' &&
            typeof thing.appId === 'string' &&
            typeof thing.appName === 'string' &&
            typeof thing.serviceUrl === 'string' &&
            typeof thing.appDefinition === 'string' &&
            typeof thing.useKeycloak === 'boolean' &&
            typeof thing.useEphemeralStorage === 'boolean');
    }
    TheiaCloudConfig.is = is;
})(TheiaCloudConfig || (exports.TheiaCloudConfig = TheiaCloudConfig = {}));
var KeycloakConfig;
(function (KeycloakConfig) {
    function is(thing) {
        return (!!thing &&
            typeof thing === 'object' &&
            typeof thing.keycloakAuthUrl === 'string' &&
            typeof thing.keycloakRealm === 'string' &&
            typeof thing.keycloakClientId === 'string');
    }
    KeycloakConfig.is = is;
})(KeycloakConfig || (exports.KeycloakConfig = KeycloakConfig = {}));
function getTheiaCloudConfig() {
    const config = window.theiaCloudConfig;
    if (TheiaCloudConfig.is(config)) {
        return Object.freeze({ ...config });
    }
    return undefined;
}
exports.getTheiaCloudConfig = getTheiaCloudConfig;
//# sourceMappingURL=config.js.map