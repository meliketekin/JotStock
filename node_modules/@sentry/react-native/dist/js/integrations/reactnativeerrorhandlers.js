import { __awaiter } from "tslib";
import { eventFromException } from '@sentry/browser';
import { getCurrentHub } from '@sentry/core';
import { Severity } from '@sentry/types';
import { addExceptionMechanism, getGlobalObject, logger } from '@sentry/utils';
/** ReactNativeErrorHandlers Integration */
export class ReactNativeErrorHandlers {
    /** Constructor */
    constructor(options) {
        /**
         * @inheritDoc
         */
        this.name = ReactNativeErrorHandlers.id;
        this._options = Object.assign({ onerror: true, onunhandledrejection: true, patchGlobalPromise: true }, options);
    }
    /**
     * @inheritDoc
     */
    setupOnce() {
        this._handleUnhandledRejections();
        this._handleOnError();
    }
    /**
     * Handle Promises
     */
    _handleUnhandledRejections() {
        if (this._options.onunhandledrejection) {
            if (this._options.patchGlobalPromise) {
                this._polyfillPromise();
            }
            this._attachUnhandledRejectionHandler();
            this._checkPromiseAndWarn();
        }
    }
    /**
     * Polyfill the global promise instance with one we can be sure that we can attach the tracking to.
     *
     * In newer RN versions >=0.63, the global promise is not the same reference as the one imported from the promise library.
     * This is due to a version mismatch between promise versions.
     * Originally we tried a solution where we would have you put a package resolution to ensure the promise instances match. However,
     * - Using a package resolution requires the you to manually troubleshoot.
     * - The package resolution fix no longer works with 0.67 on iOS Hermes.
     */
    _polyfillPromise() {
        /* eslint-disable import/no-extraneous-dependencies,@typescript-eslint/no-var-requires */
        const { polyfillGlobal, } = require('react-native/Libraries/Utilities/PolyfillFunctions');
        // Below, we follow the exact way React Native initializes its promise library, and we globally replace it.
        const Promise = require('promise/setimmediate/es6-extensions');
        // As of RN 0.67 only done and finally are used
        require('promise/setimmediate/done');
        require('promise/setimmediate/finally');
        polyfillGlobal('Promise', () => Promise);
        /* eslint-enable import/no-extraneous-dependencies,@typescript-eslint/no-var-requires */
    }
    /**
     * Attach the unhandled rejection handler
     */
    _attachUnhandledRejectionHandler() {
        const tracking = require('promise/setimmediate/rejection-tracking');
        const promiseRejectionTrackingOptions = {
            onUnhandled: (id, rejection = {}) => {
                // eslint-disable-next-line no-console
                console.warn(`Possible Unhandled Promise Rejection (id: ${id}):\n${rejection}`);
            },
            onHandled: (id) => {
                // eslint-disable-next-line no-console
                console.warn(`Promise Rejection Handled (id: ${id})\n` +
                    'This means you can ignore any previous messages of the form ' +
                    `"Possible Unhandled Promise Rejection (id: ${id}):"`);
            },
        };
        tracking.enable({
            allRejections: true,
            onUnhandled: (id, error) => {
                if (__DEV__) {
                    promiseRejectionTrackingOptions.onUnhandled(id, error);
                }
                getCurrentHub().captureException(error, {
                    data: { id },
                    originalException: error,
                });
            },
            onHandled: (id) => {
                promiseRejectionTrackingOptions.onHandled(id);
            },
        });
    }
    /**
     * Checks if the promise is the same one or not, if not it will warn the user
     */
    _checkPromiseAndWarn() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
            const Promise = require('promise/setimmediate/es6-extensions');
            const _global = getGlobalObject();
            if (Promise !== _global.Promise) {
                logger.warn('Unhandled promise rejections will not be caught by Sentry. Read about how to fix this on our troubleshooting page.');
            }
            else {
                logger.log('Unhandled promise rejections will be caught by Sentry.');
            }
        }
        catch (e) {
            // Do Nothing
            logger.warn('Unhandled promise rejections will not be caught by Sentry. Read about how to fix this on our troubleshooting page.');
        }
    }
    /**
     * Handle errors
     */
    _handleOnError() {
        if (this._options.onerror) {
            let handlingFatal = false;
            const defaultHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ErrorUtils.setGlobalHandler((error, isFatal) => __awaiter(this, void 0, void 0, function* () {
                // We want to handle fatals, but only in production mode.
                const shouldHandleFatal = isFatal && !__DEV__;
                if (shouldHandleFatal) {
                    if (handlingFatal) {
                        logger.log('Encountered multiple fatals in a row. The latest:', error);
                        return;
                    }
                    handlingFatal = true;
                }
                const currentHub = getCurrentHub();
                const client = currentHub.getClient();
                if (!client) {
                    logger.error('Sentry client is missing, the error event might be lost.', error);
                    // If there is no client something is fishy, anyway we call the default handler
                    defaultHandler(error, isFatal);
                    return;
                }
                const options = client.getOptions();
                const event = yield eventFromException(error, {
                    originalException: error,
                }, options.attachStacktrace);
                if (isFatal) {
                    event.level = Severity.Fatal;
                    addExceptionMechanism(event, {
                        handled: false,
                        type: 'onerror',
                    });
                }
                currentHub.captureEvent(event);
                if (!__DEV__) {
                    void client.flush(options.shutdownTimeout || 2000).then(() => {
                        defaultHandler(error, isFatal);
                    });
                }
                else {
                    // If in dev, we call the default handler anyway and hope the error will be sent
                    // Just for a better dev experience
                    defaultHandler(error, isFatal);
                }
            }));
        }
    }
}
/**
 * @inheritDoc
 */
ReactNativeErrorHandlers.id = 'ReactNativeErrorHandlers';
//# sourceMappingURL=reactnativeerrorhandlers.js.map