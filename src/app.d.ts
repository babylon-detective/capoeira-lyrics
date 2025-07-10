import { MobileScrollDetector } from './utils/mobile-scroll-detector';
import { MobileDebugLogger } from './utils/mobile-debug-logger';
export declare class LyricsApp {
    private lyricsService;
    private renderer;
    private uiManager;
    private scrollTracker;
    private mobileScrollDetector;
    private mobileDebugLogger;
    constructor();
    initialize(): Promise<void>;
    private showError;
    getDebugLogger(): MobileDebugLogger | null;
    getMobileScrollDetector(): MobileScrollDetector | null;
    enableDebugMode(): void;
    disableDebugMode(): void;
}
//# sourceMappingURL=app.d.ts.map