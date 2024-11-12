import React, { CSSProperties } from 'react';

interface QuantityCardProps {
  title: string;
  quantity: number;
}

const QuantityCard: React.FC<QuantityCardProps> = ({ title, quantity }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.quantity}>{quantity}</p>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  card: {
    width: '200px',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
    margin: '10px',
  },
  title: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '10px',
  },
  quantity: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0070f3',
  },
};

export default QuantityCard;
