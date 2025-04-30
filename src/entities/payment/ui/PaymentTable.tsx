import { Payment } from "../../../shared/types/payment";
import { format } from "date-fns";

type Props = {
  payments: Payment[];
};

export const PaymentTable = ({ payments }: Props) => (
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full table-auto border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Студент</th>
          <th className="p-2 text-left">Тип</th>
          <th className="p-2 text-left">Сумма</th>
          <th className="p-2 text-left">Статус</th>
          <th className="p-2 text-left">Дедлайн</th>
          <th className="p-2 text-left">Оплачено</th>
          <th className="p-2 text-left">Документы</th>
        </tr>
      </thead>
      <tbody>
        {/* Sample */}
        <tr className="border-t">
            <td className="p-2">1</td>
            <td className="p-2">Kaisar Nazar</td>
            <td className="p-2">PAID</td>
            <td className="p-2">500</td>
            <td className="p-2">PAID</td>
            <td className="p-2">12.12.2004</td>
            <td className="p-2">
                -
            </td>
            <td className="p-2">
                
                <ul className="list-disc pl-4 list-none">
                    <li> 
                        <a
                        href='#'
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                        >
                        docs    
                        </a>
                    </li>
                    <li>
                        <a
                        href='#'
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                        >
                        docs2  
                        </a>
                    </li>
                </ul>
                
            </td>
        </tr>
        {payments.map((payment) => (
          <tr key={payment.id} className="border-t">
            <td className="p-2">{payment.id}</td>
            <td className="p-2">{payment.student?.fullName || "—"}</td>
            <td className="p-2">{payment.type}</td>
            <td className="p-2">{payment.amount}</td>
            <td className="p-2">{payment.status}</td>
            <td className="p-2">{format(new Date(payment.dueDate), "dd.MM.yyyy")}</td>
            <td className="p-2">
              {payment.paidAt ? format(new Date(payment.paidAt), "dd.MM.yyyy") : "—"}
            </td>
            <td className="p-2">
              {payment.documents && payment.documents.length > 0 ? (
                <ul className="list-disc pl-4">
                  {payment.documents.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
