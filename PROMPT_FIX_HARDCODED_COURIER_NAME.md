# PROMPT: Replace Hardcoded Courier Name with Real Data

## Problem
`src/components/home/LiveTrackingWidget.tsx:82` hardcodes a courier name:

```tsx
<Text style={styles.boldCourierName}>Jean-Pierre D.</Text> is en route with your custom orders.
```

This shows the same fake courier name to every user regardless of their actual order status.

## What to Do

### Option A: Fetch from Active Order (Recommended)
1. If there's an active order with a driver assigned, fetch the driver's name from the API
2. Use `useAuth()` to get user context, then fetch the active tracking order
3. Display the real driver name from the order data

Example approach:
```tsx
const [activeOrder, setActiveOrder] = useState<any>(null);

useEffect(() => {
  const fetchActiveOrder = async () => {
    try {
      const res = await api.get('/client/orders/active');
      const order = res.data.data;
      if (order?.driverName) setActiveOrder(order);
    } catch {}
  };
  fetchActiveOrder();
}, []);
```

Then render:
```tsx
<Text style={styles.boldCourierName}>
  {activeOrder?.driverName || 'Your courier'}
</Text>
```

### Option B: Remove the Widget Entirely
If there's no real data to show, this widget is just a decorative UI element with fake data. Consider removing it or replacing it with a generic "Track your order" button that navigates to the tracking screen.

### Option C: Make It Generic
Change to "Your courier is en route" without any name, so it's accurate for all users.

## Verify
1. Widget does not show a fake/unrealistic name
2. If using Option A, the real driver name appears when an order is in transit
3. If no order is active, the widget handles the empty state gracefully (hides or shows generic text)
