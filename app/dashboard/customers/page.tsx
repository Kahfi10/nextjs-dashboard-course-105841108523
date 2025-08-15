import CustomersTable from '@/app/ui/customers/table';
import { customers } from '@/app/lib/placeholder-data';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Customers | Acme Dashboard',
};

export default function CustomersPage({ searchParams }: { searchParams?: { query?: string } }) {
	const { invoices } = require('@/app/lib/placeholder-data');
	const query = searchParams?.query?.toLowerCase() || '';

	const filteredCustomers = customers.filter((customer) =>
		customer.name.toLowerCase().includes(query) || customer.email.toLowerCase().includes(query)
	);

	const formattedCustomers = filteredCustomers.map((customer) => {
		const customerInvoices = invoices.filter((inv: { customer_id: string; status: string; amount: number }) => inv.customer_id === customer.id);
		const total_invoices = customerInvoices.length;
		const total_pending = customerInvoices
			.filter((inv: { status: string; amount: number }) => inv.status === 'pending')
			.reduce((sum: number, inv: { status: string; amount: number }) => sum + inv.amount, 0);
		const total_paid = customerInvoices
			.filter((inv: { status: string; amount: number }) => inv.status === 'paid')
			.reduce((sum: number, inv: { status: string; amount: number }) => sum + inv.amount, 0);
		return {
			...customer,
			total_invoices,
			total_pending: `$${(total_pending / 100).toFixed(2)}`,
			total_paid: `$${(total_paid / 100).toFixed(2)}`,
		};
	});

	return <CustomersTable customers={formattedCustomers} />;
}