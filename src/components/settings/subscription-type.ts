interface Invoice {
  _id: string;
  orgId: string;
  subscriptionId: string;
  invoiceNo: string;
  type: string;
  seatCount: number;
  totalAmount: number;
  created_At: string;
  status: "Paid" | "Unpaid";
  createdAt: string;
  updatedAt: string;
  __v: number;
  razorpay_order_id?: string;
  fee?: number;
  paidAt?: string;
  paidBy?: string;
  paymentMethod?: string;
  razorpay_payment_id?: string;
  tax?: number;
  isChecked: boolean;
}

interface BillingDetails {
  paymentMethod: string;
  lastPaymentDate: string;
}

interface Organisation {
  _id: string;
  name: string;
  legal_entity_name: string;
  email: string;
  notification: boolean;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Address {
  _id: string;
  userId: string;
  orgId: string;
  title: string;
  phone: string;
  landmark: string;
  address: string;
  state: string;
  city: string;
  pinCode: string;
  isPrimary: boolean;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Plan {
  _id: string;
  planName: string;
  billingCycles: string;
  pricingPerSeat: number;
}

interface Subscription {
  _id: string;
  orgId: string;
  planId: string;
  planStatus: string;
  billingCycle: string;
  pricingPerMonthPerSeat?: number;
  pricingPerYearPerSeat?: number;
  startDate: string;
  trialEndDate: string;
  customPrice?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  billingDetails: BillingDetails;
  nextDueDate: string;
  totalUsers: number;
  invoices: Invoice[];
  latestPaidInvoice: Omit<Invoice, "isChecked">;
  organisation: Organisation;
  address: Address;
  plan: Plan;
  isCancelled?: boolean;
  activeUserCount?: number;
  expiredOn?: string | null;
  isUpgradeRequested?: any;
}

export type SubscriptionResponse = Subscription[];