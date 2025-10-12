import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #5a67d8;
  }
`;

function AdminPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantAPI.getRestaurants,
  });

  const [form, setForm] = useState({
    name: '',
    category: '',
    location: '',
    priceRange: '',
    rating: '',
    description: '',
    recommendedMenu: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addRestaurantMutation = useMutation({
    mutationFn: async (newRestaurant) => {
      const response = await restaurantAPI.addRestaurant(newRestaurant);
      return response;
    },
    onSuccess: () => {
      toast.success('맛집 추가 완료!');
      queryClient.invalidateQueries(['restaurants']);
    },
    onError: () => toast.error('맛집 추가 실패'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      recommendedMenu: form.recommendedMenu.split(',').map(s => s.trim()),
      rating: parseFloat(form.rating),
    };
    addRestaurantMutation.mutate(payload);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <PageContainer>
      <h2>Admin - 맛집 관리</h2>

      <form onSubmit={handleSubmit}>
        {['name','category','location','priceRange','rating','description','recommendedMenu'].map(key => (
          <FormGroup key={key}>
            <label>{key}</label>
            <Input 
              name={key} 
              value={form[key]} 
              onChange={handleChange} 
              placeholder={key} 
            />
          </FormGroup>
        ))}
        <Button type="submit">추가</Button>
      </form>

      <h3>맛집 목록</h3>
      <ul>
        {data?.data.map(r => (
          <li key={r.id}>
            {r.name} ({r.category}) - {r.rating}점
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

export default AdminPage;
