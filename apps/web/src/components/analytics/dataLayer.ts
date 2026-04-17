// Google Tag Manager dataLayer helper functions

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function pushToDataLayer(data: Record<string, any>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
}

// E-commerce Events
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  variant?: string;
}) {
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'TRY',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Genel',
        item_variant: product.variant,
        price: product.price,
        quantity: product.quantity,
      }],
    },
  });
}

export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  pushToDataLayer({
    event: 'remove_from_cart',
    ecommerce: {
      currency: 'TRY',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }],
    },
  });
}

export function trackBeginCheckout(items: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
}>, total: number) {
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'TRY',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
}

export function trackPurchase(orderData: {
  transaction_id: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}) {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderData.transaction_id,
      value: orderData.value,
      tax: orderData.tax || 0,
      shipping: orderData.shipping || 0,
      currency: orderData.currency || 'TRY',
      items: orderData.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      })),
    },
  });
}

// User Events
export function trackSignUp(method: string = 'email') {
  pushToDataLayer({
    event: 'sign_up',
    method: method,
  });
}

export function trackLogin(method: string = 'email') {
  pushToDataLayer({
    event: 'login',
    method: method,
  });
}

// Engagement Events
export function trackContactFormSubmission(formId: string = 'contact_form') {
  pushToDataLayer({
    event: 'contact',
    form_id: formId,
  });
}

export function trackNewsletterSubscription(formId: string = 'newsletter') {
  pushToDataLayer({
    event: 'subscribe',
    form_id: formId,
  });
}

export function trackPageView(pageTitle?: string, pageLocation?: string) {
  pushToDataLayer({
    event: 'page_view',
    page_title: pageTitle || document.title,
    page_location: pageLocation || window.location.href,
  });
}

export function trackSearch(searchTerm: string) {
  pushToDataLayer({
    event: 'search',
    search_term: searchTerm,
  });
}
