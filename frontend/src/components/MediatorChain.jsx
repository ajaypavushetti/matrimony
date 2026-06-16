import { FiPhone } from 'react-icons/fi';

function MediatorChain({ sourceMediator, mediators }) {
  const chainItems = [];

  chainItems.push({
    label: 'You',
    name: 'You',
    mobile: '',
    isYou: true,
  });

  if (mediators && mediators.length > 0) {
    mediators.forEach((m, i) => {
      chainItems.push({
        label: `Mediator ${i + 1}`,
        name: m.name || 'Unknown',
        mobile: m.mobile || '',
        isYou: false,
      });
    });
  }

  if (sourceMediator && sourceMediator.name) {
    chainItems.push({
      label: 'Source Mediator',
      name: sourceMediator.name,
      mobile: sourceMediator.mobile || '',
      location: sourceMediator.location || '',
      isSource: true,
    });
  }

  if (chainItems.length <= 1) {
    return <p className="text-muted">No mediator chain information available.</p>;
  }

  return (
    <div className="mediator-chain">
      {chainItems.map((item, index) => (
        <div className="mediator-chain-item" key={index}>
          <div className="mediator-chain-connector">
            <div
              className="mediator-chain-dot"
              style={{
                background: item.isYou ? '#D4A853' : item.isSource ? '#28A745' : '#8B1A4A',
              }}
            />
            {index < chainItems.length - 1 && <div className="mediator-chain-line" />}
          </div>
          <div className="mediator-chain-info">
            <h4>
              {item.isYou && '👤 '}
              {item.isSource && '📌 '}
              {item.label}
            </h4>
            {!item.isYou && <p>{item.name}</p>}
            {item.mobile && (
              <p>
                <FiPhone style={{ fontSize: '0.8rem', verticalAlign: 'middle' }} />{' '}
                {item.mobile}
              </p>
            )}
            {item.location && <p>📍 {item.location}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MediatorChain;
