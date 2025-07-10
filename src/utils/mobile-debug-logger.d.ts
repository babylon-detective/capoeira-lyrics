export interface DebugElementInfo {
    selector: string;
    element: HTMLElement;
    boundingRect: DOMRect;
    computedStyle: CSSStyleDeclaration;
    zIndex: string;
    position: string;
    transform: string;
    visibility: string;
    display: string;
    opacity: string;
    overflow: string;
    backgroundColor: string;
    width: string;
    height: string;
    top: string;
    left: string;
    right: string;
    bottom: string;
}
export interface LayerAnalysis {
    timestamp: number;
    viewport: {
        width: number;
        height: number;
        devicePixelRatio: number;
        userAgent: string;
    };
    elements: DebugElementInfo[];
    layerConflicts: string[];
    recommendations: string[];
}
export declare class MobileDebugLogger {
    private isEnabled;
    private debugOverlay;
    private logContainer;
    private isIOS;
    private debugInterval;
    constructor();
    enable(): void;
    disable(): void;
    toggle(): void;
    private detectMobilePlatform;
    private setupDebugConsole;
    analyzeLayering(): LayerAnalysis;
    private getElementInfo;
    private findLayerConflicts;
    private elementsOverlap;
    private generateRecommendations;
    highlightElement(selector: string): void;
    logElementInfo(selector: string): void;
    testStickyBehavior(): void;
    attemptLayerFix(): void;
    fixContainerLayering(): void;
    enableVisualDebugMode(): void;
    disableVisualDebugMode(): void;
    logScrollState(): void;
    fixStickyHeaderVisibility(): void;
    testDataLoading(): void;
    testAuthorSelection(): void;
    private createDebugOverlay;
    private updateDebugOverlay;
    private removeDebugOverlay;
    private startContinuousLogging;
    private stopContinuousLogging;
    destroy(): void;
}
//# sourceMappingURL=mobile-debug-logger.d.ts.map