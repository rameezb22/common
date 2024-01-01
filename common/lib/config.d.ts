export declare namespace TheiaCloudConfig {
    function is(thing: any): thing is TheiaCloudConfig;
}
export declare namespace KeycloakConfig {
    function is(thing: any): thing is KeycloakConfig;
}
interface BaseTheiaCloudConfig {
    appId: string;
    appName: string;
    useKeycloak: boolean;
    serviceUrl: string;
    appDefinition: string;
    useEphemeralStorage: boolean;
}
export interface KeycloakConfig {
    keycloakAuthUrl: string;
    keycloakRealm: string;
    keycloakClientId: string;
}
export type TheiaCloudConfig = BaseTheiaCloudConfig & Partial<KeycloakConfig>;
declare global {
    interface Window {
        theiaCloudConfig: TheiaCloudConfig;
    }
}
export declare function getTheiaCloudConfig(): TheiaCloudConfig | undefined;
export {};
//# sourceMappingURL=config.d.ts.map