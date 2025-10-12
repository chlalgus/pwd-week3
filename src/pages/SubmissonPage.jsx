import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.button`
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background: ${props => props.approve ? '#4caf50' : '#ff4757'};
`;

function SubmissionsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => restaurantAPI.getSubmissions('pending'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await restaurantAPI.updateSubmission(id, { status });
    },
    onSuccess: () => {
      toast.success('상태 업데이트 완료');
      queryClient.invalidateQueries(['submissions']);
    },
    onError: () => toast.error('업데이트 실패'),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <PageContainer>
      <h2>제보 관리</h2>
      <ul>
        {data?.data.map(sub => (
          <li key={sub.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px' }}>
            <strong>{sub.restaurantName}</strong> ({sub.category}) - {sub.submitterName}
            <div style={{ marginTop: '0.5rem' }}>
              <Button approve onClick={() => updateStatusMutation.mutate({ id: sub.id, status: 'approved' })}>승인</Button>
              <Button onClick={() => updateStatusMutation.mutate({ id: sub.id, status: 'rejected' })}>거부</Button>
            </div>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

export default SubmissionsPage;
