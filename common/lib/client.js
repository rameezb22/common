"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheiaCloudError = exports.TheiaCloudErrorResponse = exports.TheiaCloud = exports.WorkspaceDeletionRequest = exports.WorkspaceCreationRequest = exports.WorkspaceListRequest = exports.SessionActivityRequest = exports.SessionStopRequest = exports.SessionStartRequest = exports.SessionListRequest = exports.LaunchRequest = exports.PingRequest = exports.ServiceRequest = exports.DEFAULT_CALL_RETRIES = exports.DEFAULT_CALL_TIMEOUT = void 0;
const axios_1 = require("axios");
const uuid_1 = require("uuid");
//const axios = require('axios');
const api_1 = require("./client/api");
const configuration_1 = require("./client/configuration");
exports.DEFAULT_CALL_TIMEOUT = 30000;
exports.DEFAULT_CALL_RETRIES = 0;
var ServiceRequest;
(function (ServiceRequest) {
    function is(obj) {
        return !!obj && typeof obj.serviceUrl === 'string';
    }
    ServiceRequest.is = is;
})(ServiceRequest || (exports.ServiceRequest = ServiceRequest = {}));
var PingRequest;
(function (PingRequest) {
    PingRequest.KIND = 'pingRequest';
    function create(serviceUrl, appId) {
        return { serviceUrl, appId };
    }
    PingRequest.create = create;
})(PingRequest || (exports.PingRequest = PingRequest = {}));
var LaunchRequest;
(function (LaunchRequest) {
    LaunchRequest.KIND = 'launchRequest';
    function ephemeral(serviceUrl, appId, appDefinition, timeout, user = createUser()) {
        return { serviceUrl, appId, appDefinition, user, ephemeral: true, timeout };
    }
    LaunchRequest.ephemeral = ephemeral;
    function createWorkspace(serviceUrl, appId, appDefinition, timeout, user = createUser(), workspaceName, label) {
        return { serviceUrl, appId, appDefinition, user, label, workspaceName, ephemeral: false, timeout };
    }
    LaunchRequest.createWorkspace = createWorkspace;
    // eslint-disable-next-line max-len
    function existingWorkspace(serviceUrl, appId, workspaceName, timeout, appDefinition, user = createUser()) {
        return { serviceUrl, appId, workspaceName, appDefinition, user, timeout };
    }
    LaunchRequest.existingWorkspace = existingWorkspace;
})(LaunchRequest || (exports.LaunchRequest = LaunchRequest = {}));
var SessionListRequest;
(function (SessionListRequest) {
    SessionListRequest.KIND = 'sessionListRequest';
})(SessionListRequest || (exports.SessionListRequest = SessionListRequest = {}));
var SessionStartRequest;
(function (SessionStartRequest) {
    SessionStartRequest.KIND = 'sessionStartRequest';
})(SessionStartRequest || (exports.SessionStartRequest = SessionStartRequest = {}));
var SessionStopRequest;
(function (SessionStopRequest) {
    SessionStopRequest.KIND = 'sessionStopRequest';
})(SessionStopRequest || (exports.SessionStopRequest = SessionStopRequest = {}));
var SessionActivityRequest;
(function (SessionActivityRequest) {
    SessionActivityRequest.KIND = 'sessionActivityRequest';
})(SessionActivityRequest || (exports.SessionActivityRequest = SessionActivityRequest = {}));
var WorkspaceListRequest;
(function (WorkspaceListRequest) {
    WorkspaceListRequest.KIND = 'workspaceListRequest';
})(WorkspaceListRequest || (exports.WorkspaceListRequest = WorkspaceListRequest = {}));
var WorkspaceCreationRequest;
(function (WorkspaceCreationRequest) {
    WorkspaceCreationRequest.KIND = 'workspaceCreationRequest';
})(WorkspaceCreationRequest || (exports.WorkspaceCreationRequest = WorkspaceCreationRequest = {}));
var WorkspaceDeletionRequest;
(function (WorkspaceDeletionRequest) {
    WorkspaceDeletionRequest.KIND = 'workspaceDeletionRequest';
})(WorkspaceDeletionRequest || (exports.WorkspaceDeletionRequest = WorkspaceDeletionRequest = {}));
var TheiaCloud;
(function (TheiaCloud) {
    function basePath(url) {
        // remove any path names as they are provided by the APIs
        const pathName = new URL(url).pathname;
        return url.endsWith(pathName) ? url.substring(0, url.length - new URL(url).pathname.length) : url;
    }
    function rootApi(url, accessToken) {
        return new api_1.RootResourceApi(new configuration_1.Configuration({ basePath: basePath(url), accessToken }));
    }
    function sessionApi(url, accessToken) {
        return new api_1.SessionResourceApi(new configuration_1.Configuration({ basePath: basePath(url), accessToken }));
    }
    function workspaceApi(url, accessToken) {
        return new api_1.WorkspaceResourceApi(new configuration_1.Configuration({ basePath: basePath(url), accessToken }));
    }
    async function ping(request, options = {}) {
        const { accessToken, retries, timeout } = options;
        return call(() => rootApi(request.serviceUrl, accessToken).serviceAppIdGet(request.appId, createConfig(timeout)), retries);
    }
    TheiaCloud.ping = ping;
    async function launch(request, options = {}) {
        const { accessToken, retries, timeout } = options;
        const launchRequest = { kind: LaunchRequest.KIND, ...request };
        return call(() => rootApi(request.serviceUrl, accessToken).servicePost(launchRequest, createConfig(timeout)), retries);
    }
    TheiaCloud.launch = launch;
    async function launchAndRedirect(request, options = {}) {
        const url = await launch(request, options);
        const currentUrl = window.location.href;
        console.log("current url" + currentUrl);
        console.log("returned url" + `https://${url}`);
        var redirect = true;
        while (redirect) {
            try {
                await fetch(`https://${url}`, {
                    method: 'HEAD'
                })
                    .then(response => {
                    console.log("trying again");
                    var start = new Date().getTime();
                    var end = start;
                    while (end < start + 3000) {
                        end = new Date().getTime();
                    }
                }).catch(err => {
                    redirect = false;
                    var start = new Date().getTime();
                    var end = start;
                    while (end < start + 5000) {
                        end = new Date().getTime();
                    }
                    location.replace(`https://${url}`);
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        return url;
    }
    TheiaCloud.launchAndRedirect = launchAndRedirect;
    let Session;
    (function (Session) {
        async function listSessions(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            return call(() => sessionApi(request.serviceUrl, accessToken).serviceSessionAppIdUserGet(request.appId, request.user, createConfig(timeout)), retries);
        }
        Session.listSessions = listSessions;
        async function startSession(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            const sessionStartRequest = { kind: SessionStartRequest.KIND, ...request };
            return call(() => sessionApi(request.serviceUrl, accessToken).serviceSessionPost(sessionStartRequest, createConfig(timeout)), retries);
        }
        Session.startSession = startSession;
        async function stopSession(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            const sessionStopRequest = { kind: SessionStopRequest.KIND, ...request };
            return call(() => sessionApi(request.serviceUrl, accessToken).serviceSessionDelete(sessionStopRequest, createConfig(timeout)), retries);
        }
        Session.stopSession = stopSession;
        async function reportSessionActivity(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            const sessionActivityRequest = { kind: SessionActivityRequest.KIND, ...request };
            return call(() => sessionApi(request.serviceUrl, accessToken).serviceSessionPatch(sessionActivityRequest, createConfig(timeout)), retries);
        }
        Session.reportSessionActivity = reportSessionActivity;
    })(Session = TheiaCloud.Session || (TheiaCloud.Session = {}));
    let Workspace;
    (function (Workspace) {
        async function listWorkspaces(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            return call(() => workspaceApi(request.serviceUrl, accessToken).serviceWorkspaceAppIdUserGet(request.appId, request.user, createConfig(timeout)), retries);
        }
        Workspace.listWorkspaces = listWorkspaces;
        async function createWorkspace(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            const workspaceCreationRequest = { kind: WorkspaceCreationRequest.KIND, ...request };
            return call(() => workspaceApi(request.serviceUrl, accessToken).serviceWorkspacePost(workspaceCreationRequest, createConfig(timeout)), retries);
        }
        Workspace.createWorkspace = createWorkspace;
        async function deleteWorkspace(request, options = {}) {
            const { accessToken, retries, timeout } = options;
            const workspaceDeletionRequest = { kind: WorkspaceDeletionRequest.KIND, ...request };
            return call(() => workspaceApi(request.serviceUrl, accessToken).serviceWorkspaceDelete(workspaceDeletionRequest, createConfig(timeout)), retries);
        }
        Workspace.deleteWorkspace = deleteWorkspace;
    })(Workspace = TheiaCloud.Workspace || (TheiaCloud.Workspace = {}));
})(TheiaCloud || (exports.TheiaCloud = TheiaCloud = {}));
function createUser() {
    return (0, uuid_1.v4)() + '@theia.cloud';
}
function createConfig(timeout = exports.DEFAULT_CALL_TIMEOUT) {
    return { timeout };
}
async function call(fn, retries = exports.DEFAULT_CALL_RETRIES) {
    try {
        const response = await fn();
        return response.data;
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        if (retries > 0) {
            return call(fn, retries - 1);
        }
        throw TheiaCloudError.from(error);
    }
}
var TheiaCloudErrorResponse;
(function (TheiaCloudErrorResponse) {
    function is(obj) {
        return !!obj && typeof obj.code === 'number' && typeof obj.reason === 'string';
    }
    TheiaCloudErrorResponse.is = is;
})(TheiaCloudErrorResponse || (exports.TheiaCloudErrorResponse = TheiaCloudErrorResponse = {}));
class TheiaCloudError extends Error {
    constructor(message, status, originalError, serverError, request) {
        super(message);
        this.status = status;
        this.originalError = originalError;
        this.serverError = serverError;
        this.request = request;
    }
    static from(error) {
        if (error instanceof axios_1.AxiosError) {
            const responseData = error.response ? error.response.data : undefined;
            const errorResponse = TheiaCloudErrorResponse.is(responseData) ? responseData : undefined;
            const message = errorResponse ? errorResponse.reason : error.message;
            const requestData = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
            const serviceRequest = ServiceRequest.is(requestData) ? requestData : undefined;
            const status = error.status ? parseInt(error.status, 10)
                : error.response ? error.response.status
                    : errorResponse ? errorResponse.code
                        : TheiaCloudError.INTERNAL_ERROR;
            return new TheiaCloudError(message, status, error, errorResponse, serviceRequest);
        }
        return new TheiaCloudError(error.message, TheiaCloudError.INTERNAL_ERROR, error);
    }
}
exports.TheiaCloudError = TheiaCloudError;
TheiaCloudError.INTERNAL_ERROR = 500;
//# sourceMappingURL=client.js.map