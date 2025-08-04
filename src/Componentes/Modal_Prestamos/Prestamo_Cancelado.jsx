import React from 'react';
import './Modals.css';

const PrestamoCancelado = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-prestamo" style={{ padding: 0 }}>
      <div style={{ padding: '32px 24px 0 24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginTop: '8px', marginBottom: '12px' }}>
          {/* Icono de advertencia más pequeño */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ display: 'block', margin: '0 auto' }}>
            <circle cx="11" cy="11" r="10" stroke="#FFF9EC" strokeWidth="2" fill="none" />
            <text x="11" y="15" textAnchor="middle" fill="#FFF9EC" fontSize="14" fontWeight="bold">!</text>
          </svg>
        </div>
        <div style={{ alignSelf: 'stretch', color: '#FFF9EC', textAlign: 'center', fontFamily: 'League Spartan', fontSize: '24px', fontStyle: 'normal', fontWeight: 500, lineHeight: '32px', marginBottom: '8px' }}>
          ¡Atención!
        </div>
        <div className="modal-mensaje" style={{ marginBottom: '32px' }}>
          Préstamo cancelado
        </div>
      </div>
      <button className="modal-btn" style={{ width: '329px', height: '68px', borderRadius: '0 0 28px 28px', margin: 0 }} onClick={onClose}>Aceptar</button>
    </div>
  </div>
);

export default PrestamoCancelado;