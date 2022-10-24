import { __awaiter } from "tslib";
import { defaultRequestInstrumentationOptions, registerRequestInstrumentation, startIdleTransaction, } from '@sentry/tracing';
import { logger } from '@sentry/utils';
import { NATIVE } from '../wrapper';
import { NativeFramesInstrumentation } from './nativeframes';
import { StallTrackingInstrumentation } from './stalltracking';
import { adjustTransactionDuration, getTimeOriginMilliseconds, isNearToNow, } from './utils';
const defaultReactNativeTracingOptions = Object.assign(Object.assign({}, defaultRequestInstrumentationOptions), { idleTimeout: 1000, maxTransactionDuration: 600, ignoreEmptyBackNavigationTransactions: true, beforeNavigate: (context) => context, enableAppStartTracking: true, enableNativeFramesTracking: true, enableStallTracking: true });
/**
 * Tracing integration for React Native.
 */
export class ReactNativeTracing {
    constructor(options = {}) {
        /**
         * @inheritDoc
         */
        this.name = ReactNativeTracing.id;
        this.useAppStartWithProfiler = false;
        this.options = Object.assign(Object.assign({}, defaultReactNativeTracingOptions), options);
    }
    /**
     *  Registers routing and request instrumentation.
     */
    setupOnce(
    // @ts-ignore TODO
    addGlobalEventProcessor, getCurrentHub) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { traceFetch, traceXHR, tracingOrigins, 
        // @ts-ignore TODO
        shouldCreateSpanForRequest, routingInstrumentation, enableAppStartTracking, enableNativeFramesTracking, enableStallTracking, } = this.options;
        this._getCurrentHub = getCurrentHub;
        if (enableAppStartTracking) {
            void this._instrumentAppStart();
        }
        if (enableNativeFramesTracking) {
            this.nativeFramesInstrumentation = new NativeFramesInstrumentation(addGlobalEventProcessor, () => {
                const self = getCurrentHub().getIntegration(ReactNativeTracing);
                if (self) {
                    return !!self.nativeFramesInstrumentation;
                }
                return false;
            });
        }
        else {
            NATIVE.disableNativeFramesTracking();
        }
        if (enableStallTracking) {
            this.stallTrackingInstrumentation = new StallTrackingInstrumentation();
        }
        if (routingInstrumentation) {
            routingInstrumentation.registerRoutingInstrumentation(this._onRouteWillChange.bind(this), this.options.beforeNavigate, this._onConfirmRoute.bind(this));
        }
        else {
            logger.log('[ReactNativeTracing] Not instrumenting route changes as routingInstrumentation has not been set.');
        }
        registerRequestInstrumentation({
            traceFetch,
            traceXHR,
            tracingOrigins,
            shouldCreateSpanForRequest,
        });
    }
    /**
     * To be called on a transaction start. Can have async methods
     */
    onTransactionStart(transaction) {
        var _a, _b;
        if (isNearToNow(transaction.startTimestamp)) {
            // Only if this method is called at or within margin of error to the start timestamp.
            (_a = this.nativeFramesInstrumentation) === null || _a === void 0 ? void 0 : _a.onTransactionStart(transaction);
            (_b = this.stallTrackingInstrumentation) === null || _b === void 0 ? void 0 : _b.onTransactionStart(transaction);
        }
    }
    /**
     * To be called on a transaction finish. Cannot have async methods.
     */
    onTransactionFinish(transaction, endTimestamp) {
        var _a, _b;
        (_a = this.nativeFramesInstrumentation) === null || _a === void 0 ? void 0 : _a.onTransactionFinish(transaction);
        (_b = this.stallTrackingInstrumentation) === null || _b === void 0 ? void 0 : _b.onTransactionFinish(transaction, endTimestamp);
    }
    /**
     * Called by the ReactNativeProfiler component on first component mount.
     */
    onAppStartFinish(endTimestamp) {
        this._appStartFinishTimestamp = endTimestamp;
    }
    /**
     * Instruments the app start measurements on the first route transaction.
     * Starts a route transaction if there isn't routing instrumentation.
     */
    _instrumentAppStart() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.enableAppStartTracking || !NATIVE.enableNative) {
                return;
            }
            const appStart = yield NATIVE.fetchNativeAppStart();
            if (!appStart || appStart.didFetchAppStart) {
                return;
            }
            if (!this.useAppStartWithProfiler) {
                this._appStartFinishTimestamp = getTimeOriginMilliseconds() / 1000;
            }
            if (this.options.routingInstrumentation) {
                this._awaitingAppStartData = appStart;
            }
            else {
                const appStartTimeSeconds = appStart.appStartTime / 1000;
                const idleTransaction = this._createRouteTransaction({
                    name: 'App Start',
                    op: 'ui.load',
                    startTimestamp: appStartTimeSeconds,
                });
                if (idleTransaction) {
                    this._addAppStartData(idleTransaction, appStart);
                }
            }
        });
    }
    /**
     * Adds app start measurements and starts a child span on a transaction.
     */
    _addAppStartData(transaction, appStart) {
        if (!this._appStartFinishTimestamp) {
            logger.warn('App start was never finished.');
            return;
        }
        const appStartTimeSeconds = appStart.appStartTime / 1000;
        transaction.startChild({
            description: appStart.isColdStart ? 'Cold App Start' : 'Warm App Start',
            op: appStart.isColdStart ? 'app.start.cold' : 'app.start.warm',
            startTimestamp: appStartTimeSeconds,
            endTimestamp: this._appStartFinishTimestamp,
        });
        const appStartDurationMilliseconds = this._appStartFinishTimestamp * 1000 - appStart.appStartTime;
        transaction.setMeasurements(appStart.isColdStart
            ? {
                app_start_cold: {
                    value: appStartDurationMilliseconds,
                },
            }
            : {
                app_start_warm: {
                    value: appStartDurationMilliseconds,
                },
            });
    }
    /** To be called when the route changes, but BEFORE the components of the new route mount. */
    _onRouteWillChange(context) {
        return this._createRouteTransaction(context);
    }
    /**
     * Creates a breadcrumb and sets the current route as a tag.
     */
    _onConfirmRoute(context) {
        var _a;
        (_a = this._getCurrentHub) === null || _a === void 0 ? void 0 : _a.call(this).configureScope((scope) => {
            var _a;
            if (context.data) {
                const contextData = context.data;
                scope.addBreadcrumb({
                    category: 'navigation',
                    type: 'navigation',
                    // We assume that context.name is the name of the route.
                    message: `Navigation to ${context.name}`,
                    data: {
                        from: (_a = contextData.previousRoute) === null || _a === void 0 ? void 0 : _a.name,
                        to: contextData.route.name,
                    },
                });
            }
            scope.setTag('routing.route.name', context.name);
        });
    }
    /** Create routing idle transaction. */
    _createRouteTransaction(context) {
        if (!this._getCurrentHub) {
            logger.warn(`[ReactNativeTracing] Did not create ${context.op} transaction because _getCurrentHub is invalid.`);
            return undefined;
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { idleTimeout, maxTransactionDuration } = this.options;
        const expandedContext = Object.assign(Object.assign({}, context), { trimEnd: true });
        const hub = this._getCurrentHub();
        const idleTransaction = startIdleTransaction(hub, expandedContext, idleTimeout, true);
        this.onTransactionStart(idleTransaction);
        logger.log(`[ReactNativeTracing] Starting ${context.op} transaction "${context.name}" on scope`);
        idleTransaction.registerBeforeFinishCallback((transaction, endTimestamp) => {
            this.onTransactionFinish(transaction, endTimestamp);
        });
        idleTransaction.registerBeforeFinishCallback((transaction) => {
            if (this.options.enableAppStartTracking && this._awaitingAppStartData) {
                transaction.startTimestamp =
                    this._awaitingAppStartData.appStartTime / 1000;
                transaction.op = 'ui.load';
                this._addAppStartData(transaction, this._awaitingAppStartData);
                this._awaitingAppStartData = undefined;
            }
        });
        idleTransaction.registerBeforeFinishCallback((transaction, endTimestamp) => {
            adjustTransactionDuration(maxTransactionDuration, transaction, endTimestamp);
        });
        if (this.options.ignoreEmptyBackNavigationTransactions) {
            idleTransaction.registerBeforeFinishCallback((transaction) => {
                var _a, _b;
                if (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                ((_b = (_a = transaction.data) === null || _a === void 0 ? void 0 : _a.route) === null || _b === void 0 ? void 0 : _b.hasBeenSeen) &&
                    (!transaction.spanRecorder ||
                        transaction.spanRecorder.spans.filter((span) => span.spanId !== transaction.spanId).length === 0)) {
                    logger.log('[ReactNativeTracing] Not sampling transaction as route has been seen before. Pass ignoreEmptyBackNavigationTransactions = false to disable this feature.');
                    // Route has been seen before and has no child spans.
                    transaction.sampled = false;
                }
            });
        }
        return idleTransaction;
    }
}
/**
 * @inheritDoc
 */
ReactNativeTracing.id = 'ReactNativeTracing';
//# sourceMappingURL=reactnativetracing.js.map