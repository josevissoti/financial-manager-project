import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  
  log(component: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console.log(`🔍 [${timestamp}] ${component}: ${message}`, data || '');
  }

  error(component: string, message: string, error: any) {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] ${component}: ${message}`, error);
  }

  table(component: string, message: string, data: any) {
    console.log(`📊 [${component}] ${message}`);
    console.table(data);
  }
}