import { getCurrentHub, getMainCarrier } from '@sentry/hub';
import { ReactNativeTracing } from './tracing';
/**
 * Adds React Native's extensions. Needs to be called after @sentry/tracing's extension methods are added
 */
export function _addTracingExtensions() {
    const carrier = getMainCarrier();
    if (carrier.__SENTRY__) {
        carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
        if (carrier.__SENTRY__.extensions.startTransaction) {
            const originalStartTransaction = carrier.__SENTRY__.extensions
                .startTransaction;
            /*
              Overwrites the transaction start and finish to start and finish stall tracking.
              Preferably instead of overwriting add a callback method for this in the Transaction itself.
            */
            const _startTransaction = _patchStartTransaction(originalStartTransaction);
            carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
        }
    }
}
/**
 * Overwrite the startTransaction extension method to start and end stall tracking.
 */
const _patchStartTransaction = (originalStartTransaction) => {
    /**
     * Method to overwrite with
     */
    function _startTransaction(transactionContext, customSamplingContext) {
        const transaction = originalStartTransaction.apply(this, [
            transactionContext,
            customSamplingContext,
        ]);
        const reactNativeTracing = getCurrentHub().getIntegration(ReactNativeTracing);
        if (reactNativeTracing) {
            reactNativeTracing.onTransactionStart(transaction);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const originalFinish = transaction.finish;
            transaction.finish = (endTimestamp) => {
                if (reactNativeTracing) {
                    reactNativeTracing.onTransactionFinish(transaction);
                }
                return originalFinish.apply(transaction, [endTimestamp]);
            };
        }
        return transaction;
    }
    return _startTransaction;
};
//# sourceMappingURL=measurements.js.map