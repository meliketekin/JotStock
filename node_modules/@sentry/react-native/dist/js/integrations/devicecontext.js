import { __awaiter } from "tslib";
import { addGlobalEventProcessor, getCurrentHub } from '@sentry/core';
import { logger } from '@sentry/utils';
import { NATIVE } from '../wrapper';
/** Load device context from native. */
export class DeviceContext {
    constructor() {
        /**
         * @inheritDoc
         */
        this.name = DeviceContext.id;
    }
    /**
     * @inheritDoc
     */
    setupOnce() {
        addGlobalEventProcessor((event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const self = getCurrentHub().getIntegration(DeviceContext);
            if (!self) {
                return event;
            }
            try {
                const contexts = yield NATIVE.fetchNativeDeviceContexts();
                const context = (_a = contexts['context']) !== null && _a !== void 0 ? _a : {};
                const user = (_b = contexts['user']) !== null && _b !== void 0 ? _b : {};
                event.contexts = Object.assign(Object.assign({}, context), event.contexts);
                if (!event.user) {
                    event.user = Object.assign({}, user);
                }
            }
            catch (e) {
                logger.log(`Failed to get device context from native: ${e}`);
            }
            return event;
        }));
    }
}
/**
 * @inheritDoc
 */
DeviceContext.id = 'DeviceContext';
//# sourceMappingURL=devicecontext.js.map