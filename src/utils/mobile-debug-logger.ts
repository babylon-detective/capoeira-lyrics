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

export class MobileDebugLogger {
  private isEnabled: boolean = false;
  private debugOverlay: HTMLElement | null = null;
  private logContainer: HTMLElement | null = null;
  private isIOS: boolean = false;
  private debugInterval: number | null = null;

  constructor() {
    this.detectMobilePlatform();
    this.setupDebugConsole();
  }

  public enable(): void {
    this.isEnabled = true;
    this.createDebugOverlay();
    this.startContinuousLogging();
    console.log('🔍 Mobile Debug Logger enabled');
  }

  public disable(): void {
    this.isEnabled = false;
    this.removeDebugOverlay();
    this.stopContinuousLogging();
    console.log('🔍 Mobile Debug Logger disabled');
  }

  public toggle(): void {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  private detectMobilePlatform(): void {
    const userAgent = navigator.userAgent;
    this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    
    console.log('📱 Platform detected:', {
      isIOS: this.isIOS,
      userAgent: userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      }
    });
  }

  private setupDebugConsole(): void {
    // Add global debug functions for easy access in Safari Web Inspector
    (window as any).debugMobile = {
      enable: () => this.enable(),
      disable: () => this.disable(),
      toggle: () => this.toggle(),
      analyze: () => this.analyzeLayering(),
      highlightElement: (selector: string) => this.highlightElement(selector),
      logElementInfo: (selector: string) => this.logElementInfo(selector),
      testSticky: () => this.testStickyBehavior(),
      fixLayering: () => this.attemptLayerFix(),
      enableVisualDebug: () => this.enableVisualDebugMode(),
      disableVisualDebug: () => this.disableVisualDebugMode(),
      logScrollState: () => this.logScrollState(),
      fixContainerLayering: () => this.fixContainerLayering(),
      fixStickyHeaderVisibility: () => this.fixStickyHeaderVisibility(),
      testDataLoading: () => this.testDataLoading(),
      testAuthorSelection: () => this.testAuthorSelection()
    };

    console.log('🔧 Debug functions available:', Object.keys((window as any).debugMobile));
    console.log('💡 Usage: debugMobile.enable() or debugMobile.analyze()');
    console.log('🎨 Visual debugging: debugMobile.enableVisualDebug()');
  }

  public analyzeLayering(): LayerAnalysis {
    const targetSelectors = [
      '.container',
      '.sticky-header',
      '.track-heading', 
      '.columns-container',
      '.lyrics-column',
      '.translation-column',
      '.content-container',
      '.song-selector',
      '.language-selector'
    ];

    const elements: DebugElementInfo[] = [];
    const layerConflicts: string[] = [];
    const recommendations: string[] = [];

    targetSelectors.forEach(selector => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const info = this.getElementInfo(selector, element);
        elements.push(info);
      }
    });

    // Analyze for conflicts
    this.findLayerConflicts(elements, layerConflicts);
    this.generateRecommendations(elements, recommendations);

    const analysis: LayerAnalysis = {
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        userAgent: navigator.userAgent
      },
      elements,
      layerConflicts,
      recommendations
    };

    console.log('🔍 Layer Analysis:', analysis);
    this.updateDebugOverlay(analysis);
    
    return analysis;
  }

  private getElementInfo(selector: string, element: HTMLElement): DebugElementInfo {
    const boundingRect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    return {
      selector,
      element,
      boundingRect,
      computedStyle,
      zIndex: computedStyle.zIndex,
      position: computedStyle.position,
      transform: computedStyle.transform,
      visibility: computedStyle.visibility,
      display: computedStyle.display,
      opacity: computedStyle.opacity,
      overflow: computedStyle.overflow,
      backgroundColor: computedStyle.backgroundColor,
      width: computedStyle.width,
      height: computedStyle.height,
      top: computedStyle.top,
      left: computedStyle.left,
      right: computedStyle.right,
      bottom: computedStyle.bottom
    };
  }

  private findLayerConflicts(elements: DebugElementInfo[], conflicts: string[]): void {
    // Check for z-index conflicts
    const zIndexElements = elements.filter(el => el.zIndex !== 'auto' && el.zIndex !== '0');
    
    if (zIndexElements.length > 1) {
      const sorted = zIndexElements.sort((a, b) => parseInt(a.zIndex) - parseInt(b.zIndex));
      conflicts.push(`Z-index layers: ${sorted.map(el => `${el.selector}(${el.zIndex})`).join(' < ')}`);
    }

    // Check for positioning conflicts
    const fixedElements = elements.filter(el => el.position === 'fixed');
    const stickyElements = elements.filter(el => el.position === 'sticky' || el.position === '-webkit-sticky');
    
    if (fixedElements.length > 1) {
      conflicts.push(`Multiple fixed elements: ${fixedElements.map(el => el.selector).join(', ')}`);
    }

    // Check for overlapping elements
    elements.forEach((el1, i) => {
      elements.slice(i + 1).forEach(el2 => {
        if (this.elementsOverlap(el1.boundingRect, el2.boundingRect)) {
          conflicts.push(`Overlapping: ${el1.selector} and ${el2.selector}`);
        }
      });
    });
  }

  private elementsOverlap(rect1: DOMRect, rect2: DOMRect): boolean {
    return !(rect1.right < rect2.left || 
             rect2.right < rect1.left || 
             rect1.bottom < rect2.top || 
             rect2.bottom < rect1.top);
  }

  private generateRecommendations(elements: DebugElementInfo[], recommendations: string[]): void {
    // iOS Safari specific recommendations
    if (this.isIOS) {
      const stickyElements = elements.filter(el => 
        el.position === 'sticky' || el.position === '-webkit-sticky'
      );
      
      if (stickyElements.length > 0) {
        recommendations.push('iOS Safari: Use -webkit-transform: translate3d(0,0,0) for sticky elements');
        recommendations.push('iOS Safari: Add -webkit-backface-visibility: hidden');
      }
    }

    // Check for missing hardware acceleration
    elements.forEach(el => {
      if ((el.position === 'fixed' || el.position === 'sticky') && 
          !el.transform.includes('translate3d')) {
        recommendations.push(`Add hardware acceleration to ${el.selector}`);
      }
    });

    // Check for z-index gaps
    const zIndexValues = elements
      .map(el => parseInt(el.zIndex))
      .filter(z => !isNaN(z))
      .sort((a, b) => a - b);
    
    if (zIndexValues.length > 1) {
      for (let i = 1; i < zIndexValues.length; i++) {
        if (zIndexValues[i] - zIndexValues[i-1] > 100) {
          recommendations.push('Consider reducing z-index gaps for better layer management');
          break;
        }
      }
    }
  }

  public highlightElement(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return;
    }

    // Create highlight overlay
    const highlight = document.createElement('div');
    highlight.style.cssText = `
      position: fixed;
      top: ${element.offsetTop}px;
      left: ${element.offsetLeft}px;
      width: ${element.offsetWidth}px;
      height: ${element.offsetHeight}px;
      background: rgba(255, 0, 0, 0.3);
      border: 2px solid red;
      z-index: 9999;
      pointer-events: none;
      animation: debugPulse 1s infinite;
    `;

    document.body.appendChild(highlight);

    // Add pulsing animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes debugPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);

    // Remove after 3 seconds
    setTimeout(() => {
      highlight.remove();
      style.remove();
    }, 3000);

    console.log(`🎯 Highlighted: ${selector}`, this.getElementInfo(selector, element));
  }

  public logElementInfo(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      return;
    }

    const info = this.getElementInfo(selector, element);
    console.log(`📊 Element Info: ${selector}`, info);
  }

  public testStickyBehavior(): void {
    console.log('🧪 Testing sticky behavior...');
    
    const stickyElements = document.querySelectorAll('.sticky-header, .track-heading');
    stickyElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const style = window.getComputedStyle(htmlElement);
      
      console.log(`Sticky Element ${index + 1}:`, {
        selector: htmlElement.className,
        position: style.position,
        top: style.top,
        zIndex: style.zIndex,
        transform: style.transform,
        boundingRect: rect,
        isSticky: style.position.includes('sticky'),
        isFixed: style.position === 'fixed'
      });
    });
  }

  public attemptLayerFix(): void {
    console.log('🔧 Attempting layer fix...');
    
    // Fix common iOS Safari issues
    const stickyHeaders = document.querySelectorAll('.sticky-header');
    stickyHeaders.forEach(header => {
      const element = header as HTMLElement;
      element.style.webkitTransform = 'translate3d(0,0,0)';
      element.style.transform = 'translate3d(0,0,0)';
      element.style.webkitBackfaceVisibility = 'hidden';
      element.style.backfaceVisibility = 'hidden';
      element.style.willChange = 'transform';
      element.style.zIndex = '9999';
    });

    // Fix container layering - remove transforms that create stacking contexts
    const container = document.querySelector('.container') as HTMLElement;
    if (container) {
      container.style.webkitTransform = 'none';
      container.style.transform = 'none';
      container.style.zIndex = 'auto';
      container.style.position = 'static';
    }

    console.log('✅ Layer fix applied');
    
    // Re-analyze after fix
    setTimeout(() => this.analyzeLayering(), 100);
  }

  public fixContainerLayering(): void {
    console.log('🔧 Fixing container layering specifically...');
    
    const container = document.querySelector('.container') as HTMLElement;
    const stickyHeaders = document.querySelectorAll('.sticky-header');
    
    if (container) {
      const beforeStyle = window.getComputedStyle(container);
      console.log('Container before fix:', {
        position: beforeStyle.position,
        zIndex: beforeStyle.zIndex,
        transform: beforeStyle.transform
      });
      
      // Remove any transforms or z-index that might create stacking contexts
      container.style.position = 'static';
      container.style.zIndex = 'auto';
      container.style.webkitTransform = 'none';
      container.style.transform = 'none';
      
      const afterStyle = window.getComputedStyle(container);
      console.log('Container after fix:', {
        position: afterStyle.position,
        zIndex: afterStyle.zIndex,
        transform: afterStyle.transform
      });
    }
    
    // Ensure sticky headers have maximum z-index
    stickyHeaders.forEach((header, index) => {
      const element = header as HTMLElement;
      const beforeStyle = window.getComputedStyle(element);
      
      element.style.zIndex = '9999';
      element.style.position = 'fixed';
      
      const afterStyle = window.getComputedStyle(element);
      console.log(`Sticky header ${index + 1} fix:`, {
        before: { zIndex: beforeStyle.zIndex, position: beforeStyle.position },
        after: { zIndex: afterStyle.zIndex, position: afterStyle.position }
      });
    });
    
    console.log('✅ Container layering fix applied');
    
    // Re-analyze after fix
    setTimeout(() => this.analyzeLayering(), 100);
  }

  public enableVisualDebugMode(): void {
    document.body.classList.add('debug-mode');
    console.log('🎨 Visual debug mode enabled - elements now have colored borders');
  }

  public disableVisualDebugMode(): void {
    document.body.classList.remove('debug-mode');
    console.log('🎨 Visual debug mode disabled');
  }

  public logScrollState(): void {
    const columnsContainer = document.querySelector('.columns-container') as HTMLElement;
    const lyricsColumn = document.querySelector('.lyrics-column') as HTMLElement;
    const translationColumn = document.querySelector('.translation-column') as HTMLElement;
    
    if (!columnsContainer || !lyricsColumn || !translationColumn) {
      console.warn('Required elements not found for scroll state logging');
      return;
    }

    const containerRect = columnsContainer.getBoundingClientRect();
    const lyricsRect = lyricsColumn.getBoundingClientRect();
    const translationRect = translationColumn.getBoundingClientRect();

    console.log('📊 Current scroll state:', {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      },
      columnsContainer: {
        rect: containerRect,
        scrollLeft: columnsContainer.scrollLeft,
        scrollTop: columnsContainer.scrollTop,
        scrollWidth: columnsContainer.scrollWidth,
        scrollHeight: columnsContainer.scrollHeight
      },
      lyricsColumn: {
        rect: lyricsRect,
        classes: lyricsColumn.className,
        isActive: lyricsColumn.classList.contains('active')
      },
      translationColumn: {
        rect: translationRect,
        classes: translationColumn.className,
        isActive: translationColumn.classList.contains('active')
      },
      stickyHeaders: Array.from(document.querySelectorAll('.sticky-header')).map((header, index) => {
        const element = header as HTMLElement;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return {
          index,
          rect,
          display: style.display,
          visibility: style.visibility,
          position: style.position,
          zIndex: style.zIndex,
          transform: style.transform
        };
      })
    });
  }

  public fixStickyHeaderVisibility(): void {
    console.log('🔧 Fixing sticky header visibility...');
    
    const stickyHeaders = document.querySelectorAll('.sticky-header');
    const lyricsColumn = document.querySelector('.lyrics-column') as HTMLElement;
    const translationColumn = document.querySelector('.translation-column') as HTMLElement;
    
    console.log('Found sticky headers:', stickyHeaders.length);
    console.log('Lyrics column classes:', lyricsColumn?.className);
    console.log('Translation column classes:', translationColumn?.className);
    
    stickyHeaders.forEach((header, index) => {
      const element = header as HTMLElement;
      const beforeStyle = window.getComputedStyle(element);
      const parentColumn = element.closest('.lyrics-column, .translation-column');
      
      console.log(`Sticky header ${index + 1} before fix:`, {
        element: element.outerHTML,
        parentColumn: parentColumn?.className,
        display: beforeStyle.display,
        visibility: beforeStyle.visibility,
        position: beforeStyle.position,
        zIndex: beforeStyle.zIndex,
        opacity: beforeStyle.opacity,
        rect: element.getBoundingClientRect()
      });
      
      // Force visibility for mobile
      if (window.innerWidth <= 768) {
        element.style.display = 'flex';
        element.style.visibility = 'visible';
        element.style.opacity = '1';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.zIndex = '9999';
        
        // If it's in the lyrics column, ensure it's visible
        if (parentColumn?.classList.contains('lyrics-column')) {
          element.style.display = 'flex';
        }
      }
      
      const afterStyle = window.getComputedStyle(element);
      console.log(`Sticky header ${index + 1} after fix:`, {
        display: afterStyle.display,
        visibility: afterStyle.visibility,
        position: afterStyle.position,
        zIndex: afterStyle.zIndex,
        opacity: afterStyle.opacity,
        rect: element.getBoundingClientRect()
      });
    });
    
    // Also ensure the lyrics column is active by default
    if (lyricsColumn && !lyricsColumn.classList.contains('active')) {
      lyricsColumn.classList.add('active');
      console.log('✅ Set lyrics column as active');
    }
    
    console.log('✅ Sticky header visibility fix applied');
  }

  public testDataLoading(): void {
    console.log('🧪 Testing data loading...');
    
    // Test authors index loading
    fetch('/authors-index.json')
      .then(response => response.json())
      .then(data => {
        console.log('📊 Authors index loaded:', data);
        
        // Test loading first author's data
        if (data.authors && data.authors.length > 0) {
          const firstAuthor = data.authors[0];
          console.log('📊 Testing loading for author:', firstAuthor);
          
          return fetch(`/authors/${firstAuthor.file}`);
        }
      })
      .then(response => {
        if (response) {
          return response.json();
        }
        throw new Error('No response received');
      })
      .then(data => {
        console.log('📊 Author data loaded:', {
          songsCount: data.songs?.length || 0,
          firstSong: data.songs?.[0] || null,
          authors: data.songs ? [...new Set(data.songs.map((s: any) => s.author))] : []
        });
      })
      .catch(error => {
        console.error('❌ Error testing data loading:', error);
      });
  }

  public testAuthorSelection(): void {
    console.log('🧪 Testing author selection...');
    
    // Find the author selector
    const authorSelector = document.querySelector('#songSelect-default, #songSelect-main') as HTMLSelectElement;
    if (!authorSelector) {
      console.error('❌ No author selector found');
      return;
    }
    
    console.log('🔍 Found author selector:', authorSelector);
    console.log('🔍 Available options:', Array.from(authorSelector.options).map(opt => opt.value));
    
    // Try to select the first available author
    const availableOptions = Array.from(authorSelector.options).filter(opt => opt.value && opt.value !== '');
    if (availableOptions.length > 0) {
      const firstAuthor = availableOptions[0].value;
      console.log('🔍 Selecting first author:', firstAuthor);
      
      authorSelector.value = firstAuthor;
      authorSelector.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('🔍 Change event dispatched');
    } else {
      console.error('❌ No available authors found in selector');
    }
  }

  private createDebugOverlay(): void {
    if (this.debugOverlay) return;

    this.debugOverlay = document.createElement('div');
    this.debugOverlay.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      max-height: 400px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 5px;
      z-index: 10000;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    `;

    this.logContainer = document.createElement('div');
    this.debugOverlay.appendChild(this.logContainer);

    // Add control buttons
    const controls = document.createElement('div');
    controls.style.cssText = 'margin-bottom: 10px; text-align: center;';
    
    const analyzeBtn = document.createElement('button');
    analyzeBtn.textContent = 'Analyze';
    analyzeBtn.onclick = () => this.analyzeLayering();
    analyzeBtn.style.cssText = 'margin: 0 5px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px;';
    
    const fixBtn = document.createElement('button');
    fixBtn.textContent = 'Fix';
    fixBtn.onclick = () => this.attemptLayerFix();
    fixBtn.style.cssText = 'margin: 0 5px; padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 3px;';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => this.disable();
    closeBtn.style.cssText = 'margin: 0 5px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px;';

    controls.appendChild(analyzeBtn);
    controls.appendChild(fixBtn);
    controls.appendChild(closeBtn);
    
    this.debugOverlay.insertBefore(controls, this.logContainer);
    document.body.appendChild(this.debugOverlay);
  }

  private updateDebugOverlay(analysis: LayerAnalysis): void {
    if (!this.logContainer) return;

    const html = `
      <div style="border-bottom: 1px solid #666; padding-bottom: 10px; margin-bottom: 10px;">
        <strong>📱 ${analysis.viewport.width}x${analysis.viewport.height} (${analysis.viewport.devicePixelRatio}x)</strong>
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>⚠️ Conflicts (${analysis.layerConflicts.length}):</strong>
        ${analysis.layerConflicts.map(conflict => `<div style="color: #ff6b6b;">• ${conflict}</div>`).join('')}
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong>💡 Recommendations (${analysis.recommendations.length}):</strong>
        ${analysis.recommendations.map(rec => `<div style="color: #51cf66;">• ${rec}</div>`).join('')}
      </div>
      
      <div>
        <strong>🔍 Elements:</strong>
        ${analysis.elements.map(el => `
          <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
            <strong>${el.selector}</strong><br>
            z-index: ${el.zIndex}, position: ${el.position}<br>
            ${el.boundingRect.width.toFixed(0)}x${el.boundingRect.height.toFixed(0)} at (${el.boundingRect.left.toFixed(0)}, ${el.boundingRect.top.toFixed(0)})
          </div>
        `).join('')}
      </div>
    `;

    this.logContainer.innerHTML = html;
  }

  private removeDebugOverlay(): void {
    if (this.debugOverlay) {
      this.debugOverlay.remove();
      this.debugOverlay = null;
      this.logContainer = null;
    }
  }

  private startContinuousLogging(): void {
    if (this.debugInterval) return;
    
    this.debugInterval = window.setInterval(() => {
      if (this.isEnabled) {
        this.analyzeLayering();
      }
    }, 2000); // Analyze every 2 seconds
  }

  private stopContinuousLogging(): void {
    if (this.debugInterval) {
      clearInterval(this.debugInterval);
      this.debugInterval = null;
    }
  }

  public destroy(): void {
    this.disable();
    delete (window as any).debugMobile;
  }
} 