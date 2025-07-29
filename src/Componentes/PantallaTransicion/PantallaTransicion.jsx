import React from 'react';
import './PantallaTransicion.css';

const PantallaTransicion = ({ mensaje, onClose, boton = 'Cerrar', icono = null, soloIcono = false }) => {
  return (
    <div className="pantalla-transicion-backdrop">
      <div className="pantalla-transicion-contenido">
        {icono && (
          <div
            className="pantalla-transicion-icono"
            style={{ backgroundImage: `url(${icono})` }}
          />
        )}
        {!soloIcono && (
          <>
            <div className="pantalla-transicion-mensaje">{mensaje}</div>
            <button className="pantalla-transicion-boton" onClick={onClose}>{boton}</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PantallaTransicion;
