import * as React from 'react';
import { ReactNativeOptions, ReactNativeWrapperOptions } from './options';
/**
 * Inits the SDK and returns the final options.
 */
export declare function init(passedOptions: ReactNativeOptions): void;
/**
 * Inits the Sentry React Native SDK with automatic instrumentation and wrapped features.
 */
export declare function wrap<P>(RootComponent: React.ComponentType<P>, options?: ReactNativeWrapperOptions): React.ComponentType<P>;
/**
 * Deprecated. Sets the release on the event.
 * NOTE: Does not set the release on sessions.
 * @deprecated
 */
export declare function setRelease(release: string): void;
/**
 * Deprecated. Sets the dist on the event.
 * NOTE: Does not set the dist on sessions.
 * @deprecated
 */
export declare function setDist(dist: string): void;
/**
 * If native client is available it will trigger a native crash.
 * Use this only for testing purposes.
 */
export declare function nativeCrash(): void;
/**
 * Flushes all pending events in the queue to disk.
 * Use this before applying any realtime updates such as code-push or expo updates.
 */
export declare function flush(): Promise<boolean>;
/**
 * Closes the SDK, stops sending events.
 */
export declare function close(): Promise<void>;
//# sourceMappingURL=sdk.d.ts.map