type EventType = 'page_view' | 'button_click' | 'form_submit' | 'error';

interface AnalyticsEvent {
  type: EventType;
  page?: string;
  data?: Record<string, any>;
}

class Analytics {
  private static instance: Analytics;
  
  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  trackEvent({ type, page, data }: AnalyticsEvent): void {
    // In production, this would send data to your analytics service
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', { type, page, data });
    }
  }

  trackError(error: Error): void {
    this.trackEvent({
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

export const analytics = Analytics.getInstance();