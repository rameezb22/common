import { LaunchRequest as ClientLaunchRequest, PingRequest as ClientPingRequest, SessionActivityRequest as ClientSessionActivityRequest, SessionListRequest as ClientSessionListRequest, SessionStartRequest as ClientSessionStartRequest, SessionStopRequest as ClientSessionStopRequest, WorkspaceCreationRequest as ClientWorkspaceCreationRequest, WorkspaceDeletionRequest as ClientWorkspaceDeletionRequest, WorkspaceListRequest as ClientWorkspaceListRequest, SessionSpec, UserWorkspace } from './client/api';
export declare const DEFAULT_CALL_TIMEOUT = 30000;
export declare const DEFAULT_CALL_RETRIES = 0;
export interface RequestOptions {
    accessToken?: string;
    retries?: number;
    timeout?: number;
}
export interface ServiceRequest {
    serviceUrl: string;
    kind?: string;
}
export declare namespace ServiceRequest {
    function is(obj?: any): obj is ServiceRequest;
}
export type PingRequest = ClientPingRequest & ServiceRequest;
export declare namespace PingRequest {
    const KIND = "pingRequest";
    function create(serviceUrl: string, appId: string): PingRequest;
}
export type LaunchRequest = ClientLaunchRequest & ServiceRequest;
export declare namespace LaunchRequest {
    const KIND = "launchRequest";
    function ephemeral(serviceUrl: string, appId: string, appDefinition: string, timeout?: number, user?: string): LaunchRequest;
    function createWorkspace(serviceUrl: string, appId: string, appDefinition: string, timeout?: number, user?: string, workspaceName?: string, label?: string): LaunchRequest;
    function existingWorkspace(serviceUrl: string, appId: string, workspaceName: string, timeout?: number, appDefinition?: string, user?: string): LaunchRequest;
}
export type SessionListRequest = ClientSessionListRequest & ServiceRequest;
export declare namespace SessionListRequest {
    const KIND = "sessionListRequest";
}
export type SessionStartRequest = ClientSessionStartRequest & ServiceRequest;
export declare namespace SessionStartRequest {
    const KIND = "sessionStartRequest";
}
export type SessionStopRequest = ClientSessionStopRequest & ServiceRequest;
export declare namespace SessionStopRequest {
    const KIND = "sessionStopRequest";
}
export type SessionActivityRequest = ClientSessionActivityRequest & ServiceRequest;
export declare namespace SessionActivityRequest {
    const KIND = "sessionActivityRequest";
}
export type WorkspaceListRequest = ClientWorkspaceListRequest & ServiceRequest;
export declare namespace WorkspaceListRequest {
    const KIND = "workspaceListRequest";
}
export type WorkspaceCreationRequest = ClientWorkspaceCreationRequest & ServiceRequest;
export declare namespace WorkspaceCreationRequest {
    const KIND = "workspaceCreationRequest";
}
export type WorkspaceDeletionRequest = ClientWorkspaceDeletionRequest & ServiceRequest;
export declare namespace WorkspaceDeletionRequest {
    const KIND = "workspaceDeletionRequest";
}
export declare namespace TheiaCloud {
    function ping(request: PingRequest, options?: RequestOptions): Promise<boolean>;
    function launch(request: LaunchRequest, options?: RequestOptions): Promise<string>;
    function launchAndRedirect(request: LaunchRequest, options?: RequestOptions): Promise<string>;
    namespace Session {
        function listSessions(request: SessionListRequest, options?: RequestOptions): Promise<SessionSpec[]>;
        function startSession(request: SessionStartRequest, options?: RequestOptions): Promise<string>;
        function stopSession(request: SessionStopRequest, options?: RequestOptions): Promise<boolean>;
        function reportSessionActivity(request: SessionActivityRequest, options?: RequestOptions): Promise<boolean>;
    }
    namespace Workspace {
        function listWorkspaces(request: WorkspaceListRequest, options?: RequestOptions): Promise<UserWorkspace[]>;
        function createWorkspace(request: WorkspaceCreationRequest, options?: RequestOptions): Promise<UserWorkspace>;
        function deleteWorkspace(request: WorkspaceDeletionRequest, options?: RequestOptions): Promise<boolean>;
    }
}
export interface TheiaCloudErrorResponse {
    code: number;
    reason: string;
}
export declare namespace TheiaCloudErrorResponse {
    function is(obj?: any): obj is TheiaCloudErrorResponse;
}
export declare class TheiaCloudError extends Error {
    status: number;
    originalError: Error;
    serverError?: TheiaCloudErrorResponse | undefined;
    request?: ServiceRequest | undefined;
    static INTERNAL_ERROR: number;
    constructor(message: string, status: number, originalError: Error, serverError?: TheiaCloudErrorResponse | undefined, request?: ServiceRequest | undefined);
    static from(error: Error): TheiaCloudError;
}
//# sourceMappingURL=client.d.ts.map