import Stripe from "stripe";

const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;

if (!hasStripeKey) {
  console.log('Stripe secret key not provided - payment features will return mock responses');
}

const stripe = hasStripeKey 
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })
  : null;

export interface StripeKPIs {
  monthlyRevenue: number;
  revenueChange: number;
  totalCustomers: number;
  activeSubscriptions: number;
  churnRate: number;
}

export class StripeService {
  async createPaymentIntent(amount: number, currency: string = "usd"): Promise<string> {
    if (!stripe) {
      // Return mock response when Stripe is not configured
      return "pi_mock_" + Math.random().toString(36).substr(2, 9);
    }
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      });
      return paymentIntent.client_secret || "";
    } catch (error: any) {
      throw new Error(`Stripe payment intent error: ${error.message}`);
    }
  }

  async createSubscription(customerId: string, priceId: string): Promise<any> {
    if (!stripe) {
      // Return mock response when Stripe is not configured
      return {
        id: "sub_mock_" + Math.random().toString(36).substr(2, 9),
        customer: customerId,
        status: "active",
        items: { data: [{ price: { id: priceId } }] }
      };
    }
    
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      return subscription;
    } catch (error: any) {
      throw new Error(`Stripe subscription error: ${error.message}`);
    }
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    if (!stripe) {
      // Return mock response when Stripe is not configured
      return {
        id: "cus_mock_" + Math.random().toString(36).substr(2, 9),
        email,
        name,
        object: "customer",
        created: Math.floor(Date.now() / 1000),
        livemode: false,
      } as Stripe.Customer;
    }
    
    try {
      return await stripe.customers.create({ email, name });
    } catch (error: any) {
      throw new Error(`Stripe customer creation error: ${error.message}`);
    }
  }

  async getKPIMetrics(): Promise<StripeKPIs> {
    if (!stripe) {
      // Return mock KPI data when Stripe is not configured
      return {
        monthlyRevenue: 15420.50,
        revenueChange: 12.3,
        totalCustomers: 156,
        activeSubscriptions: 89,
        churnRate: 2.1,
      };
    }
    
    try {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

      // Get current month revenue
      const currentRevenue = await this.getRevenueForPeriod(currentMonth, now);
      const lastMonthRevenue = await this.getRevenueForPeriod(lastMonth, currentMonth);

      // Calculate revenue change
      const revenueChange = lastMonthRevenue > 0 
        ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Get customer metrics
      const customers = await stripe.customers.list({ limit: 100 });
      const totalCustomers = customers.data.length;

      // Get subscription metrics
      const subscriptions = await stripe.subscriptions.list({ 
        status: 'active',
        limit: 100 
      });
      const activeSubscriptions = subscriptions.data.length;

      // Calculate basic churn rate (simplified)
      const canceledSubs = await stripe.subscriptions.list({ 
        status: 'canceled',
        created: { gte: Math.floor(lastMonth.getTime() / 1000) },
        limit: 100 
      });
      const churnRate = activeSubscriptions > 0 
        ? (canceledSubs.data.length / activeSubscriptions) * 100 
        : 0;

      return {
        monthlyRevenue: currentRevenue / 100, // Convert from cents
        revenueChange: Math.round(revenueChange * 10) / 10,
        totalCustomers,
        activeSubscriptions,
        churnRate: Math.round(churnRate * 10) / 10,
      };
    } catch (error: any) {
      throw new Error(`Stripe KPI metrics error: ${error.message}`);
    }
  }

  private async getRevenueForPeriod(start: Date, end: Date): Promise<number> {
    if (!stripe) {
      return 0;
    }
    
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(start.getTime() / 1000),
        lt: Math.floor(end.getTime() / 1000),
      },
      limit: 100,
    });

    return charges.data
      .filter(charge => charge.paid)
      .reduce((sum, charge) => sum + charge.amount, 0);
  }
}

export const stripeService = new StripeService();
