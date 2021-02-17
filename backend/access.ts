import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// At it's simplest, the access control returns a yes or no value depending on the users session

export const isSignedIn = ({ session }: ListAccessArgs): boolean => !!session;

interface RulesAndPermissions<T = boolean | Record<string, unknown>> {
  [key: string]: ({ session }: ListAccessArgs) => T;
}

const generatedPermissions: RulesAndPermissions<boolean> = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    ({ session }: ListAccessArgs): boolean =>
      !!session?.data.role?.[permission],
  ])
);

// Permissions check if someone meets a criteria - yes or no.
export const permissions: RulesAndPermissions<boolean> = {
  ...generatedPermissions,
  isAwesome({ session }) {
    return !!session?.data.name.includes('Ramsy');
  },
};

// Rule based function
// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
export const rules: RulesAndPermissions = {
  canManageProducts({ session }) {
    if (!isSignedIn({ session })) return false;
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) return true;

    // 2. If not, do they own this item?
    return { user: { id: session?.itemId } };
  },
  canOrder: ({ session }) => {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;

    return { user: { id: session?.itemId } };
  },
  canManageOrderItems: ({ session }) => {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageCart({ session })) return true;

    return { order: { user: { id: session?.itemId } } };
  },
  canReadProducts({ session }) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) return true;
    // They should only see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
  canManageUsers: ({ session }) => {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageUsers({ session })) return true;
    // Otherwise they may only update theirselves
    return { id: session?.itemId };
  },
};
