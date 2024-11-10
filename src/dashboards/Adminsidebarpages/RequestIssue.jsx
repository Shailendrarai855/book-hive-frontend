import React, { useState } from 'react';
import Adminsidebar from '../../components/Adminsidebar';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequestIssue = () => {
    const location = useLocation();
    const { data } = location.state || {};
    console.log(data);
    const adminId = data.adminId;

    const [requestIssue, setRequestIssue] = useState([]);

    const getAllRequest = async () => {
        try {
            const response = await fetch("http://localhost:8080/admin/getAllBookRequest");
            const res = await response.json();
            // Assuming res.data is the correct structure
            setRequestIssue(res.data || []);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleApprove = async (memberId, bookId) => {
        try {
            console.log(memberId, bookId, adminId);
            const response = await fetch(`http://localhost:8080/admin/issueBook/${memberId}/${adminId}/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ memberId, bookId, adminId }),
            });
            const res = await response.json();
            toast.success('Book Issued successfully');
            console.log(res);
        } catch (error) {
            console.log("err", error);
            toast.error('Error issuing book');
        }
    };

    return (
        <div className="flex text-white">
            <Adminsidebar data={data} />
            <div className="flex-1 p-6">
                <button
                    onClick={getAllRequest}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    Get All Requests
                </button>
                {requestIssue.length > 0 ? (
                    <table className="min-w-full bg-gray-800">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-700">Member ID</th>
                                <th className="py-2 px-4 border-b border-gray-700">Book ID</th>
                                <th className="py-2 px-4 border-b border-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestIssue.map((request, index) => (
                                <tr key={index} className="hover:bg-gray-700">
                                    <td className="py-2 px-4 border-b border-gray-700">{request.memberId}</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{request.bookId.join(', ')}</td>
                                    <td className="py-2 px-4 border-b border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(request.memberId, request.bookId[0])}
                                            className="bg-blue-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-red-500">No requests found.</p>
                )}
            </div>
        </div>
    );
};

export default RequestIssue;
