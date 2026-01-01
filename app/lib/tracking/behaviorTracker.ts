// Behavior Tracking Library - Autonomous Optimization System
// Captures user interactions for friction analysis and AI optimization

interface TrackingConfig {
  beaconEndpoint: string;
  sessionId: string;
  sampleRate?: number;
  debug?: boolean;
}

interface UserEvent {
  eventType: string;
  elementPath?: string;
  elementType?: string;
  elementText?: string;
  coordinates?: { x: number; y: number };
  viewportSize?: { width: number; height: number };
  eventData: Record<string, any>;
  timestamp: number;
  pageUrl: string;
  componentId?: string;
}

class BehaviorTracker {
  private config: TrackingConfig;
  private eventQueue: UserEvent[] = [];
  private sessionStartTime: number;
  private lastHoverTime: number = 0;
  private hoverTimeout: NodeJS.Timeout | null = null;
  private clickTimers: Map<string, number> = new Map();
  private scrollDepth: number = 0;
  private isFlushing: boolean = false;
  private flushInterval: NodeJS.Timeout;

  constructor(config: TrackingConfig) {
    this.config = {
      sampleRate: 1.0,
      debug: false,
      ...config
    };
    this.sessionStartTime = Date.now();
    
    // Initialize tracking
    this.setupEventListeners();
    this.setupPerformanceObserver();
    
    // Flush events every 5 seconds
    this.flushInterval = setInterval(() => this.flushEvents(), 5000);
    
    // Track session start
    this.trackEvent('page_view', {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    
    // Track scroll depth
    this.trackScrollDepth();
  }

  private setupEventListeners(): void {
    // Click tracking with hesitation detection
    document.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      const elementPath = this.getElementPath(target);
      const timerId = `${elementPath}-${Date.now()}`;
      
      this.clickTimers.set(timerId, Date.now());
      
      // Check for rage clicks (multiple clicks within 500ms)
      const recentClicks = Array.from(this.clickTimers.values())
        .filter(time => Date.now() - time < 500);
      
      if (recentClicks.length > 3) {
        this.trackEvent('rage_click', {
          elementPath,
          elementType: target.tagName.toLowerCase(),
          elementText: this.getSafeText(target),
          clickCount: recentClicks.length
        });
        this.clickTimers.clear();
      }
    });

    document.addEventListener('mouseup', (e) => {
      const target = e.target as HTMLElement;
      const elementPath = this.getElementPath(target);
      const timerId = Array.from(this.clickTimers.keys())
        .find(key => key.startsWith(elementPath));
      
      if (timerId) {
        const startTime = this.clickTimers.get(timerId);
        if (startTime) {
          const hesitationMs = Date.now() - startTime;
          
          this.trackEvent('click', {
            elementPath,
            elementType: target.tagName.toLowerCase(),
            elementText: this.getSafeText(target),
            hesitationMs,
            coordinates: { x: e.clientX, y: e.clientY }
          });
          
          // Track hesitation if > 300ms
          if (hesitationMs > 300) {
            this.trackEvent('hesitation', {
              elementPath,
              elementType: target.tagName.toLowerCase(),
              hesitationMs,
              elementText: this.getSafeText(target)
            });
          }
        }
        this.clickTimers.delete(timerId);
      }
    });

    // Hover tracking
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const elementPath = this.getElementPath(target);
      
      this.lastHoverTime = Date.now();
      
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }
      
      this.hoverTimeout = setTimeout(() => {
        const hoverDuration = Date.now() - this.lastHoverTime;
        if (hoverDuration > 1000) { // Only track hovers > 1s
          this.trackEvent('hover', {
            elementPath,
            elementType: target.tagName.toLowerCase(),
            elementText: this.getSafeText(target),
            hoverDuration,
            coordinates: { x: e.clientX, y: e.clientY }
          });
        }
      }, 1000);
    });

    // Form tracking
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        const form = target.closest('form');
        if (form) {
          this.trackEvent('form_start', {
            formId: form.id || this.getElementPath(form),
            fieldName: (target as HTMLInputElement).name || '',
            fieldType: target.tagName.toLowerCase()
          });
        }
      }
    });

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        const form = target.closest('form');
        if (form && !form.contains(document.activeElement)) {
          // Check if form was submitted
          setTimeout(() => {
            if (!form.contains(document.activeElement)) {
              this.trackEvent('form_abandon', {
                formId: form.id || this.getElementPath(form),
                fieldsFilled: this.getFilledFieldCount(form)
              });
            }
          }, 100);
        }
      }
    });

    // Error tracking
    window.addEventListener('error', (e) => {
      this.trackEvent('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error?.toString()
      });
    });

    // Unload tracking
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {
        durationMs: Date.now() - this.sessionStartTime,
        pageCount: this.eventQueue.filter(e => e.eventType === 'page_view').length,
        scrollDepth: this.scrollDepth
      });
      this.flushEvents(true); // Force flush on unload
    });
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Long Task API for frustration detection
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Tasks > 50ms are considered long
            this.trackEvent('long_task', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private trackScrollDepth(): void {
    let lastReportedDepth = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      const currentDepth = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      this.scrollDepth = Math.max(this.scrollDepth, currentDepth);
      
      // Report at 25%, 50%, 75%, 100% intervals
      const reportPoints = [25, 50, 75, 100];
      const nextReport = reportPoints.find(p => p > lastReportedDepth && currentDepth >= p);
      
      if (nextReport) {
        this.trackEvent('scroll_depth', {
          percentage: nextReport,
          scrollTop,
          scrollHeight,
          clientHeight
        });
        lastReportedDepth = nextReport;
      }
    }, { passive: true });
  }

  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current: HTMLElement | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else {
        if (current.className && typeof current.className === 'string') {
          const classes = current.className.split(' ').filter(c => c).join('.');
          if (classes) selector += `.${classes}`;
        }
        
        // Add nth-child if needed
        const parent = current.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children);
          const index = siblings.indexOf(current) + 1;
          if (siblings.length > 1) {
            selector += `:nth-child(${index})`;
          }
        }
        
        path.unshift(selector);
        current = parent;
      }
    }
    
    return path.join(' > ');
  }

  private getSafeText(element: HTMLElement): string {
    try {
      return element.textContent?.trim().substring(0, 100) || '';
    } catch {
      return '';
    }
  }

  private getFilledFieldCount(form: HTMLFormElement): number {
    const inputs = form.querySelectorAll('input, textarea, select');
    let filled = 0;
    
    inputs.forEach(input => {
      if (input instanceof HTMLInputElement || 
          input instanceof HTMLTextAreaElement || 
          input instanceof HTMLSelectElement) {
        if (input.value && input.value.trim()) {
          filled++;
        }
      }
    });
    
    return filled;
  }

  public trackEvent(eventType: string, eventData: Record<string, any> = {}): void {
    // Apply sampling
    if (Math.random() > (this.config.sampleRate || 1.0)) {
      return;
    }

    const event: UserEvent = {
      eventType,
      elementPath: eventData.elementPath,
      elementType: eventData.elementType,
      elementText: eventData.elementText,
      coordinates: eventData.coordinates,
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      eventData,
      timestamp: Date.now(),
      pageUrl: window.location.href,
      componentId: this.extractComponentId()
    };

    this.eventQueue.push(event);

    if (this.config.debug) {
      console.log('[BehaviorTracker] Event tracked:', event);
    }

    // Auto-flush if queue gets too large
    if (this.eventQueue.length >= 50) {
      this.flushEvents();
    }
  }

  private extractComponentId(): string | undefined {
    // Extract component ID from data attributes or class names
    const activeElement = document.activeElement;
    if (activeElement) {
      const componentId = activeElement.getAttribute('data-component-id') ||
                         activeElement.getAttribute('data-testid') ||
                         activeElement.className?.split(' ').find(c => c.includes('Component'));
      return componentId || undefined;
    }
    return undefined;
  }

  public trackConversion(funnelName: string, stepName: string, stepOrder: number): void {
    this.trackEvent('conversion_step', {
      funnelName,
      stepName,
      stepOrder,
      timestamp: Date.now()
    });
  }

  private async flushEvents(force: boolean = false): Promise<void> {
    if (this.isFlushing || (!force && this.eventQueue.length === 0)) {
      return;
    }

    this.isFlushing = true;
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(this.config.beaconEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.config.sessionId,
          events: eventsToSend,
          metadata: {
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            pageLoadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0
          }
        }),
        keepalive: true // Ensure request completes even if page unloads
      });

      if (!response.ok) {
        throw new Error(`Beacon failed: ${response.status}`);
      }

      if (this.config.debug) {
        console.log(`[BehaviorTracker] Flushed ${eventsToSend.length} events`);
      }
    } catch (error) {
      // Requeue events on failure
      this.eventQueue.unshift(...eventsToSend);
      
      if (this.config.debug) {
        console.error('[BehaviorTracker] Flush failed:', error);
      }
    } finally {
      this.isFlushing = false;
    }
  }

  public destroy(): void {
    clearInterval(this.flushInterval);
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.flushEvents(true);
  }
}

// Session management
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export singleton instance
let trackerInstance: BehaviorTracker | null = null;

export function initBehaviorTracker(config: Omit<TrackingConfig, 'sessionId'>): BehaviorTracker {
  if (trackerInstance) {
    return trackerInstance;
  }

  const sessionId = generateSessionId();
  trackerInstance = new BehaviorTracker({
    ...config,
    sessionId
  });

  return trackerInstance;
}

export function getTracker(): BehaviorTracker | null {
  return trackerInstance;
}

export function trackEvent(eventType: string, eventData: Record<string, any> = {}): void {
  trackerInstance?.trackEvent(eventType, eventData);
}

export function trackConversion(funnelName: string, stepName: string, stepOrder: number): void {
  trackerInstance?.trackConversion(funnelName, stepName, stepOrder);
}

export default BehaviorTracker;
