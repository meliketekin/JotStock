import { __awaiter } from "tslib";
import { initAndBind, setExtra } from '@sentry/core';
import { Hub, makeMain } from '@sentry/hub';
import { RewriteFrames } from '@sentry/integrations';
import { defaultIntegrations, getCurrentHub } from '@sentry/react';
import { getGlobalObject, logger } from '@sentry/utils';
import * as React from 'react';
import { ReactNativeClient } from './client';
import { DebugSymbolicator, DeviceContext, EventOrigin, ReactNativeErrorHandlers, Release, SdkInfo, } from './integrations';
import { ReactNativeScope } from './scope';
import { TouchEventBoundary } from './touchevents';
import { ReactNativeProfiler, ReactNativeTracing } from './tracing';
const IGNORED_DEFAULT_INTEGRATIONS = [
    'GlobalHandlers',
    'TryCatch',
];
const DEFAULT_OPTIONS = {
    enableNative: true,
    enableNativeCrashHandling: true,
    enableNativeNagger: true,
    autoInitializeNativeSdk: true,
    enableAutoPerformanceTracking: true,
    enableOutOfMemoryTracking: true,
    patchGlobalPromise: true,
};
/**
 * Inits the SDK and returns the final options.
 */
export function init(passedOptions) {
    const reactNativeHub = new Hub(undefined, new ReactNativeScope());
    makeMain(reactNativeHub);
    const options = Object.assign(Object.assign({}, DEFAULT_OPTIONS), passedOptions);
    // As long as tracing is opt in with either one of these options, then this is how we determine tracing is enabled.
    const tracingEnabled = typeof options.tracesSampler !== 'undefined' ||
        typeof options.tracesSampleRate !== 'undefined';
    if (options.defaultIntegrations === undefined) {
        options.defaultIntegrations = [
            new ReactNativeErrorHandlers({
                patchGlobalPromise: options.patchGlobalPromise,
            }),
            new Release(),
            ...defaultIntegrations.filter((i) => !IGNORED_DEFAULT_INTEGRATIONS.includes(i.name)),
            new EventOrigin(),
            new SdkInfo(),
        ];
        if (__DEV__) {
            options.defaultIntegrations.push(new DebugSymbolicator());
        }
        options.defaultIntegrations.push(new RewriteFrames({
            iteratee: (frame) => {
                if (frame.filename) {
                    frame.filename = frame.filename
                        .replace(/^file:\/\//, '')
                        .replace(/^address at /, '')
                        .replace(/^.*\/[^.]+(\.app|CodePush|.*(?=\/))/, '');
                    if (frame.filename !== '[native code]' &&
                        frame.filename !== 'native') {
                        const appPrefix = 'app://';
                        // We always want to have a triple slash
                        frame.filename =
                            frame.filename.indexOf('/') === 0
                                ? `${appPrefix}${frame.filename}`
                                : `${appPrefix}/${frame.filename}`;
                    }
                }
                return frame;
            },
        }));
        if (options.enableNative) {
            options.defaultIntegrations.push(new DeviceContext());
        }
        if (tracingEnabled) {
            if (options.enableAutoPerformanceTracking) {
                options.defaultIntegrations.push(new ReactNativeTracing());
            }
        }
    }
    initAndBind(ReactNativeClient, options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
    if (getGlobalObject().HermesInternal) {
        getCurrentHub().setTag('hermes', 'true');
    }
}
/**
 * Inits the Sentry React Native SDK with automatic instrumentation and wrapped features.
 */
export function wrap(RootComponent, options) {
    var _a, _b;
    const tracingIntegration = getCurrentHub().getIntegration(ReactNativeTracing);
    if (tracingIntegration) {
        tracingIntegration.useAppStartWithProfiler = true;
    }
    const profilerProps = Object.assign(Object.assign({}, ((_a = options === null || options === void 0 ? void 0 : options.profilerProps) !== null && _a !== void 0 ? _a : {})), { name: (_b = RootComponent.displayName) !== null && _b !== void 0 ? _b : 'Root' });
    const RootApp = (appProps) => {
        var _a;
        return (<TouchEventBoundary {...((_a = options === null || options === void 0 ? void 0 : options.touchEventBoundaryProps) !== null && _a !== void 0 ? _a : {})}>
        <ReactNativeProfiler {...profilerProps}>
          <RootComponent {...appProps}/>
        </ReactNativeProfiler>
      </TouchEventBoundary>);
    };
    return RootApp;
}
/**
 * Deprecated. Sets the release on the event.
 * NOTE: Does not set the release on sessions.
 * @deprecated
 */
export function setRelease(release) {
    setExtra('__sentry_release', release);
}
/**
 * Deprecated. Sets the dist on the event.
 * NOTE: Does not set the dist on sessions.
 * @deprecated
 */
export function setDist(dist) {
    setExtra('__sentry_dist', dist);
}
/**
 * If native client is available it will trigger a native crash.
 * Use this only for testing purposes.
 */
export function nativeCrash() {
    const client = getCurrentHub().getClient();
    if (client) {
        client.nativeCrash();
    }
}
/**
 * Flushes all pending events in the queue to disk.
 * Use this before applying any realtime updates such as code-push or expo updates.
 */
export function flush() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = getCurrentHub().getClient();
            if (client) {
                const result = yield client.flush();
                return result;
            }
            // eslint-disable-next-line no-empty
        }
        catch (_) { }
        logger.error('Failed to flush the event queue.');
        return false;
    });
}
/**
 * Closes the SDK, stops sending events.
 */
export function close() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = getCurrentHub().getClient();
            if (client) {
                yield client.close();
            }
        }
        catch (e) {
            logger.error('Failed to close the SDK');
        }
    });
}
//# sourceMappingURL=sdk.js.map