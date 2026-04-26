export const getStatusColor = (status) => {
  const statusMap = {
    published: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Active'
    },
    matched: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Matched'
    },
    resolved: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Resolved'
    },
    archived: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Archived'
    },
    under_review: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Reviewing'
    },
    pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending'
    },
    accepted: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Accepted'
    },
    rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected'
    }
  };

  return statusMap[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
};
