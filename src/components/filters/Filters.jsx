import React from 'react';
import './index.scoped.css';
import PropTypes from 'prop-types';

export default function Filters({data, type}) {
  if (!data?.length) {
    return (
      <>
        <div>No data provided.</div>
      </>
    );
  }

  if (type === 'list')
    return (
      <>
        <div />
      </>
    );

  return (
    <>
      <div>
        {data.map(item => (
          <div>
            <img src={item.images[0].thumbnailUrl} />
            <p>Name: {item.name}</p>
            <p>Price: {item.originalPrice}</p>
          </div>
        ))}
      </div>
    </>
  );
}

Filters.propTypes = {
  type: PropTypes.oneOf(['list', 'grid']),
  data: PropTypes.array,
};
