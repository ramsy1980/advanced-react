import { list } from '@keystone-next/keystone/schema';
import {
  text,
  integer,
  relationship,
  virtual,
  timestamp,
} from '@keystone-next/fields';
import formatMoney from '../lib/formatMoney';
import { isSignedIn, rules } from '../access';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  ui: {
    listView: {
      initialColumns: ['label', 'items', 'user', 'createdAt'],
    },
  },
  fields: {
    label: virtual({
      label: 'Order total',
      graphQLReturnType: 'String',
      resolver(item: { total: number }) {
        return `${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
    createdAt: timestamp({
      access: { create: false, read: true, update: false },
      defaultValue: () => new Date().toISOString(),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    updatedAt: timestamp({
      access: { create: false, read: true, update: false },
      hooks: {
        resolveInput: () => new Date().toISOString(),
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
