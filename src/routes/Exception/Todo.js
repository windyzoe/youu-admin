import React from 'react';
import img from '@/assets/statusImg/建设中.svg';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <img src={img} style={{ height: '80vh' }} alt="建设中" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 'auto' }}>
        <div>
          <h1 style={{ fontSize: '3rem' }}>功能建设中...</h1>
        </div>
      </div>
    </div>
  );
}
