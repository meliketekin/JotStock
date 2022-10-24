import { __awaiter, __rest } from "tslib";
/* eslint-disable max-lines */
import { Severity, } from '@sentry/types';
import { logger, SentryError } from '@sentry/utils';
import { NativeModules, Platform } from 'react-native';
const RNSentry = NativeModules.RNSentry;
/**
 * Our internal interface for calling native functions
 */
export const NATIVE = {
    /**
     * Sending the event over the bridge to native
     * @param event Event
     */
    sendEvent(_event) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                return {
                    reason: 'Event was skipped as native SDK is not enabled.',
                    status: 'skipped',
                };
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            const event = this._processLevels(_event);
            // Delete this metadata as this should not be sent to Sentry.
            delete event.sdkProcessingMetadata;
            const header = {
                event_id: event.event_id,
                sdk: event.sdk,
            };
            let envelopeWasSent = false;
            if (NATIVE.platform === 'android') {
                // Android
                const headerString = JSON.stringify(header);
                /*
                  We do this to avoid duplicate breadcrumbs on Android as sentry-android applies the breadcrumbs
                  from the native scope onto every envelope sent through it. This scope will contain the breadcrumbs
                  sent through the scope sync feature. This causes duplicate breadcrumbs.
                  We then remove the breadcrumbs in all cases but if it is handled == false,
                  this is a signal that the app would crash and android would lose the breadcrumbs by the time the app is restarted to read
                  the envelope.
                */
                if (((_d = (_c = (_b = (_a = event.exception) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.mechanism) === null || _d === void 0 ? void 0 : _d.handled) != false && event.breadcrumbs) {
                    event.breadcrumbs = [];
                }
                const payload = Object.assign(Object.assign({}, event), { message: {
                        message: event.message,
                    } });
                const payloadString = JSON.stringify(payload);
                let length = payloadString.length;
                try {
                    length = yield RNSentry.getStringBytesLength(payloadString);
                }
                catch (_f) {
                    // The native call failed, we do nothing, we have payload.length as a fallback
                }
                const item = {
                    content_type: 'application/json',
                    length,
                    type: (_e = payload.type) !== null && _e !== void 0 ? _e : 'event',
                };
                const itemString = JSON.stringify(item);
                const envelopeString = `${headerString}\n${itemString}\n${payloadString}`;
                envelopeWasSent = yield RNSentry.captureEnvelope(envelopeString);
            }
            else {
                // iOS/Mac
                const payload = Object.assign(Object.assign({}, event), { message: {
                        message: event.message,
                    } });
                // Serialize and remove any instances that will crash the native bridge such as Spans
                const serializedPayload = JSON.parse(JSON.stringify(payload));
                // The envelope item is created (and its length determined) on the iOS side of the native bridge.
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                envelopeWasSent = yield RNSentry.captureEnvelope({
                    header,
                    payload: serializedPayload,
                });
            }
            if (envelopeWasSent) {
                return {
                    status: 'success',
                };
            }
            return {
                status: 'failed',
            };
        });
    },
    /**
     * Starts native with the provided options.
     * @param options ReactNativeOptions
     */
    initNativeSdk(originalOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = Object.assign({ enableNative: true, autoInitializeNativeSdk: true }, originalOptions);
            if (!options.enableNative) {
                if (options.enableNativeNagger) {
                    logger.warn('Note: Native Sentry SDK is disabled.');
                }
                this.enableNative = false;
                return false;
            }
            if (!options.autoInitializeNativeSdk) {
                if (options.enableNativeNagger) {
                    logger.warn('Note: Native Sentry SDK was not initialized automatically, you will need to initialize it manually. If you wish to disable the native SDK and get rid of this warning, pass enableNative: false');
                }
                return false;
            }
            if (!options.dsn) {
                logger.warn('Warning: No DSN was provided. The Sentry SDK will be disabled. Native SDK will also not be initalized.');
                return false;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            // filter out all the options that would crash native.
            /* eslint-disable @typescript-eslint/unbound-method,@typescript-eslint/no-unused-vars */
            const { beforeSend, beforeBreadcrumb, integrations, defaultIntegrations, transport } = options, filteredOptions = __rest(options, ["beforeSend", "beforeBreadcrumb", "integrations", "defaultIntegrations", "transport"]);
            /* eslint-enable @typescript-eslint/unbound-method,@typescript-eslint/no-unused-vars */
            const nativeIsReady = yield RNSentry.initNativeSdk(filteredOptions);
            this.nativeIsReady = nativeIsReady;
            return nativeIsReady;
        });
    },
    /**
     * Fetches the release from native
     */
    fetchNativeRelease() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeRelease();
        });
    },
    /**
     * Fetches the Sdk info for the native sdk.
     * NOTE: Only available on iOS.
     */
    fetchNativeSdkInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            if (this.platform !== 'ios') {
                return null;
            }
            return RNSentry.fetchNativeSdkInfo();
        });
    },
    /**
     * Fetches the device contexts. Not used on Android.
     */
    fetchNativeDeviceContexts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            if (this.platform !== 'ios') {
                // Only ios uses deviceContexts, return an empty object.
                return {};
            }
            return RNSentry.fetchNativeDeviceContexts();
        });
    },
    fetchNativeAppStart() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeAppStart();
        });
    },
    fetchNativeFrames() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                throw this._DisabledNativeError;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                throw this._NativeClientError;
            }
            return RNSentry.fetchNativeFrames();
        });
    },
    /**
     * Triggers a native crash.
     * Use this only for testing purposes.
     */
    nativeCrash() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.crash();
    },
    /**
     * Sets the user in the native scope.
     * Passing null clears the user.
     */
    setUser(user) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        // separate and serialze all non-default user keys.
        let defaultUserKeys = null;
        let otherUserKeys = null;
        if (user) {
            const { id, ip_address, email, username } = user, otherKeys = __rest(user, ["id", "ip_address", "email", "username"]);
            defaultUserKeys = this._serializeObject({
                email,
                id,
                ip_address,
                username,
            });
            otherUserKeys = this._serializeObject(otherKeys);
        }
        RNSentry.setUser(defaultUserKeys, otherUserKeys);
    },
    /**
     * Sets a tag in the native module.
     * @param key string
     * @param value string
     */
    setTag(key, value) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);
        RNSentry.setTag(key, stringifiedValue);
    },
    /**
     * Sets an extra in the native scope, will stringify
     * extra value if it isn't already a string.
     * @param key string
     * @param extra any
     */
    setExtra(key, extra) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        // we stringify the extra as native only takes in strings.
        const stringifiedExtra = typeof extra === 'string' ? extra : JSON.stringify(extra);
        RNSentry.setExtra(key, stringifiedExtra);
    },
    /**
     * Adds breadcrumb to the native scope.
     * @param breadcrumb Breadcrumb
     */
    addBreadcrumb(breadcrumb) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.addBreadcrumb(Object.assign(Object.assign({}, breadcrumb), { 
            // Process and convert deprecated levels
            level: breadcrumb.level
                ? this._processLevel(breadcrumb.level)
                : undefined, data: breadcrumb.data
                ? this._serializeObject(breadcrumb.data)
                : undefined }));
    },
    /**
     * Clears breadcrumbs on the native scope.
     */
    clearBreadcrumbs() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.clearBreadcrumbs();
    },
    /**
     * Sets context on the native scope. Not implemented in Android yet.
     * @param key string
     * @param context key-value map
     */
    setContext(key, context) {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            throw this._NativeClientError;
        }
        RNSentry.setContext(key, context !== null ? this._serializeObject(context) : null);
    },
    /**
     * Closes the Native Layer SDK
     */
    closeNativeSdk() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enableNative) {
                return;
            }
            if (!this._isModuleLoaded(RNSentry)) {
                return;
            }
            return RNSentry.closeNativeSdk().then(() => {
                this.enableNative = false;
            });
        });
    },
    disableNativeFramesTracking() {
        if (!this.enableNative) {
            return;
        }
        if (!this._isModuleLoaded(RNSentry)) {
            return;
        }
        RNSentry.disableNativeFramesTracking();
    },
    isNativeTransportAvailable() {
        return this.enableNative && this._isModuleLoaded(RNSentry);
    },
    /**
     * Serializes all values of root-level keys into strings.
     * @param data key-value map.
     * @returns An object where all root-level values are strings.
     */
    _serializeObject(data) {
        const serialized = {};
        Object.keys(data).forEach((dataKey) => {
            const value = data[dataKey];
            serialized[dataKey] =
                typeof value === 'string' ? value : JSON.stringify(value);
        });
        return serialized;
    },
    /**
     * Convert js severity level in event.level and event.breadcrumbs to more widely supported levels.
     * @param event
     * @returns Event with more widely supported Severity level strings
     */
    _processLevels(event) {
        var _a;
        const processed = Object.assign(Object.assign({}, event), { level: event.level ? this._processLevel(event.level) : undefined, breadcrumbs: (_a = event.breadcrumbs) === null || _a === void 0 ? void 0 : _a.map((breadcrumb) => (Object.assign(Object.assign({}, breadcrumb), { level: breadcrumb.level
                    ? this._processLevel(breadcrumb.level)
                    : undefined }))) });
        return processed;
    },
    /**
     * Convert js severity level which has critical and log to more widely supported levels.
     * @param level
     * @returns More widely supported Severity level strings
     */
    _processLevel(level) {
        if (level === Severity.Critical) {
            return Severity.Fatal;
        }
        if (level === Severity.Log) {
            return Severity.Debug;
        }
        return level;
    },
    /**
     * Checks whether the RNSentry module is loaded.
     */
    _isModuleLoaded(module) {
        return !!module;
    },
    _DisabledNativeError: new SentryError('Native is disabled'),
    _NativeClientError: new SentryError("Native Client is not available, can't start on native."),
    enableNative: true,
    nativeIsReady: false,
    platform: Platform.OS,
};
//# sourceMappingURL=wrapper.js.map