import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para cédula
 * Verifica que sea solo números
 */
export function cedulaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const cedula = control.value.toString().trim();
    const soloNumeros = /^\d+$/.test(cedula);

    if (!soloNumeros) {
      return { invalidCedula: true };
    }

    return null;
  };
}

/**
 * Validador personalizado para contraseña segura
 * Requiere: mayúscula, minúscula, número
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const password = control.value;
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);

    const esValida = tieneMinuscula && tieneMayuscula && tieneNumero;

    if (!esValida) {
      return { weakPassword: true };
    }

    return null;
  };
}

export function emailExisteValidator(servicioAutenticacion: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return null;
  };
}
