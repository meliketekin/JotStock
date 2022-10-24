import { __awaiter } from "tslib";
import { logger } from '@sentry/utils';
import { SDK_NAME, SDK_VERSION } from '../version';
import { NATIVE } from '../wrapper';
/** Default SdkInfo instrumentation */
export class SdkInfo {
    constructor() {
        /**
         * @inheritDoc
         */
        this.name = SdkInfo.id;
        this._nativeSdkInfo = null;
    }
    /**
     * @inheritDoc
     */
    setupOnce(addGlobalEventProcessor) {
        addGlobalEventProcessor((event) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // The native SDK info package here is only used on iOS as `beforeSend` is not called on `captureEnvelope`.
            // this._nativeSdkInfo should be defined a following time so this call won't always be awaited.
            if (NATIVE.platform === 'ios' && this._nativeSdkInfo === null) {
                try {
                    this._nativeSdkInfo = yield NATIVE.fetchNativeSdkInfo();
                }
                catch (e) {
                    // If this fails, go ahead as usual as we would rather have the event be sent with a package missing.
                    logger.warn('[SdkInfo] Native SDK Info retrieval failed...something could be wrong with your Sentry installation:');
                    logger.warn(e);
                }
            }
            event.platform = event.platform || 'javascript';
            event.sdk = Object.assign(Object.assign({}, ((_a = event.sdk) !== null && _a !== void 0 ? _a : {})), { name: SDK_NAME, packages: [
                    ...((event.sdk && event.sdk.packages) || []),
                    ...((this._nativeSdkInfo && [this._nativeSdkInfo]) || []),
                    {
                        name: 'npm:@sentry/react-native',
                        version: SDK_VERSION,
                    },
                ], version: SDK_VERSION });
            return event;
        }));
    }
}
/**
 * @inheritDoc
 */
SdkInfo.id = 'SdkInfo';
//# sourceMappingURL=sdkinfo.js.map