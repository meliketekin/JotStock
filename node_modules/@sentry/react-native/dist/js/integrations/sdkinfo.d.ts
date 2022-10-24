import { EventProcessor, Integration } from '@sentry/types';
/** Default SdkInfo instrumentation */
export declare class SdkInfo implements Integration {
    /**
     * @inheritDoc
     */
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    private _nativeSdkInfo;
    /**
     * @inheritDoc
     */
    setupOnce(addGlobalEventProcessor: (e: EventProcessor) => void): void;
}
//# sourceMappingURL=sdkinfo.d.ts.map