// Utilidades simples para gestionar el flujo de préstamo entre pantallas

const STORAGE_KEYS = {
  libro: 'prestamo_libro',
  usuario: 'prestamo_usuario',
};

export function setSelectedBook(libro) {
  try {
    localStorage.setItem(STORAGE_KEYS.libro, JSON.stringify(libro));
  } catch {}
}

export function getSelectedBook() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.libro);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSelectedBook() {
  try { localStorage.removeItem(STORAGE_KEYS.libro); } catch {}
}

export function setSelectedUser(usuario) {
  try {
    localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(usuario));
  } catch {}
}

export function getSelectedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.usuario);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSelectedUser() {
  try { localStorage.removeItem(STORAGE_KEYS.usuario); } catch {}
}

export function clearAllLoanData() {
  clearSelectedBook();
  clearSelectedUser();
}
