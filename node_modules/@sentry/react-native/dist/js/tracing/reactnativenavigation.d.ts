import { EmitterSubscription } from 'react-native';
import { InternalRoutingInstrumentation, OnConfirmRoute, TransactionCreator } from './routingInstrumentation';
import { BeforeNavigate } from './types';
interface ReactNativeNavigationOptions {
    routeChangeTimeoutMs: number;
}
interface ComponentEvent {
    componentId: string;
}
declare type ComponentType = 'Component' | 'TopBarTitle' | 'TopBarBackground' | 'TopBarButton';
export interface ComponentWillAppearEvent extends ComponentEvent {
    componentName: string;
    passProps?: Record<string | number | symbol, unknown>;
    componentType: ComponentType;
}
export interface EventSubscription {
    remove(): void;
}
export interface EventsRegistry {
    registerComponentWillAppearListener(callback: (event: ComponentWillAppearEvent) => void): EmitterSubscription;
    registerCommandListener(callback: (name: string, params: unknown) => void): EventSubscription;
}
export interface NavigationDelegate {
    events: () => EventsRegistry;
}
/**
 * Instrumentation for React Native Navigation. See docs or sample app for usage.
 *
 * How this works:
 * - `_onCommand` is called every time a commands happens and sets an IdleTransaction on the scope without any route context.
 * - `_onComponentWillAppear` is then called AFTER the state change happens due to a dispatch and sets the route context onto the active transaction.
 * - If `_onComponentWillAppear` isn't called within `options.routeChangeTimeoutMs` of the dispatch, then the transaction is not sampled and finished.
 */
export declare class ReactNativeNavigationInstrumentation extends InternalRoutingInstrumentation {
    static instrumentationName: string;
    private _navigation;
    private _options;
    private _prevComponentEvent;
    private _latestTransaction?;
    private _recentComponentIds;
    private _stateChangeTimeout?;
    constructor(
    /** The react native navigation `NavigationDelegate`. This is usually the import named `Navigation`. */
    navigation: unknown, options?: Partial<ReactNativeNavigationOptions>);
    /**
     * Registers the event listeners for React Native Navigation
     */
    registerRoutingInstrumentation(listener: TransactionCreator, beforeNavigate: BeforeNavigate, onConfirmRoute: OnConfirmRoute): void;
    /**
     * To be called when a navigation command is dispatched
     */
    private _onCommand;
    /**
     * To be called AFTER the state has been changed to populate the transaction with the current route.
     */
    private _onComponentWillAppear;
    /** Cancels the latest transaction so it does not get sent to Sentry. */
    private _discardLatestTransaction;
    /** Cancels the latest transaction so it does not get sent to Sentry. */
    private _clearStateChangeTimeout;
}
export {};
//# sourceMappingURL=reactnativenavigation.d.ts.map