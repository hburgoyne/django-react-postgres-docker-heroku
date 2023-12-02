import React from 'react';

const ConversationModal = ({ isOpen, onClose, topic }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ /* Add modal styling here */ }}>
      <div className="modal-content" style={{ /* Add content styling here */ }}>
        <span className="close-button" onClick={onClose} style={{ cursor: 'pointer' }}>
          &times;
        </span>
        <h2>Conversation about: {topic}</h2>
        {/* Placeholder for conversation data */}
        <p>Conversation content will go here...</p>
      </div>
    </div>
  );
};

export default ConversationModal;
