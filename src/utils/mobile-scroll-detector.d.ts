export declare class MobileScrollDetector {
    private columnsContainer;
    private lyricsColumn;
    private translationColumn;
    private currentActiveColumn;
    constructor();
    private initializeScrollDetection;
    private handleScroll;
    private calculateVisibility;
    private setActiveColumn;
    private handleResponsiveChange;
    getCurrentActiveColumn(): 'lyrics' | 'translation';
    destroy(): void;
}
//# sourceMappingURL=mobile-scroll-detector.d.ts.map