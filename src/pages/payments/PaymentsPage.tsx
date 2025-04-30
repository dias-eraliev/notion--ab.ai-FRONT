import { useEffect, useState } from "react";
import { getPayments } from "../../entities/payment/api/payment.api";
import { Payment } from "../../shared/types/payment";
import { PaymentTable } from "../../entities/payment/ui/PaymentTable";
import { PaymentFilter } from "../../features/payment-filter/ui/PaymentFilter";
import { PaymentStats } from "../../features/payment-stats/ui/PaymentStats";

export const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    getPayments(filters).then(setPayments);
  }, [filters]);

  return (
    <div className="p-6 flex flex-col justify-center ">
      <h1 className="text-xl font-bold mb-4">Оплаты и задолженности</h1>

      <PaymentFilter onChange={setFilters} />
      <PaymentStats payments={payments} />
      <PaymentTable payments={payments} />
    </div>
  );
};
