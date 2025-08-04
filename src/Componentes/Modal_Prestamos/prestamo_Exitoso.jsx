import React from 'react';
import './Modals.css';

const PrestamoExitoso = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-prestamo" style={{ padding: 0 }}>
      <div style={{ padding: '32px 24px 0 24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginTop: '8px', marginBottom: '12px' }}>
          {/* Icono de éxito */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ display: 'block', margin: '0 auto' }}>
            <circle cx="11" cy="11" r="10" stroke="#FFF9EC" strokeWidth="2" fill="none" />
            <polyline points="7,12 10,15 15,8" fill="none" stroke="#FFF9EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ alignSelf: 'stretch', color: '#FFF9EC', textAlign: 'center', fontFamily: 'League Spartan', fontSize: '24px', fontStyle: 'normal', fontWeight: 500, lineHeight: '32px', marginBottom: '8px' }}>
          Préstamo exitoso
        </div>
        <div className="modal-mensaje" style={{ marginBottom: '32px' }}>
          Se ha guardado el préstamo con éxito
        </div>
      </div>
      <button className="modal-btn" style={{ width: '329px', height: '68px', borderRadius: '0 0 28px 28px', margin: 0 }} onClick={onClose}>Aceptar</button>
    </div>
  </div>
);

export default PrestamoExitoso;
