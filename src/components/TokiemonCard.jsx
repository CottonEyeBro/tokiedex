import React from 'react';

const TokiemonCard = ({ tokiemon }) => {
  return (
    <div className="tokiemon-card">
      <h3>ID: {tokiemon.id}</h3>
      {tokiemon.image && (
        <img
          src={tokiemon.image}
          alt={`Tokiemon ${tokiemon.id}`}
          className="tokiemon-card-image"
        />
      )}
      <p>Community: {tokiemon.community}</p>
      <p>Name: {tokiemon.name}</p>
      <p>Tier: {tokiemon.tier}</p>
      <p>Rarity: {tokiemon.rarity}</p>
    </div>
  );
};

export default TokiemonCard;