import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // Only people with the permission can delete themselves.
    // You can delete yourself
    delete: permissions.canManageUsers,
  },
  ui: {
    listView: {
      initialColumns: ['email', 'name', 'password', 'role'],
    },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    products: relationship({
      ref: 'Product.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    role: relationship({
      ref: 'Role.assignedTo',
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        createView: {
          fieldMode: (props) =>
            permissions.canManageUsers(props) ? 'edit' : 'hidden',
        },
        itemView: {
          fieldMode: (props) =>
            permissions.canManageUsers(props) ? 'edit' : 'read',
        },
      },
    }),
  },
});
