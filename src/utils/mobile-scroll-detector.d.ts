export declare class MobileScrollDetector {
    private columnsContainer;
    private lyricsColumn;
    private translationColumn;
    private currentActiveColumn;
    private debugMode;
    constructor();
    private fixMobileViewport;
    private initializeScrollDetection;
    private handleScroll;
    private calculateVisibility;
    private setActiveColumn;
    private handleResponsiveChange;
    getCurrentActiveColumn(): 'lyrics' | 'translation';
    enableDebugMode(): void;
    disableDebugMode(): void;
    logCurrentState(): void;
    destroy(): void;
}
//# sourceMappingURL=mobile-scroll-detector.d.ts.map