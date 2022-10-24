import { addBreadcrumb } from '@sentry/core';
import { Severity } from '@sentry/types';
import { logger } from '@sentry/utils';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
const touchEventStyles = StyleSheet.create({
    wrapperView: {
        flex: 1,
    },
});
const DEFAULT_BREADCRUMB_CATEGORY = 'touch';
const DEFAULT_BREADCRUMB_TYPE = 'user';
const DEFAULT_MAX_COMPONENT_TREE_SIZE = 20;
const PROP_KEY = 'sentry-label';
/**
 * Boundary to log breadcrumbs for interaction events.
 */
class TouchEventBoundary extends React.Component {
    /**
     *
     */
    render() {
        return (<View style={touchEventStyles.wrapperView} 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onTouchStart={this._onTouchStart.bind(this)}>
        {this.props.children}
      </View>);
    }
    /**
     * Logs the touch event given the component tree names and a label.
     */
    _logTouchEvent(componentTreeNames, activeLabel) {
        const crumb = {
            category: this.props.breadcrumbCategory,
            data: { componentTree: componentTreeNames },
            level: Severity.Info,
            message: activeLabel
                ? `Touch event within element: ${activeLabel}`
                : 'Touch event within component tree',
            type: this.props.breadcrumbType,
        };
        addBreadcrumb(crumb);
        logger.log(`[TouchEvents] ${crumb.message}`);
    }
    /**
     * Checks if the name is supposed to be ignored.
     */
    _isNameIgnored(name) {
        let ignoreNames = this.props.ignoreNames || [];
        // eslint-disable-next-line deprecation/deprecation
        if (this.props.ignoredDisplayNames) {
            // This is to make it compatible with prior version.
            // eslint-disable-next-line deprecation/deprecation
            ignoreNames = [...ignoreNames, ...this.props.ignoredDisplayNames];
        }
        return ignoreNames.some((ignoreName) => (typeof ignoreName === 'string' && name === ignoreName) ||
            (ignoreName instanceof RegExp && name.match(ignoreName)));
    }
    // Originally was going to clean the names of any HOCs as well but decided that it might hinder debugging effectively. Will leave here in case
    // private readonly _cleanName = (name: string): string =>
    //   name.replace(/.*\(/g, "").replace(/\)/g, "");
    /**
     * Traverses through the component tree when a touch happens and logs it.
     * @param e
     */
    // eslint-disable-next-line complexity
    _onTouchStart(e) {
        var _a;
        if (e._targetInst) {
            let currentInst = e._targetInst;
            let activeLabel;
            let activeDisplayName;
            const componentTreeNames = [];
            while (currentInst &&
                // maxComponentTreeSize will always be defined as we have a defaultProps. But ts needs a check so this is here.
                this.props.maxComponentTreeSize &&
                componentTreeNames.length < this.props.maxComponentTreeSize) {
                if (
                // If the loop gets to the boundary itself, break.
                ((_a = currentInst.elementType) === null || _a === void 0 ? void 0 : _a.displayName) ===
                    TouchEventBoundary.displayName) {
                    break;
                }
                const props = currentInst.memoizedProps;
                const label = typeof (props === null || props === void 0 ? void 0 : props[PROP_KEY]) !== 'undefined'
                    ? `${props[PROP_KEY]}`
                    : undefined;
                // Check the label first
                if (label && !this._isNameIgnored(label)) {
                    if (!activeLabel) {
                        activeLabel = label;
                    }
                    componentTreeNames.push(label);
                }
                else if (typeof (props === null || props === void 0 ? void 0 : props.accessibilityLabel) === 'string' &&
                    !this._isNameIgnored(props.accessibilityLabel)) {
                    if (!activeLabel) {
                        activeLabel = props.accessibilityLabel;
                    }
                    componentTreeNames.push(props.accessibilityLabel);
                }
                else if (currentInst.elementType) {
                    const { elementType } = currentInst;
                    if (elementType.displayName &&
                        !this._isNameIgnored(elementType.displayName)) {
                        // Check display name
                        if (!activeDisplayName) {
                            activeDisplayName = elementType.displayName;
                        }
                        componentTreeNames.push(elementType.displayName);
                    }
                }
                currentInst = currentInst.return;
            }
            const finalLabel = activeLabel !== null && activeLabel !== void 0 ? activeLabel : activeDisplayName;
            if (componentTreeNames.length > 0 || finalLabel) {
                this._logTouchEvent(componentTreeNames, finalLabel);
            }
        }
    }
}
TouchEventBoundary.displayName = '__Sentry.TouchEventBoundary';
TouchEventBoundary.defaultProps = {
    breadcrumbCategory: DEFAULT_BREADCRUMB_CATEGORY,
    breadcrumbType: DEFAULT_BREADCRUMB_TYPE,
    ignoreNames: [],
    maxComponentTreeSize: DEFAULT_MAX_COMPONENT_TREE_SIZE,
};
/**
 * Convenience Higher-Order-Component for TouchEventBoundary
 * @param WrappedComponent any React Component
 * @param boundaryProps TouchEventBoundaryProps
 */
const withTouchEventBoundary = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
InnerComponent, boundaryProps) => {
    const WrappedComponent = (props) => (<TouchEventBoundary {...(boundaryProps !== null && boundaryProps !== void 0 ? boundaryProps : {})}>
      <InnerComponent {...props}/>
    </TouchEventBoundary>);
    WrappedComponent.displayName = 'WithTouchEventBoundary';
    return WrappedComponent;
};
export { TouchEventBoundary, withTouchEventBoundary };
//# sourceMappingURL=touchevents.js.map