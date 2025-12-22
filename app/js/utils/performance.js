/**
 * Performance Monitoring Module
 * Tracks load times, render times, and logs slow operations
 */

const SLOW_THRESHOLD = 100; // ms - log anything slower than this
const metrics = {
    pageLoad: null,
    appInit: null,
    tabSwitches: [],
    slowOperations: []
};

let startTime = performance.now();

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
    // Measure initial page load
    measurePageLoad();

    // Log initialization time
    const initTime = performance.now() - startTime;
    metrics.appInit = initTime;
    console.log(`[Perf] App initialized in ${initTime.toFixed(0)}ms`);

    // Expose debug function
    window.showPerformanceReport = showPerformanceReport;

    // Track Long Tasks (if supported)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > SLOW_THRESHOLD) {
                        logSlowOperation('Long Task', entry.duration);
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Long tasks not supported in all browsers
        }
    }

    // Track Core Web Vitals
    trackCoreWebVitals();
}

/**
 * Measure page load time
 */
function measurePageLoad() {
    if (performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;

        if (loadTime > 0) {
            metrics.pageLoad = loadTime;
            console.log(`[Perf] Page loaded in ${loadTime}ms`);
        } else {
            // Load event hasn't finished yet
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const finalTiming = performance.timing;
                    metrics.pageLoad = finalTiming.loadEventEnd - finalTiming.navigationStart;
                    console.log(`[Perf] Page loaded in ${metrics.pageLoad}ms`);
                }, 0);
            });
        }
    }
}

/**
 * Track Core Web Vitals (LCP, FID, CLS)
 */
function trackCoreWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    // Largest Contentful Paint (LCP)
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.lcp = lastEntry.startTime;
            console.log(`[Perf] LCP: ${lastEntry.startTime.toFixed(0)}ms`);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) { }

    // First Input Delay (FID)
    try {
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const firstEntry = entries[0];
            metrics.fid = firstEntry.processingStart - firstEntry.startTime;
            console.log(`[Perf] FID: ${metrics.fid.toFixed(0)}ms`);
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) { }

    // Cumulative Layout Shift (CLS)
    try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            metrics.cls = clsValue;
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) { }
}

/**
 * Start timing an operation
 */
export function startTiming(label) {
    return {
        label,
        start: performance.now()
    };
}

/**
 * End timing an operation
 */
export function endTiming(timer) {
    const duration = performance.now() - timer.start;

    if (duration > SLOW_THRESHOLD) {
        logSlowOperation(timer.label, duration);
    }

    return duration;
}

/**
 * Time a function execution
 */
export async function timeFunction(label, fn) {
    const timer = startTiming(label);
    try {
        const result = await fn();
        const duration = endTiming(timer);
        return { result, duration };
    } catch (error) {
        endTiming(timer);
        throw error;
    }
}

/**
 * Log slow operation
 */
function logSlowOperation(label, duration) {
    const entry = {
        label,
        duration: Math.round(duration),
        timestamp: new Date().toISOString()
    };

    metrics.slowOperations.push(entry);

    // Keep only last 50 slow operations
    if (metrics.slowOperations.length > 50) {
        metrics.slowOperations.shift();
    }

    console.warn(`[Perf] Slow operation: ${label} took ${duration.toFixed(0)}ms`);
}

/**
 * Track tab switch time
 */
export function trackTabSwitch(tabName, duration) {
    metrics.tabSwitches.push({
        tab: tabName,
        duration: Math.round(duration),
        timestamp: new Date().toISOString()
    });

    // Keep only last 20 tab switches
    if (metrics.tabSwitches.length > 20) {
        metrics.tabSwitches.shift();
    }

    if (duration > SLOW_THRESHOLD) {
        console.warn(`[Perf] Slow tab switch to ${tabName}: ${duration.toFixed(0)}ms`);
    }
}

/**
 * Show performance report in console
 */
function showPerformanceReport() {
    console.group('📊 Performance Report');

    console.log('=== Load Times ===');
    console.log(`Page Load: ${metrics.pageLoad}ms`);
    console.log(`App Init: ${metrics.appInit?.toFixed(0)}ms`);

    if (metrics.lcp) console.log(`LCP: ${metrics.lcp.toFixed(0)}ms`);
    if (metrics.fid) console.log(`FID: ${metrics.fid.toFixed(0)}ms`);
    if (metrics.cls) console.log(`CLS: ${metrics.cls.toFixed(4)}`);

    console.log('\n=== Tab Switches ===');
    if (metrics.tabSwitches.length > 0) {
        const avgTabSwitch = metrics.tabSwitches.reduce((a, b) => a + b.duration, 0) / metrics.tabSwitches.length;
        console.log(`Average: ${avgTabSwitch.toFixed(0)}ms`);
        console.table(metrics.tabSwitches.slice(-5));
    } else {
        console.log('No tab switches recorded');
    }

    console.log('\n=== Slow Operations ===');
    if (metrics.slowOperations.length > 0) {
        console.table(metrics.slowOperations.slice(-10));
    } else {
        console.log('No slow operations recorded');
    }

    console.groupEnd();

    return metrics;
}

/**
 * Get current metrics
 */
export function getMetrics() {
    return { ...metrics };
}

/**
 * Check if app performance is good
 */
export function isPerformanceGood() {
    const avgTabSwitch = metrics.tabSwitches.length > 0
        ? metrics.tabSwitches.reduce((a, b) => a + b.duration, 0) / metrics.tabSwitches.length
        : 0;

    return {
        pageLoadOk: metrics.pageLoad < 3000,
        tabSwitchOk: avgTabSwitch < 200,
        fewSlowOps: metrics.slowOperations.length < 10
    };
}
