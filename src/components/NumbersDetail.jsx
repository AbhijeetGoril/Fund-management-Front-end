import { UserIcon,CheckCircleIcon,XCircleIcon,CheckIcon } from "@heroicons/react/20/solid";

const NumbersDetail = ({members,setMembers}) => {
  const markAsPaid = (id) => {
    const updatedMembers = members.map(member => 
      member.id === id ? { ...member, hasPaid: true, amount: 500 } : member
    );
    setMembers(updatedMembers);
  };
  return (
    <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Member</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600 hidden md:table-cell">Email</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="p-3 md:p-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition border-t">
                      <td className="p-3 md:p-4 font-medium text-gray-800">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500 md:hidden">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 md:p-4 text-gray-700 hidden md:table-cell">{member.email}</td>
                      <td className="p-3 md:p-4">
                        {member.hasPaid ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center w-fit">
                            <CheckCircleIcon className="h-4 w-4 mr-1" /> Paid
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center w-fit">
                            <XCircleIcon className="h-4 w-4 mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 md:p-4 font-medium text-gray-700">₹{member.amount}</td>
                      <td className="p-3 md:p-4">
                        {!member.hasPaid && (
                          <button
                            onClick={() => markAsPaid(member.id)}
                            className="px-3 py-1.5 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
                          >
                            <CheckIcon className="h-4 w-4 mr-1" /> Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  )
}

export default NumbersDetail