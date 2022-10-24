import { Breadcrumb, Event, Package, Response, Severity, User } from '@sentry/types';
import { Platform } from 'react-native';
import { NativeAppStartResponse, NativeDeviceContextsResponse, NativeFramesResponse, NativeReleaseResponse, SentryNativeBridgeModule } from './definitions';
import { ReactNativeOptions } from './options';
interface SentryNativeWrapper {
    enableNative: boolean;
    nativeIsReady: boolean;
    platform: typeof Platform.OS;
    _NativeClientError: Error;
    _DisabledNativeError: Error;
    _processLevels(event: Event): Event;
    _processLevel(level: Severity): Severity;
    _serializeObject(data: {
        [key: string]: unknown;
    }): {
        [key: string]: string;
    };
    _isModuleLoaded(module: SentryNativeBridgeModule | undefined): module is SentryNativeBridgeModule;
    isNativeTransportAvailable(): boolean;
    initNativeSdk(options: ReactNativeOptions): PromiseLike<boolean>;
    closeNativeSdk(): PromiseLike<void>;
    sendEvent(event: Event): PromiseLike<Response>;
    fetchNativeRelease(): PromiseLike<NativeReleaseResponse>;
    fetchNativeDeviceContexts(): PromiseLike<NativeDeviceContextsResponse>;
    fetchNativeAppStart(): PromiseLike<NativeAppStartResponse | null>;
    fetchNativeFrames(): PromiseLike<NativeFramesResponse | null>;
    fetchNativeSdkInfo(): PromiseLike<Package | null>;
    disableNativeFramesTracking(): void;
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    setContext(key: string, context: {
        [key: string]: unknown;
    } | null): void;
    clearBreadcrumbs(): void;
    setExtra(key: string, extra: unknown): void;
    setUser(user: User | null): void;
    setTag(key: string, value: string): void;
    nativeCrash(): void;
}
/**
 * Our internal interface for calling native functions
 */
export declare const NATIVE: SentryNativeWrapper;
export {};
//# sourceMappingURL=wrapper.d.ts.map