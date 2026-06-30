// backend/src/audit/audit.decorador.ts
import { SetMetadata, applyDecorators } from '@nestjs/common';

export const Audit = (entityName: string, action: 'CREATE' | 'UPDATE' | 'DELETE' | string) => {
  return applyDecorators(
    SetMetadata('entityName', entityName),
    SetMetadata('action', action),
  );
};